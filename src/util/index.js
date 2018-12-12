function getOffset (node, offset) {
  if (!offset) {
    offset = {
      left: 0,
      top: 0
    }
  }
  if (node === document.body) {
    return offset
  }
  offset.left += node.offsetLeft
  offset.top += node.offsetTop
  return getOffset(node.offsetParent, offset)
}
export {
  getOffset
}
