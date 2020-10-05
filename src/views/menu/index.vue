<template>
  <el-container>
    <el-main class="page-main">
      <el-container>
        <el-aside :width="treeWidth">
          <tree :fetch="this.$api.sysMenu.tree" :query="nodeQuery" :call-back="getTreeDataCallBack" :click="nodeClick" />
        </el-aside>
        <el-container>
          <el-header style="margin-bottom: 10px;">
            <query ref="searchForm" :form-config="query" @onSubmit="search" />
          </el-header>
          <el-main class="table-main">
            <sheet ref="qtable" :api="this.$api.sysMenu.page" :columns="tableColumns" :data-query="dataQuery" :operates="operates" :float-type="'right'" :select-type="'selection'" />
          </el-main>
        </el-container>
      </el-container>
    </el-main>
    <el-dialog :title="dialogStatus==='create'? $t('common.create'):$t('common.update')" :visible.sync="dialogVisible" width="40%" @close="dialogClose">
      <el-form ref="dataForm" :size="size" :rules="rules" :model="temp" label-width="85px">
        <el-form-item label="Name:" prop="name">
          <el-input v-model="temp.name" placeholder="Please input name" />
        </el-form-item>
        <el-form-item label="Code:" prop="code">
          <el-input v-model="temp.code" placeholder="Please input code" />
        </el-form-item>
        <el-form-item label="Url:" prop="url">
          <el-input v-model="temp.url" placeholder="Please input url" />
        </el-form-item>
        <el-form-item label="Com:" prop="component">
          <el-input v-model="temp.component" placeholder="Please input component" />
        </el-form-item>
        <el-form-item label="Order:" prop="order">
          <el-input v-model.number="temp.order" placeholder="Please input order" />
        </el-form-item>
        <el-form-item label="Icon:" prop="icon">
          <el-input v-model="temp.icon" placeholder="Please input icon" />
        </el-form-item>
        <el-form-item label="Perms:" prop="perms">
          <el-input v-model="temp.perms" placeholder="Please input perms" />
        </el-form-item>
        <el-form-item label="Type:" prop="type">
          <option-set :value.sync="temp.type" placeholder="Please input type" code="sys_menu_type" />
        </el-form-item>
        <el-form-item label="Parent:" prop="parent">
          <cascader :api="this.$api.sysMenu.tree" :data-query="nodeQuery" :value.sync="temp.parent" />
        </el-form-item>
        <el-form-item label="Hidden:" prop="hidden">
          <el-radio v-model="temp.hidden" :label="1">{{ $t('common.yes') }}</el-radio>
          <el-radio v-model="temp.hidden" :label="0">{{ $t('common.no') }}</el-radio>
        </el-form-item>
      </el-form>
      <footer slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button :size="size" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('common.confirm') }}
        </el-button>
      </footer>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Tree from '@/components/Tree'
import Sheet from '@/components/Sheet'
import Cascader from '@/components/Cascader'
import OptionSet from '@/components/OptionSet'
import Query from '@/components/Query'
import { menu } from './query'

export default {
  name: 'Menu',
  components: {
    Tree,
    Sheet,
    Cascader,
    OptionSet,
    Query
  },
  mixins: [menu],
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
          prop: 'order',
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
        size: 10,
        name: '',
        code: ''
      },
      nodeQuery: {
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        url: '',
        component: '',
        parent: this.parent,
        inheritance: '',
        icon: '',
        order: 0,
        perms: '',
        type: 0,
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
        label: 'name',
        value: 'id',
        key: 'id'
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
    nodeClick(node) {
      this.dataQuery.parent = node.id
      this.$refs.qtable.getData()
    },
    getTreeDataCallBack(tree) {},
    handleChange(value) {},
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$api.sysMenu.add(this.temp).then(res => {
            this.dialogVisible = false
            this.$message({
              message: 'Created successfully',
              type: 'success'
            })
            this.$refs.qtable.getData()
            this.$store.dispatch('permission/resetRoutes')
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const postData = Object.assign({}, this.temp)
          this.$api.sysMenu.update(postData).then(res => {
            this.dialogVisible = false
            this.$message({
              message: 'modify successfully',
              type: 'success'
            })
            this.$refs.qtable.getData()
            this.$store.dispatch('permission/resetRoutes')
          })
        }
      })
    },
    search(obj) {
      this.$refs.qtable.getData(obj)
    },
    resetFields() {
      this.$refs['searchForm'].resetFields()
    },
    deleteData(row) {
      this.$confirm('Are you sure you want to delete this user ?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$api.sysMenu.del({ id: row.id }).then(res => {
          this.$message({
            message: 'successfully deleted',
            type: 'success'
          })
          this.$refs.qtable.getData()
          this.$store.dispatch('permission/resetRoutes')
        })
      })
    },
    deleteBatch() {
      const ids = []
      this.$refs.qtable.selectionData.forEach(row => {
        ids.push({ id: row.id })
      })
      this.$confirm('Are you sure to delete selected data in batch ?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$api.sysMenu.batchDel(ids).then(res => {
          this.$message({
            message: 'successfully deleted',
            type: 'success'
          })
          this.$refs.qtable.getData()
          this.$store.dispatch('permission/resetRoutes')
        })
      })
    },
    dialogClose() {},
    create() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    edit(row) {
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.temp = Object.assign({}, row)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
