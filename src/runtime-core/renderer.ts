import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  // patch()
  patch(vnode, container)
}

function patch(vnode, container) {
  // TODO 判断vnode是否为element类型
  // 是element处理element 否则视为组件
  // processElement(vnode, container)
  // 处理组件
  processComponent(vnode, container)
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render()

  // vnode -> patch
  patch(subTree, container)
}