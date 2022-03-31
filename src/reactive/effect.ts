import { extend } from '../shared'

class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void

  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    // 避免多次调用stop执行多次
    if (this.active) {
      this.onStop && this.onStop()
      cleanupEffect(this)
      this.active = false
    }
  }
}

const cleanupEffect = (effect) => {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

let activeEffect
export const effect = (fn, options: any = {}) => {

  const _effect = new ReactiveEffect(fn, options.scheduler)

  extend(_effect, options)
  // _effect.onStop = options.onStop

  // 立即执行一次
  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

// 依赖收集
const targetMap = new Map();
export const track = (target, key) => {
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)

  if (!activeEffect) return
  activeEffect.deps.push(dep);
}

export const trigger = (target, key, value) => {
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)

  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export const stop = (runner) => {
  runner.effect.stop()
}