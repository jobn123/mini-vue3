import { h, getCurrentInstance } from '../../lib/min-vue3.esm.js'

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance()
    console.log("Foo", instance)
    return {}
  },

  render() {

    const foo = h("div", {}, "foo")

    return h("div", {}, [foo])
  }
}