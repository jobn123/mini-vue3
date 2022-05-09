import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transfrom } from "../src/transform"
import { transformExpression } from "../src/transforms/transformExpression"

describe("codegen", () => {

  it("string", () => {
    const ast = baseParse("hi")

    transfrom(ast)
    const { code } = generate(ast)

    expect(code).toMatchSnapshot()
  })

  it("interplation", () => {
    const ast = baseParse("{{message}}")

    transfrom(ast, {
      nodeTransforms: [transformExpression]
    })
    const { code } = generate(ast)

    expect(code).toMatchSnapshot()
  })

})