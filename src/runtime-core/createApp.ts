import { createVNode } from './vnode'
import { render } from './renderer'

export function createApp(rootComponent) {

  return {
    mount(rootContainer) {
      // 先转换为虚拟节点
      // 后续所有操作都基于虚拟节点
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    }
  }
}

