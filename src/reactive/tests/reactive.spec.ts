import { reactive, isReactive } from "../reactive"

describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 }
    const observed = reactive(original)

    expect(original).not.toBe(observed)
    expect(observed.foo).toBe(1)

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })
})