export function transfrom (root, options = {}) {
  const context = createTrasnformContext(root, options)
  traverseNode(root, context)
  createCodegen(root)
}

function createCodegen (root) {
  root.codegenNode = root.children[0]
}

function createTrasnformContext (root, options) {
  const context = {
    root,
    options: options || []
  }

  return context
}

function traverseNode (node: any, context) {
  console.log(node)
  const { nodeTransforms } = context.options

  if (!nodeTransforms) return
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node)
  }
  const children = node.children

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]

      traverseNode(node, context)
    }
  }
}
