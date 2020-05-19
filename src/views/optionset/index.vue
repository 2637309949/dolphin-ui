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
                  <el-form-item label="名称:" class="notice-input" label-width="60px" prop="name">
                    <el-input
                      v-model="dataQuery.name"
                      placeholder="请输入名称"
                      clearable
                      @keyup.enter.native="search"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="编码:" class="notice-input" label-width="60px" prop="code">
                    <el-input
                      v-model="dataQuery.code"
                      placeholder="请输入编码"
                      clearable
                      @keyup.enter.native="search"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" :size="size" @click="search">查询</el-button>
                    <el-button icon="el-icon-refresh" :size="size" @click="resetFields">重置</el-button>
                    <export-button :api="this.$api.sysOptionset.page" :columns="tableColumns" :data-query="dataQuery" name="optionset.xlsx" />
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
              :api="this.$api.sysOptionset.page"
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
      :title="dialogStatus==='create'?'新建':'编辑'"
      :visible.sync="dialogVisible"
      width="40%"
      @close="dialogClose"
    >
      <el-form ref="temp" :size="size" :rules="rules" :model="temp" label-width="120px">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="temp.name" :size="size" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码:" prop="code">
          <el-input v-model="temp.code" :size="size" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="temp.remark" :size="size" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item
          label="键值对:"
          label-position="right"
          label-width="120px"
          class="notice-input"
          prop="maps"
        >
          <div
            v-for="(item, index) in maps"
            :key="index"
            style="width: 100%; float: left; margin-bottom: 5px;"
            type="flex"
          >
            <div style="width: 15%; float: left">
              <el-input v-model="item.value" placeholder="value" />
            </div>
            <div style="width: 35%; float: left;">
              <el-input
                v-model="item.text"
                type="textarea"
                :rows="2"
                placeholder="text"
                clearable
                style="border-left: 0px;margin-left: 11px;"
              />
            </div>
            <div style="width: 35%; float: left;margin-left:20px">
              <el-input
                v-model="item.label"
                type="textarea"
                :rows="2"
                placeholder="请输入说明文字"
                clearable
                style="border-left: 0px;margin-left: 11px;"
              />
            </div>
            <div style="width: 5%; float: left;padding-left: 23px; ">
              <el-button
                icon="el-icon-minus"
                circle
                :size="size"
                style="padding: 5px;"
                @click="delItem(index)"
              />
            </div>
          </div>
          <div type="flex" class="row-bg repair-item" style="float: left; width: 95%; ">
            <div class="button" @click="addItem">+ 添加</div>
          </div>
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
import Sheet from '@/components/Sheet/index'
import ExportButton from '@/components/ExportButton'

export default {
  name: 'Optionset',
  components: {
    Sheet,
    ExportButton
  },
  data() {
    return {
      maps: [{ value: '', text: '' }],
      tableColumns: [
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          minWidth: 180,
          maxWidth: 220
        },
        {
          prop: 'code',
          label: '编码',
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        },
        {
          prop: 'remark',
          label: '备注',
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        }
      ],
      operates: {
        list: [
          {
            label: '编辑',
            show: true,
            type: 'primary',
            method: row => {
              this.edit(row)
            }
          },
          {
            label: '删除',
            show: true,
            type: 'danger',
            method: row => {
              this.deleteData(row)
            }
          }
        ],
        width: 150
      },
      dataQuery: {
        page: 1,
        rows: 10,
        name: '',
        code: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        value: ''
      },
      dataLoading: false,
      dialogStatus: '',
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['size', 'minMainHeight'])
  },
  watch: {
    maps(val) {
      this.temp.value = JSON.stringify(val)
    }
  },
  created() {},
  methods: {
    createData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.temp.value = JSON.stringify(this.maps)
          this.$api.system.AddOptionset(this.temp).then(res => {
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
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.temp.value = JSON.stringify(this.maps)
          this.$api.sysOptionset.update(this.temp).then(res => {
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
      })
        .then(() => {
          this.$api.system.DelOptionset([{ id: row.id }]).then(res => {
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
          this.$api.system.DelOptionset(ids).then(res => {
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
    },
    delItem(index) {
      this.maps.splice(index, 1)
    },
    addItem() {
      this.maps.push({ value: '', text: '' })
    },
    search() {
      this.$refs.qtable.getData()
    },
    resetFields() {
      this.$refs['searchForm'].resetFields()
      this.$refs.qtable.getData()
    },
    dialogClose() {
      this.$refs['temp'].resetFields()
      this.maps = [{ value: '', text: '' }]
    },
    create() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    edit(row) {
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
        this.temp = Object.assign({}, row)
        this.maps = JSON.parse(this.temp.value)
      })
    }
  }
}
</script>

<style>
.repair-item .oprate {
  color: #409eff;
}
.repair-item .button {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 2px dotted #eee;
  background-color: white;
}
</style>
