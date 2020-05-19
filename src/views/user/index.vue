<template>
  <el-container>
    <el-main class="page-main">
      <el-card>
        <el-container>
          <el-aside class="tree-aside" :width="treeWidth">
            <tree title="Org" :fetch="this.$api.sysOrg.tree" :data-query="treeQuery" :call-back="getTreeDataCallBack" :click="treeClick" />
          </el-aside>
          <el-container>
            <el-header height="82">
              <el-form ref="searchForm" :model="dataQuery" :size="size" label-position="left" label-width="80px">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item label="Mobile:" prop="mobile" class="notice-input" label-width="60px">
                      <el-input v-model="dataQuery.mobile" placeholder="Please enter your account" clearable @keyup.enter.native="search" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="Name:" prop="name" class="notice-input" label-width="60px">
                      <el-input v-model="dataQuery.name" placeholder="Please enter the name" clearable @keyup.enter.native="search" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="text-align: right">
                    <el-form-item>
                      <el-button type="primary" icon="el-icon-search" :size="size" @click="search">{{ $t('common.search') }}</el-button>
                      <el-button icon="el-icon-refresh" :size="size" @click="resetFields">{{ $t('common.reset') }}</el-button>
                      <export-button :api="this.$api.sysUser.page" :columns="tableColumns" :data-query="dataQuery" name="users.xlsx" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    :size="size"
                    @click="create"
                  >{{ $t('common.create') }}
                  </el-button>
                  <el-button
                    v-if="checkPermission(['update_password'])"
                    type="success"
                    icon="el-icon-edit"
                    :size="size"
                    @click="updatePassword"
                  >Change password
                  </el-button>
                  <el-button :size="size" @click="deleteBatch">Bulk Delete</el-button>
                </el-row>
              </el-form>
            </el-header>
            <el-main class="table-main">
              <sheet
                ref="qtable"
                :api="this.$api.sysUser.page"
                :columns="tableColumns"
                :data-query="dataQuery"
                :operates="operates"
                :float-type="'right'"
                :select-type="'selection'"
                header-name="searchForm"
              />
            </el-main>
          </el-container>
        </el-container>
      </el-card>
    </el-main>

    <el-dialog
      :title="dialogStatus==='create'?$t('common.create'):$t('common.update')"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        ref="tempForm"
        :size="size"
        :rules="rules"
        :model="temp"
        label-width="85px"
      >
        <el-form-item label="Name:" prop="name">
          <el-input v-model="temp.name" placeholder="Please enter the username" />
        </el-form-item>
        <el-form-item label="NickName:" prop="nickname">
          <el-input v-model="temp.nickname" placeholder="Please enter the nickname" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="Pwd:" prop="password">
          <el-input v-model="temp.password" placeholder=" Please enter your password" />
        </el-form-item>
        <el-form-item label="Org:">
          <el-select v-model="temp.org_id" style="width: 100%" placeholder=" Please select the org">
            <el-option
              v-for="item in orgs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Email:" prop="email">
          <el-input v-model="temp.email" placeholder="Please enter the mailbox" />
        </el-form-item>
        <el-form-item label="Mobile:" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="Please enter your phone" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="Role:" prop="type">
          <el-select v-model="temp.user_role" style="width: 100%" multiple placeholder="Please select the role">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Template:" prop="temp_id">
          <el-select v-model="temp.temp_id" style="width: 100%" placeholder="Please select the template" @change="tempChange">
            <el-option
              v-for="item in templs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(item, i) in temp_items"
          :key="item.id"
          :label="item.name + ':'"
          label-position="right"
          class="notice-input"
          :prop="item.id"
        >
          <el-input v-if="item.type == 0" v-model.number="temp_items[i].value" placeholder="Please ente" clearable />
          <el-input v-if="item.type == 2" v-model="temp_items[i].value" placeholder="Please ente" clearable />
        </el-form-item>
      </el-form>
      <footer slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取 消</el-button>
        <el-button :size="size" type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </footer>
    </el-dialog>
    <el-dialog title="Change password" :visible.sync="updatePswDialog" width="30%">
      <el-form ref="updatePswForm" :size="size" :rules="rules" :model="temp" label-width="85px">
        <el-form-item label="Mobile:" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="Please enter the mobile" />
        </el-form-item>
        <el-form-item label="Name:" prop="name">
          <el-input v-model="temp.name" placeholder="Please enter the username" />
        </el-form-item>
        <el-form-item label="Pwd:" prop="password">
          <el-input v-model="temp.password" placeholder="Please enter the passowrd" />
        </el-form-item>
      </el-form>
      <footer slot="footer" class="dialog-footer">
        <el-button :size="size" @click="updatePswDialog = false">Cancel</el-button>
        <el-button :size="size" type="primary" @click="updatePws">confirm
        </el-button>
      </footer>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils/index'
