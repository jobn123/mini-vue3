export const extend = Object.assign

export const isObject = (val) => val !== null && typeof (val) === 'object'

export const hasChanged = (newVal, val) => !Object.is(newVal, val)