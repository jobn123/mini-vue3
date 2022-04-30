// import { isObject } from '../shared/index'
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
    patch(vnode, container, null)
  }

  function patch(vnode, container, parentComponent) {
    // 是element处理element 否则视为组件
    const { shapeFlag, type } = vnode

    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break;
      case Text:
        processText(vnode, container)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理element
          processElement(vnode, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理组件
          processComponent(vnode, container, parentComponent)
        }
        break;
    }

  }

  function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }

  function processElement(vnode, container, parentComponent) {

    const el = (vnode.el = hostCreateElement(vnode.type));

    const { children, shapeFlag } = vnode

    // content
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent)
    }

    // props
    const { props } = vnode
    for (const key in props) {
      const val = props[key]

      hostPatchProp(el, key, val)
    }

    // container.append(el)
    hostInsert(el, container)
  }

  function mountComponent(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.forEach((v) => {
      patch(v, container, parentComponent)
    })
  }

  function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    // vnode -> patch
    patch(subTree, container, instance)

    initialVnode.el = subTree.el
  }

  function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode.children, container, parentComponent)
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode
    const textNode = (vnode.el = document.createTextNode(children))
    container.append(textNode)
  }

  setupRenderEffect
  return {
    createApp: createAppAPI(render)
  }
}