import checkPermission from '@/utils/permission'
import Tree from '@/components/Tree'
import Sheet from '@/components/Sheet'
import ExportButton from '@/components/ExportButton'

export default {
  name: 'User',
  components: {
    Tree,
    Sheet,
    ExportButton
  },
  data() {
    return {
      tableColumns: [
        { prop: 'name', label: 'Name', align: 'center', minWidth: 150, maxWidth: 180 },
        { prop: 'email', label: 'Email', align: 'center', minWidth: 150, maxWidth: 180 },
        { prop: 'mobile', label: 'Mobile', align: 'center', minWidth: 150, maxWidth: 180 },
        { prop: 'org_name', label: 'Org', align: 'center', minWidth: 150, maxWidth: 180 },
        { prop: 'role_name', label: 'Role', align: 'center', minWidth: 150, maxWidth: 180 },
        { prop: 'status', formatter: 'sys_user_status', label: 'Status', align: 'center', minWidth: 150, maxWidth: 180 }
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
        rows: 10,
        name: '',
        cn_org_id: ''
      },
      rules: {
        name: [{ required: true, message: '请输入账号名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      treeQuery: { del_falg: 0 },
      temp: {
        id: undefined,
        name: '',
        password: '',
        email: '',
        mobile: '',
        type: 0,
        org_id: '',
        temp_value: '',
        temp_id: '',
        user_role: []
      },
      dataLoading: false,
      dialogStatus: '',
      dialogVisible: false,
      updatePswDialog: false,
      orgs: [],
      options: [],
      templs: [],
      temp_items: []
    }
  },
  computed: {
    inheritanceArray() {
      if (!this.temp.inheritance) {
        return []
      }
      let array = this.temp.inheritance.split('|').reverse()
      array = array.slice(1, array.length - 2)
      array.push(array[array.length - 1])
      return array
    },
    parent() {
      return this.inheritanceArray[this.inheritanceArray.length - 1]
    },
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
  created() {
    this.getOrgs()
    this.getRoles()
    this.FindUserTempl()
  },
  methods: {
    checkPermission,
    tempChange(temp_id) {
      this.getTempDetail(temp_id)
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget)
    },
    handleEdit(index, row, col) {
    },
    handleDelete(index, dataIndex) {
      this.temp_items[dataIndex].value.splice(index, 1)
    },
    addRow(dataIndex) {
      const obj = {}
      JSON.parse(this.temp_items[dataIndex].content).forEach(item => {
        obj[item.prop] = ''
      })
      this.temp_items[dataIndex].value.push(obj)
    },
    getTempDetail(temp_id) {
      this.$api.sysUserTemplate.page({ page: 1, rows: 100, 'temp_id': temp_id }).then(res => {
        this.temp_items = res.data.data
        var tempValue
        if (this.temp.temp_value !== '' && this.temp.temp_value !== undefined) {
          tempValue = JSON.parse(this.temp.temp_value)
        } else {
          tempValue = []
        }
        this.temp_items.forEach((item, i) => {
          tempValue.forEach(value => {
            if (item.id === value.id) {
              if (item.type === 3) {
                this.temp_items[i].value = value.value
              } else {
                this.temp_items[i].value = value.value
              }
            }
          })
          // 如果列表内容是空，默认添加一行空行
          if (item.type === 3 && this.temp_items[i].value === '') {
            var row = {}
            JSON.parse(this.temp_items[i].content).forEach(col => {
              row[col.prop] = '请输入'
            })
            this.temp_items[i].value = [row]
          }
        })
      })
    },
    FindUserTempl() {
      this.$api.sysUserTemplate.page({ page: 1, rows: 100 }).then(res => {
        if (res.code === 200) {
          this.templs = res.data.content
        }
      })
    },
    getOrgs() {
      this.$api.sysOrg.page({ 'page': 1, 'rows': 100 }).then(res => {
        this.orgs = res.data.data
      })
    },
    getRoles() {
      const pageData = { 'page': 1, 'rows': 100 }
      this.$api.sysRole.page(pageData).then(res => {
        this.options = res.data.data
      })
    },
    treeClick(node) {
      this.dataQuery.cn_org_id = node.id
      this.$refs.qtable.getData()
    },
    getTreeDataCallBack(tree) {},
    handleChange(value) {
      this.temp.parent = value[value.length - 1]
    },
    createData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          this.temp.temp_value = JSON.stringify(this.temp_items)
          this.$api.sysUser.create(this.temp).then((res) => {
            if (res.code === 200) {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.$refs.qtable.getData()
              this.dialogVisible = false
            }
          })
        }
      })
    },
    updatePassword() {
      if (this.$refs.qtable.selectionData.length === 1) {
        this.temp = this.$refs.qtable.selectionData[0]
        this.temp.password = ''
        this.updatePswDialog = true
      } else {
        this.$message({
          message: '请选择一条记录',
          type: 'error'
        })
      }
    },
    updatePws() {
      this.$api.system.UpdatePassword(this.temp).then(res => {
        if (res.code === 200) {
          this.updatePswDialog = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogVisible = false
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          })
        }
      })
    },
    updateData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          this.temp.temp_value = JSON.stringify(this.temp_items)
          this.$api.sysUser.update(this.temp).then((res) => {
            if (res.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            }
            this.dialogVisible = false
          }).catch(() => {})
        }
      })
    },
    deleteData(row) {
      this.$confirm('确认删除这个用户吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const data = [{ id: row.id }]
        this.$api.sysUser.del(data).then((res) => {
          if (res.code === 200) {
            this.$refs.qtable.getData()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        }).catch(() => {})
      })
    },
    deleteBatch() {
      const ids = []
      this.$refs.qtable.multipleSelection.forEach(row => {
        ids.push({ id: row.id })
      })
      this.$confirm('确认批量删除选中数据吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$api.user.del(ids).then(res => {
          if (res.code === 200) {
            this.$refs.qtable.getData()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        })
      }).catch(() => {})
    },
    search() {
      this.$refs.qtable.getData()
    },
    resetFields() {
      this.$refs['searchForm'].resetFields()
      this.dataQuery.cn_org_id = ''
      this.$refs.qtable.getData()
    },
    dialogClose() {
      this.$refs['tempForm'].resetFields()
    },
    create() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['tempForm'].clearValidate()
      })
      this.temp.temp_id = this.templs.filter((currentValue, index, arr) => {
        if (currentValue.default === 1) {
          return currentValue.id
        }
      })[0].id
      this.getTempDetail(this.temp.temp_id)
    },
    edit(row) {
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['tempForm'].clearValidate()
        this.temp = deepClone(row)
        if (row.user_role === '') {
          this.temp.user_role = []
        } else {
          this.temp.user_role = row.user_role.split(',')
        }
        if (row.temp_id !== '') {
          this.getTempDetail(row.temp_id)
        } else {
          this.temp.temp_id = this.templs.filter((currentValue, index, arr) => {
            if (currentValue.type === 1) {
              return currentValue.id
            }
          })[0].id
          this.getTempDetail(this.temp.temp_id)
        }
      })
    }
  }
}
</script>

<style>
  .tb-edit .el-input {
    display: none
  }
  .tb-edit .current-row .el-input {
    display: block
  }
  .tb-edit .current-row .el-input+span {
    display: none
  }
</style>
