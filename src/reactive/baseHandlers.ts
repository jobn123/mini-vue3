import { track, trigger } from "./effect";
import { ReactiveFlags } from './reactive'

const createGetter = (isReadonly = false) => {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    // 依赖收集
    if (!isReadonly) {
      track(target, key)
    }

    // 不是只读 就是一个响应式对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }

    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
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

