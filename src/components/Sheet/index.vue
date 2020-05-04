<template>
  <div>
    <el-table
      ref="multipleTable"
      v-loading="dataLoading"
      stripe
      border
      :header-cell-style="{background:'#F5F7FA'}"
      :data="tableData"
      :selection-data="selectionData"
      :height="tableMaxHeight"
      @selection-change="selectionChange"
      @row-click="rowdata"
      @cell-mouse-enter="cellMouseEnter"
    >
      <el-table-column fixed :type="selectType" align="center" width="50" />

      <el-table-column v-if="showCover" label="Cover" :align="columns[0].align">
        <template slot-scope="scope">
          <img :src="src+scope.row.cover" width="40" height="40">
        </template>
      </el-table-column>

      <el-table-column v-if="showFace" label="Cover" :align="columns[0].align">
        <template slot-scope="scope">
          <img :src="src+scope.row.face" width="40" height="40">
        </template>
      </el-table-column>

      <template v-for="(column, index) in columns">
        <el-table-column
          :key="column.label"
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :min-width="column.minWidth"
          :max-width="column.maxWidth"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              <template v-if="typeof column.formatter == 'string'">
                <!--<span v-html="column.formatter(scope.row, column)" />-->
                <span v-html="formatter(scope.row, column)" />
              </template>
              <template v-else-if="typeof column.formatter == 'function'">
                <span v-html="column.formatter(scope.row, column)" />
              </template>
              <template v-else>
                <span>{{ scope.row[column.prop] }}</span>
              </template>
            </template>
            <template v-else>
              <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index" />
            </template>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        v-if="operates.list.length > 0 && (operates.list.filter(_x=>_x.show === true).length > 0 || operates.dropdown.filter(_x=>_x.show === true).length > 0) "
        ref="fixedColumn"
        label="Operate"
        align="center"
        :width="operates.width"
        :fixed="operates.fixed"
      >
        <template slot-scope="scope">
          <div class="operate-group">
            <template v-for="btn in operates.list">
              <el-button
                v-if="btn.show"
                :key="btn.id"
                :type="btn.type"
                size="mini"
                :icon="btn.icon"
                :disabled="btn.disabled"
                :plain="btn.plain"
                @click.native.prevent="btn.method(scope.row)"
              >{{ btn.label }}</el-button>
            </template>
            <div
              v-if="operates.dropdown != undefined && operates.dropdown.filter(_x=>_x.show === true).length > 0"
              style="display: inline-block;"
            >
              <el-dropdown style="font-size: 12px" size="mini">
                <el-button type="primary" size="mini">More</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="dropbtn in operates.dropdown"
                    :key="dropbtn.id"
                    @click.native.prevent="dropbtn.method(scope.row)"
                  >{{ dropbtn.label }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="clearfix" style="height: 32px;margin: 10px 24px 0 10px;">
      <el-pagination
        class="pagination-site"
        background
        :class="floatType"
        :current-page="dataQuery.page"
        :page-sizes="page.pageSizes"
        :page-size="dataQuery.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.dataTotal"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>
<script>
import { scrollTo } from '@/utils/scroll-to'
export default {
  name: 'Sheet',
  props: {
    showFace: {
      type: Boolean,
      default: false
    },
    showCover: {
      type: Boolean,
      default: false
    },
    headerName: {
      type: String,
      default: () => 'searchForm'
    },
    callBack: {
      type: Function,
      default: () => {}
    },
    api: {
      type: Function,
      default: () => {}
    },
    columns: {
      type: Array,
      default: () => []
    },
    floatType: {
      type: String,
      default: () => ''
    },
    clearSelection: {
      type: String,
      default: () => ''
    },
    selectType: {
      type: String,
      default: () => ''
    },
    dataQuery: {
      type: Object,
      default: () => {
        return { page: 1, rows: 10 }
      }
    },
    page: {
      type: Object,
      default: () => {
        return {
          pageSizes: [5, 10, 20, 50, 100],
          dataTotal: 0
        }
      }
    },
    operates: {
      type: Object,
      default: () => {
        return {
          list: [],
          width: 150
        }
      }
    }
  },
  data: function() {
    return {
      src: window.Domain.static_url,
      tableData: [],
      dataLoading: false,
      optionsets: {},
      selectionData: []
    }
  },
  computed: {
    tableMaxHeight() {
      if (
        this.$store === undefined ||
        this.$store.getters.pageTableHeaderHeight === 0
      ) { return null }
      const height = 240 + 20 + this.$store.getters.pageTableHeaderHeight
      return 'calc(100vh - ' + height + 'px)'
    }
  },
  watch: {
    clearSelection(newdata, olddata) {
      this.$refs.multipleTable.clearSelection()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    search(obj) {
      this.dataQuery.page = 1
      Object.assign(this.dataQuery, obj)
      this.getData()
    },
    cellMouseEnter(row, column) {
      this.$emit('cell-mouse-enter', row, column)
    },
    formatter(row, column) {
      if (this.optionsets[column.formatter] !== undefined) {
        const colValue = row[column.prop]
        for (var i = 0; i < this.optionsets[column.formatter].length; i++) {
          if (this.optionsets[column.formatter][i].value === colValue) {
            return this.optionsets[column.formatter][i].text
          }
        }
      }
      return ''
    },
    rowdata(row, column, event) {
      if (column.label !== '操作') {
        this.$refs.multipleTable.toggleRowSelection(row)
        this.$emit('getRow', row)
      }
    },
    toggleRowSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    selectionChange(selection) {
      this.selectionData = selection
      this.$emit('update:selectionData', selection)
    },
    async getData() {
      const codes = []
      this.columns.forEach(item => {
        if (
          item.formatter !== undefined &&
          typeof item.formatter === 'string'
        ) {
          codes.push(item.formatter)
        }
      })
      for (var i = 0; i < codes.length; i++) {
        this.optionsets[codes[i]] = await this.$store.dispatch('optionset/formatterData', codes[i])
      }
      this.dataLoading = true
      this.dataQuery
      this.api(this.dataQuery).then(res => {
        if (res.code === 200) {
          this.page.dataTotal = res.data.totalrecords
          this.tableData = res.data.data
          this.$emit('callBack', res.data.content)
        } else {
          this.page.dataTotal = 0
          this.tableData = []
        }
        this.dataLoading = false
      })
    },
    sizeChange(val) {
      scrollTo(0, 600)
      this.dataQuery.rows = val
      this.dataQuery.page = 1
      this.getData()
    },
    currentChange(val) {
      scrollTo(0, 600)
      this.dataQuery.page = val
      this.getData()
    }
  }
}
</script>
<style>
.right {
  float: right;
}
.left {
  float: left;
}
.el-table--border th.gutter:last-of-type {
    display: block !important;
    width: 17px !important;
}
</style>
