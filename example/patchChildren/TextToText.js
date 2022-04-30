import { ref, h } from '../../lib/min-vue3.esm.js'
const nextChildren = "newChildren"
const preChildren = "oldChildren"

export default {
  name: "TextToText",
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return { isChange }
  },

  render() {
    const self = this

    return self.isChange === true ? h("div", {}, nextChildren) : h("div", {}, preChildren)
  }
}