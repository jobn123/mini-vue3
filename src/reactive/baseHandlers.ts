import { extend } from '../shared'
import { isObject } from '../shared'
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from './reactive'

const createGetter = (isReadonly = false, isShallow = false) => {
  return function get(target, key) {

    // 不是只读 就是一个响应式对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }

    // 只读标识
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key);

    if (isShallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    // 依赖收集
    if (!isReadonly) {
      track(target, key)
    }

    return res
  }
}

const createSetter = () => {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    // 触发依赖 
    trigger(target, key, value);
    return res
  }
}

// 避免每次都重新创建
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`warn: readonly ${target} can not be set `)
    return true
  }
}

// attention
// extend前面要包一个空对象 否则会影响到readonlyHandlers
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})
