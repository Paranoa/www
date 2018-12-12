<template>
  <div>
    <div style="margin-bottom: 20px">
      <Drag :dropzoneName="'dropzone'" @droped="droped(htmlTemplate[0])">
        <div style="width: 100px; height: 40px; border: 1px solid #aaa">单行输入框</div>
      </Drag>
      <Drag :dropzoneName="'dropzone'" @droped="droped(htmlTemplate[1])" style="margin-left: 10px">
        <div style="width: 200px; height: 40px; border: 1px solid #aaa">单选框</div>
      </Drag>
    </div>
    <div style="float:left; width: 300px; border: 1px solid #aaa; height: 500px; position: relative; margin-left: 100px" id="dropzone">
    </div>
    <drop ref="dropzone" refName="dropzone" style="float:left; width: 300px; border: 1px solid #aaa; height: 500px; position: relative; margin-left: 100px"
    @templateClicked="onTemplateClicked"
    @templateRemoved="onTemplateRemoved">
      <div>
      </div>
    </drop>
    <div v-if="editOptions" style="float:left; margin-left: 100px; border: 1px solid #aaa">
      <template v-if="editOptions.type === 'singleInput'">
        单行输入框
        标题: <input v-model="editOptions.options.label">
        提示文字: <input v-model="editOptions.options.placeholder">
        验证： <input type="checkbox" v-model="editOptions.options.required">
      </template>
      <template v-if="editOptions.type === 'singleSelect'">
        单行选择框
        标题: <input v-model="editOptions.options.label">
        提示文字: <input v-model="editOptions.options.placeholder">
        选项: 
        <ul>
          <li v-for="(opt, index) of editOptions.options.opts">
            <input v-model="opt.value">
            <span style="padding: 5px" @click="editOptions.options.opts.push({})">+</span>
            <span v-if="editOptions.options.opts.length > 1" style="padding: 5px" @click="editOptions.options.opts.splice(index, 1)">-</span>
          </li>  
        </ul>
        验证： <input type="checkbox" v-model="editOptions.options.required">
      </template>
    </div>
    <button @click="exportForm">导出</button>
    <div style="clear: both"></div>
  </div>
</template>
<script>
  import Drag from '@/components/Drag'
  import DropZone from '@/components/DropZone.js'
  import Drop from '@/components/DropZone.vue'
  import Vue from 'vue'
  import { getOffset } from '@/util'

  export default {
    name: 'home',
    components: {
      Drag,
      Drop
    },
    data() {
      return {
        htmlTemplate: [{
          type: 'singleInput',
          options: {
            label: '单行输入框',
            placeholder: '请输入'
          }
        },{
          type: 'singleSelect',
          options: {
            label: '单选框',
            placeholder: '请选择',
            opts: [{}]
          }
        }],
        editOptions: {
        },
        dropzone: null
      }
    },
    methods: {
      droped(options) {
        // this.dropzone.insertTemplateToMark(options)
        this.$refs.dropzone.$emit('insertTemplateToMark', options)
      },
      exportForm() {
        console.log(this.dropzone.formItems)
      },
      onTemplateClicked(item) {
        // 插入一个模板后，设置当前的编辑选项
        Vue.set(this.editOptions, 'type', item.$props.type)
        Vue.set(this.editOptions, 'options', item.$props.options)
      },
      onTemplateRemoved() {
        // 删除一个模板后，当前编辑选项设为空
        vm.editOptions = {}
      }
    },
    mounted () {
      // const vm = this
      // const el = document.getElementById('dropzone')
      // const offset = getOffset(el)
      // this.dropzone = new DropZone(el, {
      //   left: offset.left,
      //   top: offset.top,
      //   width: el.offsetWidth,
      //   height: el.offsetHeight,
      //   onTemplateClicked(item) {
      //     // 插入一个模板后，设置当前的编辑选项
      //     Vue.set(vm.editOptions, 'type', item.$props.type)
      //     Vue.set(vm.editOptions, 'options', item.$props.options)
      //   },
      //   onTemplateRemoved() {
      //     // 删除一个模板后，当前编辑选项设为空
      //     vm.editOptions = {}
      //   }
      // })
    }
  }
</script>

<style>
  .drop-zone-mark { border: 1px solid red; width: 100%; margin: 5px 0;}
</style>
