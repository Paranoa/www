<template>
  <div class="ui-draggable" @mousedown="msdown($event)">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'drag',
    data () {
      return {
        isMouseDown: false
      }
    },
    methods: {
      msdown (event) {
        this.isMouseDown = true
        this.x = event.clientX
        this.y = event.clientY
        this.l = event.target.offsetLeft
        this.t = event.target.offsetTop
        this.$emit('dragstart', event)
        event.preventDefault()
      }    
    },
    mounted () {
      window.addEventListener('mousemove', event => {
        if (this.isMouseDown) {
          const nx = event.clientX
          const ny = event.clientY

          const nl = this.l + (nx- this.x)
          const nt = this.t + (ny- this.y)
          this.$emit('dragmove', { left: nl, top: nt }, event)
        }
      })
      window.addEventListener('mouseup', event => {
        if (this.isMouseDown) {
          this.$emit('dragend')
          this.isMouseDown = false
        }
      })
    }
  }
</script>
<style>
  .ui-draggable { display: inline-block; cursor: move }
</style>