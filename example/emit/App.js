import { h } from '../../lib/min-vue3.esm.js'
import { Foo } from './Foo.js'

export const App = {
  render() {
    return h("div", {}, [h("div", {}, "App"), h(Foo, {
      onAdd(a, b) {
        console.log("received onAdd", a, b)
      },
      onAddFoo() {
        console.log("received onAddFoo")
      }
    })])
  },

  setup() {
    return {
      // msg: 'world'
    }
  }
}