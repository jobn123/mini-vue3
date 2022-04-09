import { isObject } from '../shared/index'
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly"
}

export const reactive = (raw) => {
  return createActiveObject(raw, mutableHandlers)
}

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
}

export const shallowReadonly = (raw) => {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

function createActiveObject(raw, baseHandlers) {
  if (!isObject(raw)) {
    console.warn(`target ${raw} 必须为一个对象`)
    return raw
  }
  return new Proxy(raw, baseHandlers)
}

// 实现思路
// 取值操作出发对象的get方法判断
export const isReactive = (raw) => {
  return !!raw[ReactiveFlags.IS_REACTIVE]
}

export const isReadonly = (raw) => {
  return !!raw[ReactiveFlags.IS_READONLY]
}

export const isProxy = (raw) => {
  return isReactive(raw) || isReadonly(raw)
}