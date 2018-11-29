<template>
  <div>
    <template v-if="dropzone">
      <Drag :dropzone="dropzone" @droped="droped(htmlTemplate[0])">
        <div style="width: 100px; height: 40px; border: 1px solid #aaa">单行输入框</div>
      </Drag>
      <Drag :dropzone="dropzone" @droped="droped(htmlTemplate[1])" style="margin-left: 10px">
        <div style="width: 200px; height: 40px; border: 1px solid #aaa">数字输入框</div>
      </Drag>
      <Drag :dropzone="dropzone" @droped="droped(htmlTemplate[2])">
        <div style="width: 100px; height: 40px; border: 1px solid #aaa">三行输入框</div>
      </Drag>
    </template>

    <div style="width: 300px; border: 1px solid #aaa; height: 500px; position: relative; margin-left: 100px" id="dropzone" @click="exportForm">
    </div>

    <div v-if="editOptions" style="border: 1px solid #aaa">
      type:<input v-model="editOptions.type">
      label:<input v-model="editOptions.label">
      placeholder:<input v-model="editOptions.placeholder">
    </div>
  </div>
</template>
<script>
  import Drag from '@/components/Drag'
  import FormItem from '@/components/FormItem'
  import Vue from 'vue'
  import store from '@/store'

  export default {
    name: 'home',
    components: {
      Drag
    },
    data() {
      return {
        htmlTemplate: [{
          type: 'input',
          label: '单行输入框',
          placeholder: '请输入'
        },{
          type: 'input',
          label: '数字输入框',
          placeholder: '请输入数字'
        },{
          type: 'input',
          label: '什么输入框',
          placeholder: '请输入什么'
        }],
        editOptions: null,
        dropzone: null
      }
    },
    methods: {
      droped(options) {
        this.dropzone.insertTemplateToMark(options, item => {
          this.editOptions = item.$props.options
        })
      },
      exportForm() {
        console.log(this.dropzone.formItems)
      }
    },
    mounted () {
      const el = document.getElementById('dropzone')
      this.dropzone = new DropZone(el, {
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight
      })
    }
  }

  function DropZone (el, { left, top, width, height}) {
    this.el = el
    this.left = left
    this.top = top
    this.width = width
    this.height = height
    this.formatBlockHeight = 40
    this.isHover = false
    this.formItems = []
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

  DropZone.prototype.insertTemplateToMark = function (options, selected) {
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
      const formItem = new formItemConstructor({
        store,
        el: div,
        propsData: {
          dropzone: _this,
          options: newOptions,
          onmousedown (event) {
            selected && selected(formItem)
          }
        }
      })
      selected && selected(formItem)
      // 同步数据模型
      this.formItems.splice(this.insertingTemplate.blockIndex, 0, formItem)
      this.isHover = false
      this.insertingTemplate = null
    }
  }

  DropZone.prototype.moveTemplateToMark = function(item) {
    if (this.insertingTemplate) {
      this.removeMark()
      const switchFrom = this.formItems.indexOf(item)
      const switchTo = this.insertingTemplate.blockIndex
      // 差值1以内没有移动
      if (Math.abs(switchTo - switchFrom) > 1) {
        // 下标越界即为append
        const beforeElement = this.el.childNodes[switchTo]
        this.el.insertBefore(item.$el, beforeElement)
        // 同步数据模型
        this.formItems.splice(switchFrom, 1) 
        this.formItems.splice(switchTo-1, 0, item) 
      }
    }
  }
</script>

<style>
  .drop-zone-mark { border: 1px solid red; width: 100%; margin: 5px 0;}
</style>
