<template>
  <el-button :loading="isExporting" class="export-button" type="primary" :size="size" @click="onClick">
    <slot>{{ $t('common.export') }}</slot>
  </el-button>
</template>

<script>
import { mapGetters } from 'vuex'
import download from '@/utils/download'

export default {
  name: 'ExportButton',
  props: {
    name: {
      type: String,
      default: ''
    },
    api: {
      type: [Function, String],
      default() {
        return Promise.reject()
      }
    },
    columns: {
      type: [Array, Function],
      default() {
        return []
      }
    },
    dataQuery: {
      type: Object,
      default() {
        return () => {}
      }
    },
    size: {
      type: Number,
      default: 10000
    }
  },
  data() {
    return {
      isExporting: false
    }
  },
  computed: {
    ...mapGetters([
      'size'
    ])
  },
  methods: {
    onClick() {
      this.isExporting = true
      this.api(this.getExportQuery()).then(({ data }) => {
        download(data).then(() => {
          this.isExporting = false
        })
      })
    },
    getExportColumns() {
      const columns = this.deepCopy(this.checkFunc(this.columns))
      return columns
        .filter(column => {
          return typeof column.show === 'undefined' || column.show
        })
        .map(column => {
          // if (typeof column.formatter === 'string') {
          //   column.code = column.formatter
          // } else {
          //   delete column.code
          // }
          if (column.width) {
            column.width = column.width * 0.125 || 0
          }
          return column
        })
    },
    getExportQuery() {
      const query = this.deepCopy(this.dataQuery)
      query.page = 1
      query.size = this.size
      query.__export__ = true
      query.__name__ = this.name
      query.__columns__ = JSON.stringify(this.getExportColumns())
      this.$emit('beforeExport', query)
      return query
    },
    checkFunc(data) {
      return typeof data === 'function' ? data() : data
    },
    deepCopy(data) {
      if (typeof data !== 'object') {
        return data
      }
      if (Array.isArray(data)) {
        return data.map(this.deepCopy)
      }
      const copyData = {}
      for (const [key, value] of Object.entries(data)) {
        copyData[key] = this.deepCopy(value)
      }
      return copyData
    }
  }
}
</script>

<style scoped lang="scss">
</style>
