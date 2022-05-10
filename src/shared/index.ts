export const extend = Object.assign

export const isObject = (val) => val !== null && typeof (val) === 'object'

export const hasChanged = (newVal, val) => !Object.is(newVal, val)

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

// add-foo -> addFoo
export const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toUpperCase() : ""
  })
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const toHandlerKey = (str) => str ? `on${capitalize(str)}` : ""

export const isString = (str) => typeof str === "string"