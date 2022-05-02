// import { isObject } from '../shared/index'
import { effect } from '../reactive/effect';
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { shouldUpdateComponent } from './componentUpdateUtils';
import { createAppAPI } from './createApp';
import { queueJobs } from './scheduler';
import { Fragment, Text } from './vnode'

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options;

  function render(vnode, container) {
    patch(null, vnode, container, null, null)
  }

  // n1 -> 旧的虚拟节点
  // n2 -> 新的虚拟节点
  function patch(n1, n2, container, parentComponent, anchor) {
    // 是element处理element 否则视为组件
    const { shapeFlag, type } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理element
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理组件
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break;
    }

  }

  function processComponent(n1, n2, container, parentComponent, anchor) {

    if (!n1) {
      // 创建组件
      mountComponent(n2, container, parentComponent, anchor)
    } else {
      // 更新组件
      updateComponent(n1, n2)
    }

  }

  function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component)
    // 判断props是否改变如果没改变无需调用update
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2
      instance.update()
    } else {
      n2.el = n1.el
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log("patchElement")
    console.log("n1", n1)
    console.log("n2", n2)

    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const preShapeFlag = n1.shapeFlag
    const { shapeFlag } = n2

    // 新节点是text, 老节点是array
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 清空老的children
        unmountChildren(n1.children);
        // 设置text
      }
      if (n1.children !== n2.children) {
        hostSetElementText(container, n2.children)
      }
    } else {
      if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "")
        mountChildren(n2, container, parentComponent, anchor)
      } else {
        // array diff array
        patchKeyedChildren(n1.children, n2.children, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    let i = 0;
    let e1 = c1.length - 1
    let e2 = c2.length - 1

    function isSomeVNodeType(n1, n2) {
      // 判断类型是否一致
      // 判断key是否一致
      return n1.type === n2.type && n1.key === n2.key
    }

    // 左侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]

      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      i++
    }

    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      e1--;
      e2--;
    }

    // 新的比老的多
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < c2.length ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      // 中间对比
      let s1 = i;
      let s2 = i;

      // 需要对比的节点数量
      const toBePatched = e2 - s2
      // 已经对比的节点数量
      let patched = 0
      // 先建立新节点的key映射表
      const keyToNewIndexMap = new Map();
      // 初始化最长递增子序列索引
      const newIndexToOldIndexMap = new Array(toBePatched)
      let moved = false;
      // 记录移动最长索引值
      let maxNewIndexSoFar = 0;

      for (let i = 0; i < toBePatched; i++) {
        newIndexToOldIndexMap[i] = 0
      }

      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }

      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]

        // 如果新节点全部检测完毕还有旧节点，无需对比直接删除
        if (patched >= toBePatched) {
          hostRemove(prevChild.el)
          continue
        }

        let newIndex
        // 用户传了key取Map中查找
        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // 用户可能没有传key遍历
          for (let j = s2; j <= e2; j++) {
            // 在新节点中找到了 跳出循环
            if (isSomeVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break
            }
          }
        }

        // 新节点中不存在删除旧节点
        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          // 判断是否需要移动
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          // 让索引从零开始
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          // 存在 继续对比
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }

      // 获取最长递增子序列
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []

      // 倒叙排
      let j = increasingNewIndexSequence.length - 1

      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null

        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            console.log("移动位置")
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }
      }
    }

  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el

      hostRemove(el)
    }
  }

  const EMPTY_OBJ = {}

  function patchProps(el, oldProps, newProps) {

    if (oldProps === newProps) return

    for (const key in newProps) {
      const preProp = oldProps[key]
      const nextProp = newProps[key]

      if (preProp !== nextProp) {
        hostPatchProp(el, key, preProp, nextProp)
      }
    }

    if (oldProps === EMPTY_OBJ) return

    for (const key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null)
      }
    }
  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  function mountComponent(initialVnode, container, parentComponent, anchor) {
    const instance = (initialVnode.component = createComponentInstance(initialVnode, parentComponent))

    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container, anchor)
  }

  function mountElement(vnode, container, parentComponent, anchor) {
    const el = (vnode.el = hostCreateElement(vnode.type));

    const { children, shapeFlag } = vnode

    // content
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent, anchor)
    }

    // props
    const { props } = vnode
    for (const key in props) {
      const val = props[key]

      hostPatchProp(el, key, null, val)
    }

    hostInsert(el, container, anchor)
  }

  function mountChildren(n2, container, parentComponent, anchor) {
    n2.children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor)
    })
  }

  function setupRenderEffect(instance, initialVnode, container, anchor) {
    instance.update = effect(() => {
      if (!instance.isMounted) {
        console.log("init")
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        console.log(subTree)

        // vnode -> patch
        patch(null, subTree, container, instance, anchor)

        initialVnode.el = subTree.el
        instance.isMounted = true
      } else {
        console.log("update")

        const { next, vnode } = instance
        if (next) {
          next.el = vnode.el
          updateComponentRender(instance, next)
        }
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const preSubTree = instance.subTree
        instance.subTree = subTree

        patch(preSubTree, subTree, container, instance, anchor)
      }
    }, {
      scheduler() {
        console.log('update - scheduler')
        queueJobs(instance.update)
      }
    })
  }

  function processFragment(n1, n2: any, container: any, parentComponent, anchor) {
    mountChildren(n2.children, container, parentComponent, anchor)
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  // setupRenderEffect
  return {
    createApp: createAppAPI(render)
  }
}

function updateComponentRender(instance, nextVNode) {
  instance.vnode = nextVNode
  instance.next = null

  instance.props = nextVNode.props
}

// 获取最长递增子序列
function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
