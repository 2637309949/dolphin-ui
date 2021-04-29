<template>
  <el-container>
    <el-main class="page-main">
      <el-container>
        <el-header style="margin-bottom: 10px;">
          <query ref="searchForm" :form-config="query" @onSubmit="search" />
        </el-header>
        <el-main>
          <sheet ref="qtable" :api="this.$api.sysRole.page" :columns="tableColumns" :data-query="dataQuery" :operates="operates" :float-type="'right'" :select-type="'selection'" />
        </el-main>
      </el-container>
    </el-main>
    <el-dialog :title="dialogStatus==='create'? $t('common.create'):$t('common.update')" :visible.sync="dialogVisible" width="60%" @close="dialogClose">
      <el-form ref="dataForm" :size="size" :rules="rules" :model="temp" label-width="85px">
        <el-form-item label="角色名:" prop="name">
          <el-input v-model="temp.name" :size="size" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="编码:" prop="code">
          <el-input v-model="temp.code" :size="size" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="后台首页:" prop="index_component">
          <el-input v-model="temp.index_component" :size="size" placeholder="请输入后台首页" />
        </el-form-item>
        <el-form-item label="APP首页:" prop="app_index">
          <el-input v-model="temp.app_index" :size="size" placeholder="请输入APP首页" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label prop="code">
          <el-tabs v-model="activeName" @tab-click="handleTabsClick">
            <el-tab-pane label="后台菜单" name="first">
              <tree-transfer
                :title="transferTitle"
                :from_data="fromData"
                :to_data="selectMenu"
                :default-checked-keys="selectedArray"
                :default-props="defaultProps"
                check-strictly="true"
                :mode="mode"
                height="350px"
                filter
                open-all
                @addBtn="changeMenu"
                @removeBtn="changeMenu"
              />
            </el-tab-pane>
            <el-tab-pane label="APP功能" name="second">
              <tree-transfer
                :title="transferTitle"
                :from_data="appFunfromData"
                :to_data="selectAppFun"
                :default-checked-keys="selectedAppFunArray"
                :default-props="defaultProps"
                check-strictly="true"
                :mode="mode"
                height="350px"
                filter
                open-all
                @addBtn="changeAppFun"
                @removeBtn="changeAppFun"
              />
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
      <footer slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button :size="size" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('common.confirm') }}</el-button>
      </footer>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils/index'
import Sheet from '@/components/Sheet'
import treeTransfer from 'el-tree-transfer'
import Query from '@/components/Query'
import { scheduling } from './query'
import i18n from '@/i18n'

