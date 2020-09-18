<template>
  <el-container>
    <el-main>
      <el-card>
        <el-container>
          <el-header height="120">
            <el-form
              ref="searchForm"
              :model="dataQuery"
              :size="size"
              label-position="left"
              label-width="80px"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="名称:"
                    prop="name"
                    class="notice-input"
                    label-width="60px"
                  >
                    <el-input
                      v-model="dataQuery.name"
                      placeholder="请输入名称"
                      clearable
                      style="width: 60%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" :size="size" @click="search">查询</el-button>
                    <el-button icon="el-icon-refresh" :size="size" @click="resetFields">重置</el-button>
                    <!-- -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  :size="size"
                  @click="create"
                >新建人员信息模板
                </el-button>
                <!--<el-button :size="size" @click="deleteBatch">回收站</el-button>-->
              </el-row>
            </el-form>
          </el-header>
          <el-main>
            <sheet
              ref="qtable"
              :api="this.$api.system.FindUserTemplatePage"
              :columns="tableColumns"
              :data-query="dataQuery"
              :operates="operates"
              :float-type="'right'"
              :select-type="'selection'"
            />
          </el-main>
        </el-container>
      </el-card>
    </el-main>
    <el-dialog
      :title="dialogStatus==='create'?'新建用户':'编辑用户'"
      :visible.sync="dialogVisible"
      width="40%"
      @close="Emptydata"
    >
      <el-form
        ref="temp"
        :size="size"
        :rules="rules"
        :model="temp"
        label-width="85px"
      >
        <el-form-item label="模板名称:" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="模板类型:" prop="type">
          <el-select v-model.number="temp.type" style="width: 100%" placeholder="请选择角色">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否默认:" prop="type">
          <option-set
            :value.sync="temp.default"
            placeholder="是否默认"
            code="defalut"
          />
          <!--<el-select v-model="temp.default" style="width: 100%"  placeholder="是否默认">-->
          <!--<el-option-->
          <!--v-for="item in defaultOpts"-->
          <!--:key="item.value"-->
          <!--:label="item.name"-->
          <!--:value="item.value"-->
          <!--/>-->
          <!--</el-select>-->
        </el-form-item>
      </el-form>
      <footer slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取 消</el-button>
        <el-button :size="size" type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定
        </el-button>
      </footer>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Sheet from '@/components/Sheet'
import OptionSet from '@/components/OptionSet'
export default {
  name: 'User',
  components: {
    OptionSet,
    Sheet
  },
  data() {
    return {
      defaultOpts: [
        { name: '否', value: 0 },
        { name: '是', value: 1 }
      ],
      tableColumns: [
        { prop: 'name', label: '模板名称', align: 'center', minWidth: 150, maxWidth: 180 },
        { prop: 'default', label: '是否默认', align: 'center', minWidth: 150, maxWidth: 180, formatter: 'defalut' }
      ],
      operates: {
        list: [
          { label: '明细', show: true, type: 'text', method: (row) => { this.detail(row) } },
          { label: '编辑', show: true, type: 'text', method: (row) => { this.edit(row) } },
          { label: '删除', show: true, type: 'text', method: (row) => { this.deleteData(row) } }
        ],
        width: 230,
        fixed: 'right'
      },
      dataQuery: {
        page: 1,
        size: 10,
        name: ''
      },
      options: [
        {
          name: '固定模块',
          id: 0
        },
        {
          name: '自定义模板',
          id: 2
        },
        {
          name: '动态模板',
          id: 1
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        // login_id: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择模板类型', trigger: 'change' }]
      },
      temp: {
        id: '',
        type: 0,
        name: '',
        default: 0
      },
      dataLoading: false,
      dialogStatus: '',
      dialogVisible: false
    }
  },
  computed: {
    // tempRoleChange: {
    //   get: function() {
    //     if (this.temp.user_role === '' || this.temp.user_role === undefined) {
    //       return []
    //     }
    //     return this.temp.user_role.split(',')
    //   },
    //   set: function(newValue) {
    //     this.temp.user_role = newValue.join(',')
    //   }
    // },
    ...mapGetters([
      'size',
      'minMainHeight'
    ])
  },
  watch: {
    // user_role: function(newData, oldData) {
    //   debugger
    //   this.temp.user_role = newData
    // }
  },
  created() {
    // this.getOrgs()
    // this.getRoles()
  },
  methods: {
    detail(row) {
      this.$router.push({ path: 'templ_detail?temp_id=' + row.id + '&temp_name=' + row.name })
    },
    // 新建数据
    createData() {
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          // var data = JSON.stringify(this.temp)
          // this.temp.type = toString(this.temp.type)
          debugger
          this.$api.system.AddUserTemplate(this.temp).then(res => {
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
    Emptydata() {
      this.$refs['temp'].resetFields()
    },
    // 更新数据
    updateData() {
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          // this.temp.type = parseInt(this.temp.type)
          this.$api.system.UpdateUserTemplate(this.temp).then(res => {
            if (res.code === 200) {
              this.dialogVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$refs.qtable.getData()
            } else {
              this.dialogVisible = false
              this.$message({
                message: '修改失败',
                type: 'error'
              })
            }
          })
        }
      })
    },
    // 删除数据
    deleteData(row) {
      this.$confirm('确认删除这个用户吗？', '提示', {
        type: 'warning'
      }).then(() => {
        // const data = [row.id]
        this.$api.system.DelUserTemplate([{ id: row.id }]).then(res => {
          if (res.code === 200) {
            this.$refs.qtable.getData()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
      }).catch(() => {
      })
    },
    // 批量删除
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
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
      }).catch(() => {
      })
    },
    // 查询
    search() {
      this.$refs.qtable.getData()
    },
    // 重置
    resetFields() {
      this.$refs['searchForm'].resetFields()
      this.$refs.qtable.getData()
    },
    // 弹出框关闭触发
    dialogClose() {
      this.$refs['dataForm'].resetFields()
    },
    // 点击新建按钮
    create() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    // 点击修改按钮
    edit(row) {
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
        // this.temp.create_time = ''
        // copyObject(row, this.temp)
        this.temp = Object.assign({}, row)
      })
    }

  }
}
</script>

<style scoped lang="scss">
</style>
