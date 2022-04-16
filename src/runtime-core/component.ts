import { shallowReadonly } from '../reactive/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { initSlots } from './componentSlots'
import { PublicInstanceProxyHandlers } from './componnetPublicInstance'

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: () => { }
  }
  component.emit = emit.bind(null, component) as any
  return component
}

export function setupComponent(instance) {
  // initProps
  initProps(instance, instance.vnode.props)
  // initSlots
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  const { setup } = Component

  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })

    handleSetupResult(instance, setupResult)
  }

}

function handleSetupResult(instance, setupResult) {
  // function object
  if (typeof setupResult === "object") {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type
  if (Component.render) {
    instance.render = Component.render
  }
}