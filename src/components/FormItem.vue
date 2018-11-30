<template>
  <Drag :dropzone="dropzone" @droped="droped" @dragmove="dragmove" @dragend="dragend">
    <div @mousedown="mousedown($event)" class="form-item">
      <i @click.stop="remove($event)" class="form-item-remove">x</i>
      <label>{{ options.label }}</label>
      <span style="float: right">
        <template v-if="type === 'singleInput'">
          <span>{{ placeholder }}</span>
        </template>
        <template v-else-if="type === 'singleSelect'">
          <span>{{ placeholder }} ></span>
        </template>
      </span>
    </div>
  </Drag>
</template>
<script>
  import Drag from '@/components/Drag'
  export default {
    props: {
      type: {
        type: String,
        default: 'singleInput'
      },
      options: {
        type: Object,
        default () {
          return {
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
    computed: {
      placeholder () {
        return this.options.placeholder + (this.options.required ? '（必填）' : '')
      }
    },
    components: {
      Drag
    },
    methods: {
      dragmove() {
        if (!/\sdragging|dragging\s/.test(this.$el.className)) {
          this.$el.className += ' dragging'
        }
      },
      dragend() {
        this.$el.className = this.$el.className.replace(/\sdragging|dragging\s/g, '').trim()
      },
      remove() {
        this.dropzone.removeItem(this)
      },
      droped() {
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
  .form-item { height: 40px; line-height: 40px; position: relative; width: 300px; text-align: left; padding: 0 11px; box-sizing: border-box; border: 1px solid #999;}
  .form-item:hover {
    border-style: dotted;
    border-color: #38adff;
  }

  .ui-draggable.active .form-item {
    border-color: #38adff;
  }

  .ui-draggable.dragging .form-item {
    border: 1px solid #666;
    background: #ccc;
    opacity: .4;
  }

  .ui-draggable.active .form-item:hover {
    border-style: solid
  }

  .ui-draggable .form-item:hover .form-item-remove {
    display: block
  }

  .form-item-remove { display: none; position: absolute; right: 2px; top: 2px; line-height: 1; cursor: pointer; }
</style>