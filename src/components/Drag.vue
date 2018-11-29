<template>
  <div class="ui-draggable" @mousedown="mousedown($event)">
    <slot></slot>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    name: 'drag',
    props: {
      dropzone: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        isMouseDown: false
      }
    },
    computed: {
      ...mapState([
        'proxyContainer',
        'proxyedElement'
      ])
    },
    methods: {
      mousedown (event) {
        event.preventDefault()
        const element = event.target
        const { left: l, top: t } = getOffset(event.target)
        this.isMouseDown = true
        this.x = event.clientX
        this.y = event.clientY
        this.l = l
        this.t = t

        const htmlStr = this.$el.innerHTML
        if (this.proxyedElement !== element) {
          this.proxyContainer.innerHTML = htmlStr
        }
        this.$store.commit('setProxyElement', element)
        this.$emit('dragstart', event, htmlStr)
      }    
    },
    mounted () {
      const vm = this
      if (!this.proxyContainer) {
        const el = document.createElement('div')
        el.className = 'proxy-container'
        this.$root.$el.appendChild(el)
        this.$store.commit('setProxyContainer', el)
      }      

      window.addEventListener('mousemove', event => {
        if (this.isMouseDown) {
          const nx = event.clientX
          const ny = event.clientY
          const nl = this.l + (nx - this.x)
          const nt = this.t + (ny - this.y)

          const width = this.$el.offsetWidth
          const height = this.$el.offsetHeight

          this.proxyContainer.style.left = nl + 'px'
          this.proxyContainer.style.top = nt + 'px'
          this.proxyContainer.style.display = 'block'
          const offsets = {
            left: nl, top: nt, width, height
          }

          this.$emit('dragmove', event, offsets)

          if (vm.dropzone) {
            vm.dropzone.detectMove(offsets)
          }
        }
      })

      window.addEventListener('mouseup', event => {
        if (this.isMouseDown) {
          this.proxyContainer.style.display = 'none'
          this.isMouseDown = false
          this.$emit('dragend', event)

          if(vm.dropzone && vm.dropzone.isHover) {
            vm.dropzone.isHover = false
            this.$emit('droped')
          }
        }
      })
    }
  }

  function getOffset(node, offset) {
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
</script>
<style>
  .proxy-container { position: absolute; cursor: move }
  .ui-draggable { display: inline-block; cursor: move; }
</style>