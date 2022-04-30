import { ref, h } from '../../lib/min-vue3.esm.js'
const nextChildren = [h("div", {}, "A"), h("div", {}, "B")]
const preChildren = "oldChildren"

export default {
  name: "TextToArray",
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