import { getCurrentInstance, h, ref, nextTick } from '../../lib/min-vue3.esm.js'

export default {
  name: "App",
  render() {

    const button = h("button", { onClick: this.onClick }, "update")
    const p = h("p", {}, "count: " + this.count)

    return h("div", {}, [button, p])
  },

  setup() {
    const count = ref(1)
    const instance = getCurrentInstance()

    // 视图更新是异步的
    function onClick() {
      for (let i = 0; i < 100; i++) {
        count.value = i
      }

      console.log(instance)
      debugger
      // 执行一个微任务，返回一个promise,然后可以拿到视图更新后的值
      nextTick(() => {
        console.log('>>>>>nextTick:' + instance)
      })
    }

    return {
      count,
      onClick
    }
  }
}