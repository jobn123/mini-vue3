import { getCurrentInstance } from "./component";

export function provide(key, val) {
  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    let { provides } = currentInstance
    const parentProvides = currentInstance.parent.provides

    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }

    provides[key] = val
  }
}

export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    const provides = currentInstance.parent.provides

    if (key in provides) {
      return provides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === "function") {
        return defaultValue()
      }
      return defaultValue
    }
  }
}