import Vue from 'vue'
import FormItem from '@/components/FormItem'
import store from '@/store'

function DropZone (el, { left, top, width, height, onTemplateClicked, onTemplateRemoved}) {
  this.el = el
  this.left = left
  this.top = top
  this.width = width
  this.height = height
  this.formatBlockHeight = 40
  this.isHover = false
  this.formItems = []
  this.onTemplateClicked = onTemplateClicked
  this.onTemplateRemoved = onTemplateRemoved
}

DropZone.prototype.detectMove = function ({ left, top, width, height }) {
  // 获取横纵坐标跨度
  const minx = left, maxx = left + width, miny = top, maxy = top + height
  // 元素位置+宽高检测hover, x y轴均有交集即为hover
  if (!(minx > this.left + this.width || maxx < this.left) && !(miny > this.top + this.height || maxy < this.top)) {
    // 根据formatBlockHeight属性 检测元素插入位置
    const maxIndex = this.el.childNodes.length - 1
    const index = Math.floor((top - this.top)/this.formatBlockHeight)
    const blockIndex = index < 0 ? 0 : (index > maxIndex ? maxIndex : index) 

    // 已有mark 位置相同时不做操作
    if (this.isHover && this.insertingTemplate && this.insertingTemplate.blockIndex === blockIndex) {
      return
    }
    this.addMark(blockIndex)
    this.isHover = true
    this.insertingTemplate = {
      blockIndex
    }
  } else {
    // 未hover时移除mark
    this.isHover = false
    this.insertingTemplate = null
    this.removeMark()
  }
}

DropZone.prototype.addMark = function (blockIndex) {
  this.removeMark()
  this.mark = document.createElement('div')
  this.mark.className = 'drop-zone-mark'
  const before = this.el.childNodes[blockIndex]
  this.el.insertBefore(this.mark, before)
}

DropZone.prototype.removeMark = function () {
  if (this.mark) {
    this.mark.parentNode.removeChild(this.mark)
    this.mark = null
  }
}

DropZone.prototype.insertTemplateToMark = function (options) {
  if (this.insertingTemplate) {
    this.removeMark()
    // 创建并插入空div用于挂载FormItem
    const div = document.createElement('div')
    const beforeElement = this.el.childNodes[this.insertingTemplate.blockIndex]
    this.el.insertBefore(div, beforeElement)

    const _this = this
    // 初始化参数是一个复制
    const newOptions = JSON.parse(JSON.stringify(options))
    const formItemConstructor = Vue.extend(FormItem)

    const clickHandler = function (event) {
      _this.formItems.forEach(item => {
        item.$el.className = item.$el.className.replace(/\sactive|active\s/g, '').trim()
      })
      formItem.$el.className += ' active'
      _this.onTemplateClicked && _this.onTemplateClicked(formItem)
    }

    const formItem = new formItemConstructor({
      store,
      el: div,
      propsData: {
        dropzone: _this,
        ...newOptions,
        onmousedown: clickHandler
      }
    })

    clickHandler()
    // 同步数据模型
    this.formItems.splice(this.insertingTemplate.blockIndex, 0, formItem)
    this.isHover = false
    this.insertingTemplate = null
  }
}

DropZone.prototype.moveTemplateToMark = function(item) {
  if (this.insertingTemplate) {
    this.removeMark()
    const moveFrom = this.formItems.indexOf(item)
    const moveTo = this.insertingTemplate.blockIndex
    // moveTo为moveFrom和moveFrom+1则未移动
    if (!(moveTo === moveFrom || moveTo === moveFrom + 1)) {
      // 下标越界(beforeElement不存在)即为append
      const beforeElement = this.el.childNodes[moveTo]
      this.el.insertBefore(item.$el, beforeElement)
      // 同步数据模型
      this.formItems.splice(moveFrom, 1) 
      this.formItems.splice(moveTo > moveFrom? moveTo - 1: moveTo, 0, item) 
    }
  }
}

DropZone.prototype.removeItem = function(item) {
  const removeIndex = this.formItems.indexOf(item)
  this.formItems.splice(removeIndex, 1)
  if (item.$el && item.$el.parentNode) {
    item.$el.parentNode.removeChild(item.$el)
  }
  item.$destroy()
  this.onTemplateRemoved && this.onTemplateRemoved()
}

export default DropZone