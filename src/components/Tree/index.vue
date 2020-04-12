<template>
  <div>
    <el-container>
      <el-header class="el-button--primary" height="40px" style="line-height: 40px;">
        {{ title }}
      </el-header>
      <el-main class="tree-main" style="padding: 15px 0;">
        <el-tree
          :data="treeData"
          node-key="id"
          :props="defaultProps"
          :default-expanded-keys="defaultExpends"
          :style="styleObject"
          :highlight-current="false"
          @node-click="click"
        />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { addNodesAttr } from '@/utils/tree'
export default {
  name: 'Tree',
  props: {
    title: {
      type: String,
      default: ''
    },
    api: {
      type: Function,
      default: () => {}
    },
    dataQuery: {
      type: Object,
      default: () => {}
    },
    callBack: {
      type: Function,
      default: () => {}
    },
    click: {
      type: Function,
      default: () => {}
    },
    isShowAll: {
      type: Boolean,
      default: () => true
    },
    styleObject: {
      type: Object,
      default: () => {}
    },
    defaultExpends: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {
      treeData: [],
      defaultProps: {
        children: 'nodes',
        label: 'name',
        value: 'id'
      }
    }
  },
  created() {
    if (typeof this.props === 'object') {
      Object.assign(this.defaultProps, this.props)
    }
    this.api(this.dataQuery).then(res => {
      this.treeData = addNodesAttr(res.data || [], 'opened', false) || []
      if (this.isShowAll) {
        this.treeData.unshift({ id: '', nodes: null, opened: false, parent: '', tag: { id: '' }, text: 'All' })
      }
      this.callBack(res.data)
    })
  }
}
</script>
<style>
  .el-tree-node > .el-tree-node__children {
    overflow-x: auto
  }
  .tree-aside .tree-main{
    max-height: calc(100vh - 240px);
  }
</style>
