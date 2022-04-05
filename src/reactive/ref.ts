import { hasChanged, isObject } from "../shared";
import { trackEffect, triggerEffect, isTracking } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep: Set<unknown>;
  __v_isRef = true;

  constructor(val) {
    // val如果是对象用reactive包裹起来
    this._rawValue = val;
    this._value = convert(val);
    this.dep = new Set()
  }

  get value() {
    // 依赖收集
    trackRefValue(this.dep)
    return this._value;
  }

  set value(newVal) {
    // Object.is
    // MDN https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is

    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = convert(newVal);

      triggerEffect(this.dep)
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(dep) {
  if (isTracking()) {
    trackEffect(dep)
  }
}

export const ref = (value) => {
  return new RefImpl(value);
}

export const isRef = (ref) => {
  return !!ref.__v_isRef
}

export const unRef = (ref) => {
  return isRef(ref) ? ref.value : ref
}

export const proxyRefs = (target) => {
  return new Proxy(target, {
    get(target, key) {
      // 如果key是ref返回unref否则返回原值
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      // target[key]是ref 并且 设置的值非ref 修改target[key].value
      // 否则直接替换
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value;
      } else {
        return Reflect.set(target, key, value);
      }
    }
  })
}