import { h } from '../../lib/min-vue3.esm.js'
import { Foo } from './Foo.js'

window.self = null
export const App = {
  render() {
    window.self = this
    return h("div",
      {
        id: "root",
        class: ["red", "blue"],
        onClick() {
          console.log('clicked')
        },
        onMousedown() {
          console.log('mousedown')
        }
      },
      [h("div", {}, "hello" + this.msg), h(Foo, { count: 1 })]
      // "hello " + this.msg
      // [h("p", { class: "red" }, "hello"), h("p", { class: "blue" }, "world")]
    )
  },

  setup() {
    return {
      msg: 'world'
    }
  }
}