export function addNodesAttr(nodes, attr, val) {
  return nodes.map(item => {
    item[attr] = val
    item.nodes = addNodesAttr(item.nodes || [], attr, val)
    return item
  })
}
