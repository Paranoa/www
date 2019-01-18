<template>
  <div class="tree-node" :class="(node.childNodes && node.childNodes.length)? 'non-leaf-block' : 'leaf-block'">
    <span v-if="node.nodeName" @click="clickHandler">
      <span class="tree-node-tag"
        :class="[
          { 'active': isActive },
          (node.childNodes && node.childNodes.length)? 'non-leaf-node' : 'leaf-node',
          ...node.className
        ]"
      >
        <i v-if="node.childNodes && node.childNodes.length" class="iconfont"
          :class="showChild ? 'icon-folder-open' : 'icon-folder'">
        </i>
        <i v-else class="iconfont icon-file"></i>
        <span class="tree-node-tag-name">
          {{ node.nodeName }}
        </span>
     </span>
    </span>
    <transition-group name="fade-slide">
      <ul
        v-if="showChild"
        v-for="node of node.childNodes"
        :key="node[nodeKey]">
        <li>
          <TreeNode
            v-on="$listeners"
            :activeNode="activeNode"
            :nodeKey="nodeKey"
            :node="node">
          </TreeNode>
        </li>
      </ul>
    </transition-group>
  </div>
</template>
<script>
/***
* 树状节点基组件:
  node: 节点对象
  nodeKey： 节点key
  activeNode : 当前激活节点

  node options:
    nodeName : 节点名
    childNodes : 子节点
    collapsed : 是否默认收起
    active : 是否默认激活
    className : nodeClassName数组
*/
import TreeNode from './TreeNode.vue'
export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      required: true
    },
    nodeKey: {
      type: String,
      required: true
    },
    activeNode: {
    }
  },
  data () {
    return {
      showChild: !this.node.collapsed
    }
  },
  computed: {
    isActive () {
      // 已有activeNode激活activeNode, 否则根据node的active属性决定默认激活
      if (this.activeNode && this.node) {
        return this.activeNode === this.node[this.nodeKey]
      }
      return this.node.active
    }
  },
  methods: {
    clickHandler () {
      // 点击时 叶子节点触发nodeClick事件, 非叶子节点切换显示子节点
      if (this.node.childNodes && this.node.childNodes.length) {
        this.showChild = !this.showChild
      } else {
        this.$emit('nodeClicked', this.node)
      }
    }
  },
  components: {
    TreeNode
  }
}
</script>
