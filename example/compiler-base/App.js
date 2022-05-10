import {
  ref
} from "../../lib/min-vue3.esm.js"

export const App = {
  name: "App",
  template: `<div>hi,{{message}}, count: {{count}}</div>`,
  setup() {
    const count = window.count = ref(1)

    return {
      count,
      message: "mini-vue"
    }
  }
}