<template>
  <el-container>
    <el-main class="page-main">
      <el-container>
        <el-aside :width="treeWidth">
          <tree title="Org" :fetch="this.$api.sysOrg.tree" :query="nodeQuery" :call-back="getTreeDataCallBack" :click="nodeClick" />
        </el-aside>
        <el-container>
          <el-header style="margin-bottom: 10px;">
            <query ref="searchForm" :form-config="query" @onSubmit="search" @onCreate="create" @onDeleteBatch="deleteBatch" />
          </el-header>
          <el-main class="table-main">
            <sheet ref="qtable" :api="this.$api.sysOrg.page" :columns="tableColumns" :data-query="dataQuery" :operates="operates" :float-type="'right'" :select-type="'selection'" :selection-data.sync="selectionData" />
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
          <el-select v-model="temp.type" placeholder="Please input type" style="width: 100%;">
            <el-option v-for="item in menuTypes" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Parent:" prop="parent">
          <cascader :api="this.$api.sysOrg.tree" :data-query="nodeQuery" :value.sync="temp.parent" />
        </el-form-item>
        <el-form-item label="Hidden:" prop="hidden">
          <el-radio v-model="temp.hidden" :label="1">是</el-radio>
          <el-radio v-model="temp.hidden" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <footer slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">Cancel</el-button>
        <el-button :size="size" type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm
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
import Query from '@/components/Query'
import { org } from './query'
import i18n from '@/i18n'

export default {
  name: 'Org',
  components: {
    Tree,
    Sheet,
    Cascader,
    Query
  },
  mixins: [org],
  data() {
    return {
      tableColumns: [
        {
          prop: 'name',
          label: i18n.t('Name'),
          align: 'center',
          minWidth: 150,
          maxWidth: 220
        },
        {
          prop: 'url',
          label: i18n.t('Url'),
          align: 'center',
          minWidth: 150,
          maxWidth: 220
        },
        {
          prop: 'component',
          label: i18n.t('Component'),
          align: 'center',
          minWidth: 180,
          maxWidth: 220
        },
        {
          prop: 'code',
          label: i18n.t('Code'),
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        },
        {
          prop: 'order',
          label: i18n.t('Order'),
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        }
      ],
      operates: {
        list: [
          { label: 'Edit', show: true, type: 'text', method: (row) => { this.edit(row) } },
          { label: 'Del', show: true, type: 'text', method: (row) => { this.deleteData(row) } }
        ],
        width: 100,
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
      ],
      selectionData: []
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
          this.$api.sysOrg.add(this.temp).then(res => {
            this.dialogVisible = false
            this.$message({
              message: 'Created successfully',
              type: 'success'
            })
            this.$refs.qtable.getData()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const postData = Object.assign({}, this.temp)
          this.$api.sysOrg.update(postData).then(res => {
            this.dialogVisible = false
            this.$message({
              message: 'modify successfully',
              type: 'success'
            })
            this.$refs.qtable.getData()
          })
        }
      })
    },
    search(obj) {
      return this.$refs.qtable.getData(obj)
    },
    resetFields() {
      this.$refs['searchForm'].resetFields()
    },
    deleteData(row) {
      this.$confirm('Are you sure you want to delete this user ?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$api.sysOrg.del({ id: row.id }).then(res => {
          this.$message({
            message: 'successfully deleted',
            type: 'success'
          })
          this.$refs.qtable.getData()
        })
      })
    },
    deleteBatch() {
      const ids = this.selectionData.map(row => ({ id: row.id }))
      this.$confirm('Are you sure to delete selected data in batch ?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$api.sysOrg.batchDel(ids).then(res => {
          this.$refs.qtable.getData()
          this.$message({
            message: 'successfully deleted',
            type: 'success'
          })
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
