import { NodeTypes } from '../src/ast'
import { baseParse } from '../src/parse'
import { transfrom } from '../src/transform'

describe('transfrom', () => {
  it("happy path", () => {
    const ast = baseParse("<div>hi,{{message}}</div>")

    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = node.content + " mini-vue"
      }
    }

    transfrom(ast, {
      nodeTransforms: [plugin]
    })

    const nodeText = ast.children[0].children[0]
    expect(nodeText.content).toBe("hi, mini-vue")
  })
})