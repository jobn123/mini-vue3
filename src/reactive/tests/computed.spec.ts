import { reactive } from "../reactive"
import { computed } from '../computed'

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({ age: 1 })

    const age = computed(() => user.age)

    expect(age.value).toBe(1)
  })

  it("should comute lazy", () => {
    const value = reactive({ foo: 1 })

    const getter = jest.fn(() => value.foo)

    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not computed again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not comouted unitl needed
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)
  })

})