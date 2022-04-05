import { hasChanged, isObject } from "../shared";
import { trackEffect, triggerEffect, isTracking } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep: Set<unknown>;

  constructor(val) {
    // val如果是对象用reactive包裹起来
    this._rawValue = val;
    this._value = convert(val);
    this.dep = new Set()
  }

  get value () {
    // 依赖收集
    trackRefValue(this.dep)
    return this._value;
  }

  set value (newVal) {
    // Object.is
    // MDN https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is

    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = convert(newVal);

      triggerEffect(this.dep)
    }
  }
}

function convert (value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue (dep) {
  if (isTracking()) {
    trackEffect(dep)
  }
}

export const ref = (value) => {
  return new RefImpl(value);
}

