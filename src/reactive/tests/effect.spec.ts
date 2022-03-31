import { effect, stop } from "../effect"
import { reactive } from "../reactive"

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({ age: 10 })

    let nextAge
    effect(() => {
      nextAge = user.age
    })

    expect(nextAge).toBe(10)

    // update
    user.age++
    expect(nextAge).toBe(11)
  })

  it("effect runner test", () => {
    // effect(fn) -> fn -> 
    let value = 0;

    const runner = effect(() => {
      value++
      return 'runner'
    })

    expect(value).toBe(1)
    const r = runner()
    expect(value).toBe(2)
    expect(r).toBe('runner')
  })

  it('scheduler', () => {
    // 1. 通过effect的第二个参数给定一个scheduler的fn
    // 2. effect 第一次执行的时候还是执行fn
    // 3. 当响应式对象set时,update 不执行fn 执行 scheduler
    // 4. 当执行runner时 再次执行fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1)

    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1)

    run()
    expect(dummy).toBe(2)
  })

  it("stop", () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2)

    runner()
    expect(dummy).toBe(3)
  })

  it("onStop", () => {
    const obj = reactive({ foo: 1 })
    const onStop = jest.fn()

    let dummy;
    const runner = effect(() => {
      dummy = obj.foo
    }, {
      onStop
    })

    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})