import { h } from '../../lib/min-vue3.esm.js'

export const Foo = {
  // emit, { }
  setup(props, { emit }) {
    console.log(props)
    const emitAdd = () => {
      console.log("emit add")
      emit("add", 1, 2)

      // add-foo  ->  addFoo
      emit("add-foo")
    }

    return {
      emitAdd
    }
  },

  render() {
    const btn = h("button", {
      onClick: this.emitAdd
    }, "emitAdd")

    const foo = h("div", {}, "foo")

    return h("div", {}, [foo, btn])
  }
}