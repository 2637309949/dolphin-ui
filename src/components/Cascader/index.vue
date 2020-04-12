<template>
  <el-cascader
    ref="cascader"
    v-model="valueArray"
    :options="options"
    :props="props"
    :style="styles"
    :change-on-select="changeonselect"
    :clearable="true"
    :filterable="true"
    @change="change"
  />
</template>
<script>

export default {
  name: 'Cascader',
  props: {
    api: {
      type: Function,
      default: () => {}
    },
    code: {
      type: String,
      default: () => ''
    },
    value: {
      type: String,
      default: ''
    },
    styles: {
      type: String,
      default: 'width:100%'
    },
    placeholder: {
      type: String,
      default: () => '请选择'
    },
    dataQuery: {
      type: Object,
      default: () => {
        return {
          name: '',
          code: '',
          cn_id: ''
        }
      }
    },
    props: {
      type: Object,
      default: () => {
        return {
          children: 'nodes',
          label: 'name',
          value: 'id'
        }
      }
    },
    changeonselect: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      options: []
    }
  },
  computed: {
    valueArray: {
      get: function() {
        if (this.value === '') return ['']
        return this.getTreeDeepArr(this.value, this.options)
      },
      set: function(newValue) {
        this.$emit('update:value', newValue[newValue.length - 1])
      }
    }
  },
  watch: {
  },
  created() {
    this.api(this.dataQuery).then(res => {
      res.data.unshift({ id: '', text: '无', parent: '', nodes: null })
      this.options = res.data
    })
  },
  methods: {
    change() {
      this.$refs.cascader.toggleDropDownVisible(false)
    },
    getTreeDeepArr(key, treeData) {
      var _this = this
      const arr = []
      let returnArr = []
      let depth = 0
      function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
          depth = depthN
          arr[depthN] = (childrenData[j].id)
          if (childrenData[j].id === key) {
            returnArr = arr.slice(0, depthN + 1)
            break
          } else {
            if (childrenData[j].nodes) {
              depth++
              childrenEach(childrenData[j].nodes, depth)
            }
          }
        }
        _this.$emit('childFn', returnArr.length)
        return returnArr
      }
      return childrenEach(treeData, depth)
    }
  }
}
</script>
<style scoped>
  .el-cascader-panel{
    overflow: hidden !important;
  }
</style>
