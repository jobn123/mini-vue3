export function transfrom (root, options) {
  const context = createTrasnformContext(root, options)
  traverseNode(root, context)
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

  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node)
  }
  const children = node.children

  // if (node.type === NodeTypes.TEXT) {
  //   node.content = node.content + " mini-vue"
  // }

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]

      traverseNode(node, context)
    }
  }
}
