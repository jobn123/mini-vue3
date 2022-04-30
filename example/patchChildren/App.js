import { h } from '../../lib/min-vue3.esm.js'

import ArrayToText from './ArrayToText.js'

export default {
  name: "App",

  setup() { },

  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "主页"),
      // 老节点是array 新节点是text
      h(ArrayToText),
    ])
  }
}