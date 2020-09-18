<template>
  <el-container>
    <el-main class="page-main">
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
                <el-col :span="6">
                  <el-form-item label="名称:" prop="name" class="notice-input" label-width="60px">
                    <el-input v-model="dataQuery.name" placeholder="请输入名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="类型:" prop="type" class="notice-input" label-width="60px">
                    <qselect
                      :value.sync="dataQuery.type"
                      placeholder="类型"
                      code="template_item_type"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-form-item>
                    <el-button :size="size" @click="back">返回上一页</el-button>
                    <el-button type="primary" icon="el-icon-search" :size="size" @click="search">查询</el-button>
                    <el-button icon="el-icon-refresh" :size="size" @click="resetFields">重置</el-button>
                    <!-- -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-button type="primary" icon="el-icon-plus" :size="size" @click="create">新建</el-button>
                <el-button :size="size" @click="deleteBatch">批量删除</el-button>
              </el-row>
            </el-form>
          </el-header>
          <el-main>
            <sheet
              ref="qtable"
              :api="this.$api.system.FindUserTemplateDetailPage"
              :columns="tableColumns"
              :data-query="dataQuery"
              :float-type="'right'"
              :select-type="'selection'"
              :operates="operates"
            />
          </el-main>
        </el-container>
      </el-card>
    </el-main>

    <el-dialog
      :title="dialogStatus==='create'?'新建模板明细':'编辑模板明细'"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-form ref="dataForm" :size="size" :rules="rules" :model="temp" label-width="85px">
        <el-form-item label="所属模板:">
          <el-input v-model="temp_name" disabled />
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="优先级:" prop="priority">
          <el-input v-model.number="temp.priority" />
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <option-set :value.sync="temp.type" placeholder="类型" code="template_item_type" />
        </el-form-item>
        <el-form-item v-if="temp.type == 3" label="字段:" prop="type">
          <el-table :data="colsData" class="tb-edit" style="width: 100%" highlight-current-row>
            <el-table-column label="label" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.label" size="small" placeholder="请输入内容" />
                <span>{{ scope.row.label }}</span>
              </template>
            </el-table-column>
            <el-table-column label="prop" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.prop" size="small" placeholder="请输入内容" />
                <span>{{ scope.row.prop }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="width" label="width">
              <template slot-scope="scope">
                <el-input v-model="scope.row.width" size="small" placeholder="请输入内容" />
                <span>{{ scope.row.width }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <el-button
                  v-if="scope.$index == colsData.length - 1"
                  size="small"
                  @click="addCol(scope.$index, scope.row)"
                >添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <footer slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取 消</el-button>
        <el-button
          :size="size"
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >确 定</el-button>
      </footer>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Sheet from '@/components/Sheet'
import OptionSet from '@/components/OptionSet'
export default {
  components: {
    Sheet,
    OptionSet
  },
  data() {
    return {
      colsData: [],
      tableColumns: [
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        },
        {
          prop: 'type',
          label: '类型',
          align: 'center',
          minWidth: 150,
          maxWidth: 180,
          formatter: 'template_item_type'
        },
        {
          prop: 'priority',
          label: '优先级',
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        }
      ],
      tableData: null,
      operates: {
        list: [
          {
            label: '编辑',
            show: true,
            type: 'text',
            method: row => {
              this.edit(row)
            }
          },
          {
            label: '删除',
            show: true,
            type: 'text',
            method: row => {
              this.deleteData(row)
            }
          }
        ],
        width: 150,
        fixed: 'right'
      },
      dataQuery: {
        page: 1,
        size: 10,
        __sort__: 'sys_user_template_detail.priority asc',
        temp_id: '',
        name: '',
        type: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入选择类型', trigger: 'blur' }],
        priority: [{ required: true, message: '请输入优先级', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        name: '',
        priority: '',
        type: 0,
        temp_id: '',
        value: ''
      },
      temp_name: '',
      dataLoading: false,
      dialogStatus: '',
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['size', 'minMainHeight'])
  },
  watch: {},
  created() {
    this.dataQuery.temp_id = this.$route.query.temp_id
    this.temp.temp_id = this.$route.query.temp_id
    this.temp_name = this.$route.query.temp_name
  },
  methods: {
    typeChange(type) {
      if (type === 3) {
        this.colsData = [{ label: '默认', prop: 'defalut', width: '150' }]
      }
    },
    back() {
      this.$router.go(-1)
    },
    addCol(index, row) {
      const newRow = {}
      for (var item in row) {
        newRow[item] = ''
      }
      this.colsData.push(newRow)
    },
    handleDelete(index) {
      this.colsData.splice(index, 1)
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.content = JSON.stringify(this.colsData)
          this.$api.system.AddUserTemplateDetail(this.temp).then(res => {
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.content = JSON.stringify(this.colsData)
          this.$api.system.UpdateUserTemplateDetail(this.temp).then(res => {
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
    deleteData(row) {
      this.$confirm('确认删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$api.system.DelUserTemplateDetail([{ id: row.id }]).then(res => {
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
      })
        .then(() => {
          this.$api.system.DelUserTemplateDetail(ids).then(res => {
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
        })
        .catch(() => {})
    },
    search() {
      this.$refs.qtable.getData()
    },
    resetFields() {
      this.$refs['searchForm'].resetFields()
      this.$refs.qtable.getData()
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
        // copyObject(row, this.temp)
        this.temp = Object.assign({}, row)
        if (row.type === 3) {
          if (row.content !== '') {
            this.colsData = JSON.parse(row.content)
          } else {
            this.colsData = [{ label: '默认', prop: 'defalut', width: '150' }]
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
</style>
