import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  // patch()
  patch(vnode, container)
}

function patch(vnode, container) {
  // TODO 判断vnode是否为element类型
  // 是element处理element 否则视为组件

  if (typeof vnode.type === "string") {
    // 处理element
    processElement(vnode, container)
  } else {
    // 处理组件
    processComponent(vnode, container)
  }
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function processElement(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type));

  const { children } = vnode

  // content
  if (typeof children === "string") {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(children, el)
  }

  // props
  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.append(el)
}

function mountComponent(initialVnode, container) {
  const instance = createComponentInstance(initialVnode)

  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}

function mountChildren(vnode, container) {
  vnode.forEach((v) => {
    patch(v, container)
  })
}

function setupRenderEffect(instance, initialVnode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  // vnode -> patch
  patch(subTree, container)

  initialVnode.el = subTree.el
}