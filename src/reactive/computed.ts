import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _getter: any;
  private _drity: boolean = true;
  private _value: any
  private _effect: any

  constructor(getter) {
    this._getter = getter

    this._effect = new ReactiveEffect(getter, () => {
      if (!this._drity) {
        this._drity = true
      }
    })
  }

  get value() {
    if (this._drity) {
      this._drity = false
      return this._value = this._effect.run()
    }

    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}