class ReactiveEffect {
  private _fn: any;

  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run () {
    activeEffect = this
    return this._fn()
  }
}

let activeEffect
export const effect = (fn, options: any = {}) => {
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler)

  // 立即执行一次
  _effect.run()

  return _effect.run.bind(_effect)
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