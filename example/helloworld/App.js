import { h } from '../../lib/min-vue3.esm.js'

window.self = null
export const App = {
  render() {
    window.self = this
    return h("div",
      {
        id: "root",
        class: ["red", "blue"],
      },
      "hello " + this.msg
      // [h("p", { class: "red" }, "hello"), h("p", { class: "blue" }, "world")]
    )
  },

  setup() {
    return {
      msg: 'world'
    }
  }
}