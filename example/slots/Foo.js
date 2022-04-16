import { h, renderSlots } from '../../lib/min-vue3.esm.js'

export const Foo = {
  setup() {
    return {}
  },
  render() {
    const foo = h("p", {}, "foo")
    console.log(this.$slots)

    return h("div", {}, [renderSlots(this.$slots, "header", { age: 18 }), foo, renderSlots(this.$slots, "footer")])
  }
}