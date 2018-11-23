<template>
  <div class="ui-draggable" @mousedown="msdown($event)" @mousemove="msmove($event)">
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
        this.$emit('dragstart', event)
      },
      msmove (event) {
        if (this.isMouseDown) {
          this.$emit('dragmove', event)
        }
      }    
    },
    mounted () {
      window.addEventListener('mouseup', () => {
        this.$emit('dragend')
        this.isMouseDown = false
      })
    }
  }
</script>
