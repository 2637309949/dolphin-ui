<template>
  <el-container>
    <el-main class="page-main">
      <el-card>
        <el-container>
          <el-header height="120">
            <el-form ref="searchForm" :model="dataQuery" :size="size" label-position="left" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="名称:" class="notice-input" label-width="60px" prop="name">
                    <el-input v-model="dataQuery.name" placeholder="请输入名称" clearable @keyup.enter.native="search" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="编码:" class="notice-input" label-width="60px" prop="code">
                    <el-input v-model="dataQuery.code" placeholder="请输入编码" clearable @keyup.enter.native="search" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" :size="size" @click="search">{{ $t('common.search') }}</el-button>
                    <el-button icon="el-icon-refresh" :size="size" @click="resetFields">{{ $t('common.reset') }}</el-button>
                    <export-button :api="this.$api.sysTracker.page" :columns="tableColumns" :data-query="dataQuery" name="tracker.xlsx" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-header>
          <el-main>
            <sheet ref="qtable" :api="this.$api.sysTracker.page" :columns="tableColumns" :data-query="dataQuery" :operates="operates" :float-type="'right'" :select-type="'selection'" />
          </el-main>
        </el-container>
      </el-card>
    </el-main>

    <el-dialog title="详情" :visible.sync="dialogVisible" width="70%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="ip地址:" class="notice-input" label-width="80px">
          <el-input v-model="temp.client_ip" />
        </el-form-item>
        <el-form-item label="请求头:" class="notice-input" label-width="80px">
          <el-input v-model="temp.header" type="textarea" :autosize="{minRows:4}" />
        </el-form-item>
        <el-form-item label="请求地址:" class="notice-input" label-width="80px">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="请求内容:" class="notice-input" label-width="80px">
          <el-input v-model="temp.req_body" />
        </el-form-item>
        <el-form-item label="返回内容:" class="notice-input" label-width="80px">
          <el-input v-model="temp.res_body" type="textarea" :autosize="{minRows:4}" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Sheet from '@/components/Sheet/index'
import ExportButton from '@/components/ExportButton'

export default {
  name: 'Tracker',
  components: {
    Sheet,
    ExportButton
  },
  data() {
    return {
      maps: [{ value: '', text: '' }],
      tableColumns: [
        {
          prop: 'user_name',
          label: 'User',
          align: 'center',
          minWidth: 150,
          maxWidth: 220
        },
        {
          prop: 'method',
          label: 'Method',
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        },
        {
          prop: 'create_time',
          label: 'ReqTime',
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        },
        {
          prop: 'path',
          label: 'ReqPath',
          align: 'center',
          minWidth: 180,
          maxWidth: 180,
          formatter: (row, column) => {
            return row.path.split('?')[0]
          }
        },
        {
          prop: 'status_code',
          label: 'Status',
          align: 'center',
          minWidth: 150,
          maxWidth: 180
        }
      ],
      operates: {
        list: [
          {
            label: '详情',
            show: true,
            type: 'primary',
            method: row => {
              this.detail(row)
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
        user_name: '',
        status_code: '',
        latency: '',
        client_ip: '',
        method: '',
        path: '',
        create_time: '',
        header: '',
        req_body: '',
        res_body: ''
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
    detail(row) {
      this.temp = Object.assign({}, row)
      this.$api.sysTracker.get({ id: row.id }).then(res => {
        const { data: { header, res_body, req_body }} = res
        this.temp.header = header && atob(header)
        this.temp.res_body = res_body && atob(res_body)
        this.temp.req_body = req_body && atob(req_body)
        this.dialogVisible = true
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
