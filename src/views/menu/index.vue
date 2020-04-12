<template>
  <el-container>
    <el-main class="page-main">
      <el-card>
        <el-container>
          <el-aside :width="treeWidth">
            <tree
              title="Menu"
              :api="this.$api.sysMenu.tree"
              :data-query="treeQuery"
              :call-back="getTreeDataCallBack"
              :click="treeClick"
            />
          </el-aside>
          <el-container>
            <el-header height="120">
              <el-form ref="searchForm" :size="size" label-position="left" label-width="80px">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item label="Name:" class="notice-input" label-width="60px">
                      <el-input
                        v-model="dataQuery.name"
                        placeholder="Please input name"
                        clearable
                        @keyup.enter.native="search"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="Code:" class="notice-input" label-width="60px">
                      <el-input
                        v-model="dataQuery.code"
                        placeholder="Please input code"
                        clearable
                        @keyup.enter.native="search"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="text-align: right">
                    <el-form-item>
                      <el-button
                        type="primary"
                        icon="el-icon-search"
                        :size="size"
                        @click="search"
                      >Search</el-button>
                      <el-button icon="el-icon-refresh" :size="size" @click="resetFields">Reset</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-button type="primary" icon="el-icon-plus" :size="size" @click="create">New</el-button>
                  <el-button :size="size" @click="deleteBatch">BatchDelete</el-button>
                </el-row>
              </el-form>
            </el-header>
            <el-main class="table-main">
              <sheet
                ref="qtable"
                :api="this.$api.sysMenu.page"
                :columns="tableColumns"
                :data-query="dataQuery"
                :operates="operates"
                :float-type="'right'"
                :select-type="'selection'"
              />
            </el-main>
          </el-container>
        </el-container>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Tree from '@/components/Tree'
import Sheet from '@/components/Sheet'

export default {
  name: 'Menu',
  components: { Tree, Sheet },
  data() {
    return {
      tableColumns: [
        {
          prop: 'name',
          label: 'Name',
          align: 'center',
          minWidth: 150,
          maxWidth: 220
        },
        {
          prop: 'url',
          label: 'Url',
          align: 'center',
          minWidth: 150,
          maxWidth: 220
        },
        {
          prop: 'component',
          label: 'Component',
          align: 'center',
          minWidth: 180,
          maxWidth: 220
        },
        {
          prop: 'code',
          label: 'Code',
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        },
        {
          prop: 'order_num',
          label: 'Order',
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        }
      ],
      operates: {
        list: [
          {
            label: 'Edit',
            show: true,
            type: 'primary',
            method: row => {
              this.edit(row)
            }
          },
          {
            label: 'Delete',
            show: true,
            type: 'danger',
            method: row => {
              this.deleteData(row)
            }
          }
        ],
        width: 160,
        fixed: 'right'
      },
      dataQuery: {
        page: 1,
        rows: 10,
        name: '',
        code: '',
        cn_id: '',
        type_op: '>=',
        type: '0',
        hidden: 0
      },
      treeQuery: { del_falg: 0, hidden: 0, type_op: '>=', type: 0 },
      temp: {
        id: undefined,
        name: '',
        code: '',
        url: '',
        component: '',
        parent: this.parent,
        inheritance: '',
        icon: '',
        order_num: 0,
        perms: '',
        type: '',
        hidden: 0
      },
      rules: {
        code: [{ required: true, message: 'Please input code', trigger: 'blur' }],
        name: [{ required: true, message: 'Please input menu name', trigger: 'blur' }],
        url: [{ required: true, message: 'Please input url', trigger: 'blur' }]
      },
      cascaderData: [],
      defaultProps: {
        children: 'nodes',
        label: 'text',
        value: 'id'
      },
      dataLoading: false,
      dialogStatus: '',
      dialogVisible: false,
      menuTypes: [
        { id: 0, name: 'Dir' },
        { id: 1, name: 'Menu' },
        { id: 2, name: 'Button' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'size',
      'minMainHeight',
      'treeWidth'
    ])
  },
  mounted() {
    var height = this.$refs.searchForm.$el.offsetHeight
    this.$store.dispatch('app/pageTableHeaderHeight', { height: height })
  },
  destroyed() {
    this.$store.dispatch('app/pageTableHeaderHeight', { height: 0 })
  },
  created() {},
  methods: {
    treeClick(node) {},
    getTreeDataCallBack(tree) {},
    handleChange(value) {},
    createData() {},
    updateData() {},
    search() {},
    resetFields() {},
    deleteData(row) {},
    deleteBatch() {},
    dialogClose() {},
    create() {},
    edit(row) {}
  }
}
</script>

<style scoped lang="scss">
</style>
