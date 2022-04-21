import { h, provide, inject } from '../../lib/min-vue3.esm.js'

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooValue")
    provide("bar", "barValue")
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)])
  }
}

const ProviderTwo = {
  name: "Provider",
  setup() {
    provide("foo", "fooTwo")
    const foo = inject("foo")

    return {
      foo
    }
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider fooTWo:" + this.foo), h(Consumer)])
  }
}

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo")
    const bar = inject("bar")
    // const baz = inject("baz", "bazDefault")
    // const kkk = inject("default", () => "lll")

    return {
      foo, bar
    }
  },
  render() {
    return h("div", {}, `Consumer-${this.foo}-${this.bar}`)
  }
}

export default {
  name: "App",
  setup() { },
  render() {
    return h("div", {}, [h("div", {}, "apiInject"), h(Provider)])
  },
}