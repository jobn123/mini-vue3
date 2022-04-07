import { h } from '../../lib/min-vue3.esm.js'

export const App = {
  render() {
    return h("div", "hi" + this.msg)
  },

  setup() {
    return {
      msg: 'world'
    }
  }
}