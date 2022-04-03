import { extend } from '../shared'

let activeEffect
let shouldTrack

class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void

  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    if (!this.active) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this

    const result = this._fn()
    // reset
    shouldTrack = false;

    return result
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
  effect.deps.length = 0
}


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
  if (!isTracking()) return

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

  // 已经在dep中跳过,避免重复收集
  // 不跳过也没关系用的Set😹
  if (dep.has(activeEffect)) return

  dep.add(activeEffect)

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

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}