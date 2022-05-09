import { NodeTypes } from "./ast"
import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

export function transfrom (root, options = {}) {
  const context = createTrasnformContext(root, options)
  traverseNode(root, context)
  createCodegen(root)

  root.helpers = [...context.helpers.keys()]
}

function createCodegen (root) {
  root.codegenNode = root.children[0]
}

function createTrasnformContext (root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper (key) {
      context.helpers.set(key, 1)
    }
  }

  return context
}

function traverseNode (node: any, context) {
  console.log(node)
  const { nodeTransforms } = context

  if (!nodeTransforms) return
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node)
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break;
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break;
    default:
      break;
  }

}

function traverseChildren (node: any, context) {
  const children = node.children

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]

      traverseNode(node, context)
    }
  }
}
