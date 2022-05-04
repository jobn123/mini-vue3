import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transfrom } from "../src/transform"

describe("codegen", () => {

  it("string", () => {
    const ast = baseParse("hi")

    transfrom(ast)
    const { code } = generate(ast)

    expect(code).toMatchSnapshot()
  })
})