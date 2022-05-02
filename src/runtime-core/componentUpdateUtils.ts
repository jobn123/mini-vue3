export function shouldUpdateComponent(prevNode, nextNode) {
  const { props: prevProps } = prevNode
  const { props: nextProps } = nextNode

  for (const key in prevProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }

  return false
}