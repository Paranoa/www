<template>
  <div class="home">
    <Drag @dragstart="event => dragstart(event)" @dragmove="event => dragmove(event)" @dragend="event => dragend(event)"><div>drag1</div></Drag>
    <Drag @dragstart="event => dragstart(event)" @dragmove="event => dragmove(event)" @dragend="event => dragend(event)"><div>drag2</div></Drag>
    <div id="proxyContainer" style=""></div>
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
        proxyedElement: null
      }
    },
    methods: {
      dragstart(event) {
        if (!this.draging) {
          const element = event.target
          if (this.proxyedElement !== element) {
            const container = document.getElementById('proxyContainer')
            container.childNodes.forEach(node => {
              node.parentNode.removeChild(node)
            })
            container.appendChild(element.cloneNode(true))
          }
          this.proxyedElement = element
        }
      },
      dragmove(event) {
        const container = document.getElementById('proxyContainer')
        this.draging = true
        container.style.left = event.clientX + 'px'
        container.style.top = event.clienY + 'px'
      },
      dragend(event) {
        this.draging = false
      },
    }
  }
</script>

<style>
  #proxyContainer { position: absolute; }
</style>
