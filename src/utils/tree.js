export function addNodesAttr(nodes, attr, val) {
  nodes.forEach((item, i) => {
    nodes[i][attr] = val
    if (nodes[i].nodes !== null && nodes[i].nodes.length > 0) {
      addNodesAttr(nodes[i].nodes, attr, val)
    }
  })
  return nodes
}