export default {
  name: 'Scheduling',
  components: {
    Sheet,
    treeTransfer,
    Query
  },
  mixins: [scheduling],
  data() {
    return {
      menu: [],
      activeName: 'first',
      role_id: '',
      fromData: [],
      selectMenu: [],
      selectedArray: [],
      appFunfromData: [],
      selectAppFun: [],
      selectedAppFunArray: [],
      transferTitle: ['Source', 'Target'],
      tableColumns: [
        {
          prop: 'name',
          label: i18n.t('Name'),
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
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        index_component: [
          { required: true, message: '请输入后台组件', trigger: 'blur' }
        ],
        app_index: [
          { required: true, message: '请输入app首页', trigger: 'blur' }
        ]
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        index_component: '',
        app_index: ''
      },
      mode: 'transfer',
      defaultProps: {
        children: 'nodes',
        label: 'name',
        value: 'id',
        key: 'id'
      },
      dataLoading: false,
      dialogStatus: '',
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['size', 'minMainHeight'])
  },
  created() {},
  methods: {
    handleTabsClick(tab, event) {},
    getRoleMenuTree(role_id) {
      Promise.all([this.$api.sysMenu.tree(), this.$api.sysRole.roleMenuTree({ role_id: role_id })]).then(res => {
        this.fromData = res[0].data
        this.selectMenu = res[1].data
        this.selectedArray = []
        this.selectMenu.forEach(item => {
          const subSelectId = this.getEndNodes(item)
          this.selectedArray = this.selectedArray.concat(subSelectId)
        })
      })
    },
    getRoleAppFun(role_id) {
      Promise.all([this.$api.sysAppFun.tree(), this.$api.sysRole.roleAppFunTree({ role_id: role_id })]).then(res => {
        this.appFunfromData = res[0].data
        this.selectAppFun = res[1].data

        this.selectedAppFunArray = []
        this.selectAppFun.forEach(item => {
          const subSelectId = this.getEndNodes(item)
          this.selectedAppFunArray = this.selectedAppFunArray.concat(
            subSelectId
          )
        })
      })
    },
    getEndNodes(tree) {
      let array = []
      tree.nodes.forEach(node => {
        if (node.nodes === null || node.nodes.length === 0) {
          array.push(node.id)
        } else {
          array = array.concat(this.getEndNodes(node))
        }
      })
      return array
    },
    changeMenu(fromData, toData, obj) {
      let menu_ids = []
      toData.forEach(item => {
        const submenus = this.treeToArray(item, 'id')
        menu_ids = menu_ids.concat(submenus)
      })
      this.menu = menu_ids
      this.$api.system
        .AddRoleMenu({ role_id: this.role_id, menu_ids: menu_ids })
        .then(res => {
          this.getRoleMenuTree(this.role_id)
        })
    },
    changeAppFun(fromData, toData, obj) {
      let app_fun_ids = []
      toData.forEach(item => {
        const subAppFuns = this.treeToArray(item, 'id')
        app_fun_ids = app_fun_ids.concat(subAppFuns)
      })
      this.$api.app_fun
        .AddRoleAppFun({ role_id: this.role_id, app_fun_ids: app_fun_ids })
        .then(res => {
          this.getAppFunTree(this.role_id)
        })
    },
    treeToArray(data, key) {
      let array = []
      if (key !== undefined) {
        array.push(data[key])
      } else {
        array.push(data)
      }
      if (data.nodes === null || data.nodes.length === 0) {
        return array
      }
      data.nodes.forEach(item => {
        if (item.nodes != null && item.nodes.length > 0) {
          array = array.concat(this.treeToArray(item, key))
        } else {
          if (key !== undefined) {
            array.push(item[key])
          } else {
            array.push(item)
          }
        }
      })
      return array
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$api.sysRole.add(this.temp).then(res => {
            this.dialogVisible = false
            if (res.code === 200) {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.$refs.qtable.getData()
            } else {
              this.$message({
                message: '创建失败',
                type: 'error'
              })
            }
          })
        }
      })
    },
    updateData() {
      if (this.menu.length === 0) {
        this.$message.error('最少选择一个菜单，加入到已选择项中')
        return
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const postData = Object.assign({}, this.temp)
          this.$api.system.UpdateRole(postData).then(res => {
            this.dialogVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$refs.qtable.getData()
          })
        }
      })
    },
    deleteData(row) {
      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$api.system.DelRole([{ id: row.id }]).then(res => {
          this.$refs.qtable.getData()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
        .catch(() => {})
    },
    deleteBatch() {
      const ids = []
      this.$refs.qtable.multipleSelection.forEach(row => {
        ids.push({ id: row.id })
      })
      this.$confirm('确认批量删除选中数据吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$api.system.DelRole(ids).then(res => {
          this.$refs.qtable.getData()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
        .catch(() => {})
    },
    search(obj) {
      this.$refs.qtable.getData(obj)
    },
    resetFields() {
      this.$refs['searchForm'].resetFields()
    },
    dialogClose() {
      this.$refs['dataForm'].resetFields()
    },
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
        this.temp = deepClone(row)
        this.role_id = row.id
        this.getRoleMenuTree(this.role_id)
        this.getRoleAppFun(this.role_id)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
