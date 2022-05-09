import { NodeTypes } from "./ast"

enum TagType {
  Start,
  End
}

export function baseParse (content: string) {
  const context = createParserContext(content)

  return createRoot(parseChildren(context, []))
}

function parseChildren (context, ancestors) {

  const nodes: any = []

  while (!isEnd(context, ancestors)) {
    let node;

    const s = context.source

    if (s.startsWith("{{")) {
      node = parseInterpolation(context)
    } else if (s[0] === "<") {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }

    if (!node) {
      node = parseText(context)
    }

    nodes.push(node)
  }

  return nodes
}

function isEnd (context, ancestors) {
  // 当context.source有值的时候
  // 当遇到结束标签的时候结束
  const s = context.source

  if (s.startsWith("</")) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag
      if (s.slice(2, 2 + tag.length) === tag) {
        return true
      }
    }
  }

  return !s
}

function parseText (context: any): any {
  let endIndex = context.source.length
  let endToken = ["{{", "<"]

  for (let i = 0; i < endToken.length; i++) {
    const index = context.source.indexOf(endToken[i])
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
  }

  const content = parseTextData(context, endIndex)

  console.log('>>>>>content: ' + content)

  return {
    type: NodeTypes.TEXT,
    content
  }
}

function parseTextData (context: any, length): any {
  const content = context.source.slice(0, length)

  advanceBy(context, content.length)

  return content
}

function parseInterpolation (context) {
  const openDelimiter = "{{"
  const closeDelimiter = "}}"

  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)

  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length

  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()

  advanceBy(context, rawContentLength + closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content
    }
  }
}

function advanceBy (context: any, length: number) {
  context.source = context.source.slice(length)
}

function createRoot (children) {
  return {
    children,
    type: NodeTypes.ROOT,
  }
}

function createParserContext (content: string): any {
  return {
    source: content
  }
}

function parseElement (context: any, ancestors) {
  // 1 解析tag
  const element: any = parseTag(context, TagType.Start)
  ancestors.push(element)

  // 解析children
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  if (!context.source) return element

  if (context.source.slice(2, 2 + element.tag.length) === element.tag) {
    parseTag(context, TagType.End)
  } else {
    throw new Error(`缺少结束标签:${element.tag}`)
  }

  return element
}

function parseTag (context: any, type: TagType) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]

  // 2 删除处理完成的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.End) return

  return {
    type: NodeTypes.ELEMENT,
    tag,
  }
}

