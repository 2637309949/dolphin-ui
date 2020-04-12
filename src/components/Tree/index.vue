<template>
  <div>
    <el-container>
      <el-header class="el-button--primary" height="40px" style="line-height: 40px;">
        {{ title }}
      </el-header>
      <el-main class="tree-main" style="padding: 15px 0;">
        <el-tree
          :data="data"
          node-key="id"
          :props="props"
          :default-expanded-keys="expends"
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
      default: 'Menu'
    },
    fetch: {
      type: Function,
      default: () => {}
    },
    query: {
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
    styleObject: {
      type: Object,
      default: () => {}
    },
    expends: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => ({
        children: 'nodes',
        label: 'name',
        value: 'id'
      })
    }
  },
  data: function() {
    return {
      data: []
    }
  },
  created() {
    this.fetch(this.query).then(({ data }) => {
      this.data = addNodesAttr(data, 'opened', false) || []
      this.callBack(data)
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
