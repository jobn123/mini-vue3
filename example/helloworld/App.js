import { h } from '../../lib/min-vue3.esm.js'

export const App = {
  render() {
    return h("div",
      {
        id: "root",
        class: ["red", "blue"],
      },
      // "hi" + this.msg
      [h("p", { class: "red" }, "hello"), h("p", { class: "blue" }, "world")]
    )
  },

  setup() {
    return {
      msg: 'world'
    }
  }
}