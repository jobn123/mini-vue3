// import { isObject } from '../shared/index'
import { effect } from '../reactive/effect';
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode'

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert
  } = options;

  function render(vnode, container) {
    patch(null, vnode, container, null)
  }

  // n1 -> 旧的虚拟节点
  // n2 -> 新的虚拟节点
  function patch(n1, n2, container, parentComponent) {
    // 是element处理element 否则视为组件
    const { shapeFlag, type } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理element
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理组件
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }

  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function patchElement(n1, n2, container) {
    console.log("patchElement")
    console.log("n1", n1)
    console.log("n2", n2)
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }

  function mountComponent(n2, container, parentComponent) {
    const instance = createComponentInstance(n2, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance, n2, container)
  }

  function mountElement(vnode, container, parentComponent) {
    const el = (vnode.el = hostCreateElement(vnode.type));

    const { children, shapeFlag } = vnode

    // content
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }

    // props
    const { props } = vnode
    for (const key in props) {
      const val = props[key]

      hostPatchProp(el, key, val)
    }

    hostInsert(el, container)
  }

  function mountChildren(n2, container, parentComponent) {
    n2.children.forEach((v) => {
      patch(null, v, container, parentComponent)
    })
  }

  function setupRenderEffect(instance, initialVnode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init")
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        console.log(subTree)

        // vnode -> patch
        patch(null, subTree, container, instance)

        initialVnode.el = subTree.el
        instance.isMounted = true
      } else {
        console.log("update")
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const preSubTree = instance.subTree
        instance.subTree = subTree

        patch(preSubTree, subTree, container, instance)
      }

    })
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
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
