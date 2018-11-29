<template>
  <Drag :dropzone="dropzone" @droped="droped">
    <div @mousedown="mousedown($event)" class="form-item">
      <i @click.stop="remove($event)" class="form-item-remove">x</i>
      <label>{{ options.label }}</label>
      <span>
        <template v-if="options.type === 'input'">
          <input :placeholder="options.placeholder">
        </template>
        <template v-else-if="options.type === 'select'"></template>
      </span>
    </div>
  </Drag>
</template>
<script>
  import Drag from '@/components/Drag'
  export default {
    props: {
      options: {
        type: Object,
        default () {
          return {
            type: 'input',
            label:'标题',
            placeholder: '请输入'
          }
        }
      },
      dropzone: {
        type: Object,
        required: true
      },
      onmousedown: {
        type: Function
      }
    },
    components: {
      Drag
    },
    methods: {
      remove() {
        if (this.$el && this.$el.parentNode) {
          this.$el.parentNode.removeChild(this.$el)
        }
        this.$destroy()
      },
      droped(event) {
        this.dropzone.moveTemplateToMark(this)
      },
      mousedown (event) {
        if (this.onmousedown && typeof this.onmousedown === 'function') {
          this.onmousedown(event)
        }
      }
    }
  }
</script>
<style>
  .form-item { height: 40px; line-height: 40px; position: relative; }
  .form-item-remove { position: absolute; right: 10px; top: 5px; line-height: 1; }
</style>