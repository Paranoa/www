<template>
  <div class="home">
    <Drag @dragstart="event => dragstart(event, htmlTemplate[0])" @dragmove="(offset, event) => dragmove(offset, event, htmlTemplate[0])" @dragend="event => dragend(event, htmlTemplate[0])"><div style="width: 100px; height: 40px; border: 1px solid red">drag1</div></Drag>
    <Drag @dragstart="event => dragstart(event, htmlTemplate[1])" @dragmove="(offset, event) => dragmove(offset, event, htmlTemplate[1])" @dragend="event => dragend(event, htmlTemplate[1])"><div style="width: 500px; height: 40px; border: 1px solid blue">drag2</div></Drag>
    <div style="width: 300px; border: 1px solid red; height: 500px; position: relative; margin-left: 100px" id="dropzone">
    </div>
    <div id="proxyContainer" style="z-index: 1">
      <div class="drop-zone-mark"></div>
    </div>
  </div>
</template>

<script>
  import Drag from '@/components/Drag'
  export default {
    name: 'home',
    components: {
      Drag
    },
    data() {
      return {
        htmlTemplate: [{
          width: 100,
          height: 40,
          htmlStr: `<div style="width: 100px; height: 40px; outline: 1px solid red">drag1</div>`
        },{
          width: 100,
          height: 40,
          htmlStr: `<div style="width: 500px; height: 40px; outline: 1px solid blue">drag2</div>`
        }],
        proxyedElement: null
      }
    },
    methods: {
      dragstart(event, { htmlStr }) {
        const element = event.target
        if (this.proxyedElement !== element) {
          const container = document.getElementById('proxyContainer')
          container.childNodes.forEach(node => {
            node.parentNode.removeChild(node)
          })
          container.innerHTML = htmlStr
        }
        this.proxyedElement = element
      },
      dragmove({ left, top }, event, template) {
        const container = document.getElementById('proxyContainer')
        
        container.style.left = left + 'px'
        container.style.top = top + 'px'
        container.style.display = 'block'

        const width = event.target.offsetWidth
        const height = event.target.offsetHeight

        this.dropzone.detectMove({ left, top }, template)
      },
      dragend(event) {
        const container = document.getElementById('proxyContainer')
        container.style.display = 'none'
        if (this.dropzone.isHover) {
          this.dropzone.insertTemplate()
        }
      },
    },
    mounted () {
      const dropzoneElement = document.getElementById('dropzone')
      this.dropzone = new DropZone(dropzoneElement, {
        left: dropzoneElement.offsetLeft,
        top: dropzoneElement.offsetTop,
        width: dropzoneElement.offsetWidth,
        height: dropzoneElement.offsetHeight
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

    this.initMark()
  }
  DropZone.prototype.initMark = function () {
    this.mark = document.createElement('div')
    this.mark.className = 'drop-zone-mark'
    this.el.appendChild(this.mark)
  }

  DropZone.prototype.detectMove = function ({ left, top }, template) {
    const width = template.width, height = template.height
    const minx = left, maxx = left + width, miny = top, maxy = top + height
    if (!(minx > this.left + this.width || maxx < this.left) && !(miny > this.top + this.height || maxy < this.top)) {
      const no = Math.floor((top - this.top)/this.formatBlockHeight)
      const formatBlockNo = no > 0 ? no : 0
      this.showMark(formatBlockNo, template)

      this.isHover = true
      this.insertingTemplate = {
        formatBlockNo,
        template
      }
    } else {
      this.isHover = false
      this.mark && this.hideMark()
    }
  }

  DropZone.prototype.showMark = function (formatBlockNo, template) {
    this.mark.style.display = 'block'
    const markTop = formatBlockNo * this.formatBlockHeight
    this.mark.style.top =  markTop + 'px'
  }

  DropZone.prototype.hideMark = function () {
    this.mark.style.display = 'none'
  }

  DropZone.prototype.insertTemplate = function () {
    console.log(this.insertingTemplate)
    const d = document.createElement('div')
    d.innerHTML = this.insertingTemplate.template.htmlStr
    const beforeElement = this.el.childNodes[this.insertingTemplate.formatBlockNo + 1]
    console.log(this.insertingTemplate.formatBlockNo + 1)
    this.el.insertBefore(d, beforeElement)
    this.mark.style.display = 'none'
  }
</script>

<style>
  #proxyContainer { position: absolute; cursor: move }
  .drop-zone-mark { position: absolute; border: 1px solid red; width: 100% }
</style>
