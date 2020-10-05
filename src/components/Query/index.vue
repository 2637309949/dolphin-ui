<template>
  <el-container>
    <el-header height="82">
      <el-form ref="form" :form="form" :size="size" label-suffix=":" @submit.native.prevent>
        <el-row :gutter="10">
          <el-col v-for="item in formConfigs.formConfigA" :key="item.name" :span="item.span || 18">
            <el-form-item :rules="item.rules" :label="item.label" :prop="item.name" :label-width="item.label ? '100px' : ''">
              <el-input
                v-if="item.type === 'input' || item.type === ''"
                v-model="form[item.name]"
                :style="item.style"
                :disabled="item.disabled"
                clearable
                :prefix-icon="item.prefixIcon"
                :suffix-icon="item.suffixIcon"
                :show-word-limit="item.showWordLimit"
                :type="item.inputType"
                :rows="item.rows"
                :autosize="item.autosize"
                :placeholder="`${$t('common.pleaseInput')} ${item.placeholder}`"
                @keyup.enter.native="onSubmit"
              />
              <qselect
                v-else-if="item.type === 'select'"
                :placeholder="`${$t('common.pleaseChoice')} ${item.placeholder}`"
                :code="item.code"
                :remote-api="item.remoteApi"
                :filters="item.filters"
                :value.sync="form[item.name]"
                :option-field="item.remoteApi?{ keyField: 'id', labelField: 'name', valueField: 'id' }:{ keyField: 'value', labelField: 'text', valueField: 'value' }"
                :remote="!!item.remote"
                :search-filed="item.searchFiled"
                :remote-data-query="item.remoteDataQuery"
              />
              <qcascader
                v-else-if="item.type === 'cascader'"
                :api="item.api"
                :data-query="item.dataquery"
                :multiple="item.multiple"
                :check-strictly="item.checkStrictly"
                :value.sync="form[item.name]"
              />
              <el-date-picker
                v-else-if="item.type === 'date'"
                v-model="form[item.name]"
                :type="item.dateType"
                :style="item.style"
                :align="item.align"
                range-separator="至"
                :start-placeholder="item.startPlaceholder"
                :end-placeholder="item.endPlaceholder"
                :disabled="item.disabled"
                :unlink-panels="item.unlinkPanels || true"
                :value-format="item.valueFormat"
                :default-value="item.defaultValue"
                :default-time="item.defaultTime"
                :placeholder="`${$t('common.pleaseChoice')} ${item.placeholder}`"
                :picker-options="item.pickerOptions"
              />
              <el-time-select
                v-else-if="item.type === 'time'"
                v-model="form[item.name]"
                :style="item.style"
                :disabled="item.disabled"
                :picker-options="item.pickerOptions?item.pickerOptions:{ start: '08:00', step: '00:05', end: '22:00' }"
                :placeholder="`${$t('common.pleaseChoice')} ${item.placeholder}`"
              />
              <div v-else-if="item.type === 'minmax'" class="minmax-box">
                <el-input-number
                  v-model="form[item.name][0]"
                  :step="item.step || 1"
                  :min="item.min || 0"
                  :controls="false"
                  class="minmax-input"
                  :precision="item.precision"
                  :disabled="item.disabled"
                  :placeholder="`${$t('common.pleaseInput')} ${item.minPlaceholder}`"
                />
                <div class="division-line">-</div>
                <el-input-number
                  v-model="form[item.name][1]"
                  :step="item.step || 1"
                  :min="item.min || 0"
                  class="minmax-input"
                  :controls="false"
                  :precision="item.precision"
                  :disabled="item.disabled"
                  :placeholder="`${$t('common.pleaseInput')} ${item.maxPlaceholder}`"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :offset="selfAdaption" :span="6" style="text-align: right;">
            <el-button v-if="folding" :size="size" @click="show = !show">
              {{ show ? "折叠" : "展开" }}
            </el-button>
            <el-button type="primary" :size="size" icon="el-icon-search" @click.prevent="onSubmit">{{ $t('common.search') }}</el-button>
            <el-button :size="size" icon="el-icon-brush" @click="resetForm()">{{ $t('common.reset') }}</el-button>
            <!-- <el-button :loading="isExporting" type="primary" :size="size" @click="onExport">{{ $t('common.export') }}</el-button> -->
          </el-col>
        </el-row>
        <transition name="el-zoom-in-top">
          <el-row v-show="show" :gutter="10">
            <el-col v-for="item in formConfigs.formConfigB" :key="item.name" :span="item.span || 24">
              <el-form-item :rules="item.rules" :label="item.label" :prop="item.name" :label-width="item.label ? '100px' : ''">
                <el-input
                  v-if="(item.type || input) === 'input'"
                  v-model="form[item.name]"
                  :style="item.style"
                  :disabled="item.disabled"
                  :prefix-icon="item.prefixIcon"
                  :suffix-icon="item.suffixIcon"
                  :show-word-limit="item.showWordLimit"
                  :type="item.inputType"
                  :rows="item.rows"
                  :autosize="item.autosize"
                  :placeholder="`${$t('common.pleaseInput')} ${item.placeholder}`"
                  clearable
                  @keyup.enter.native="onSubmit"
                />
                <option-set
                  v-else-if="item.type === 'select'"
                  :placeholder="`${$t('common.pleaseChoice')} ${item.placeholder}`"
                  :code="item.code"
                  :remote-api="item.remoteApi"
                  :filters="item.filters"
                  :value.sync="form[item.name]"
                  :option-field="item.remoteApi?{ keyField: 'id', labelField: 'name', valueField: 'id' }:{ keyField: 'value', labelField: 'text', valueField: 'value' }"
                  :remote="!!item.remote"
                  :search-filed="item.searchFiled"
                  :remote-data-query="item.remoteDataQuery"
                />
                <cascader
                  v-else-if="item.type === 'cascader'"
                  :api="item.api"
                  :data-query="item.dataquery"
                  :multiple="item.multiple"
                  :check-strictly="item.checkStrictly"
                  :value.sync="form[item.name]"
                />
                <el-date-picker
                  v-else-if="item.type === 'date'"
                  v-model="form[item.name]"
                  :type="item.dateType"
                  :style="item.style"
                  range-separator="至"
                  :start-placeholder="item.startPlaceholder"
                  :end-placeholder="item.endPlaceholder"
                  :disabled="item.disabled"
                  :unlink-panels="item.unlinkPanels || true"
                  :value-format="item.valueFormat"
                  :default-value="item.defaultValue"
                  :default-time="item.defaultTime"
                  :placeholder="`${$t('common.pleaseChoice')} ${item.placeholder}`"
                />
                <el-time-select
                  v-else-if="item.type === 'time'"
                  v-model="form[item.name]"
                  :style="item.style"
                  :disabled="item.disabled"
                  :picker-options="item.pickerOptions?item.pickerOptions:{ start: '08:00', step: '00:05', end: '22:00' }"
                  :placeholder="`${$t('common.pleaseChoice')} ${item.placeholder}`"
                />
                <div v-else-if="item.type === 'minmax'" class="minmax-box">
                  <el-input-number
                    v-model="form[item.name][0]"
                    :step="item.step || 1"
                    :min="item.min || ''"
                    :controls="false"
                    class="minmax-input"
                    :precision="item.precision"
                    :disabled="item.disabled"
                    :placeholder="`${$t('common.pleaseInput')} ${item.minPlaceholder}`"
                  />
                  <div class="division-line">-</div>
                  <el-input-number
                    v-model="form[item.name][1]"
                    :step="item.step || 1"
                    :min="item.min || ''"
                    class="minmax-input"
                    :controls="false"
                    :precision="item.precision"
                    :disabled="item.disabled"
                    :placeholder="`${$t('common.pleaseInput')} ${item.maxPlaceholder}`"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </transition>
      </el-form>
    </el-header>
    <el-header height="120">
      <el-row :gutter="1" type="flex" justify="space-between">
        <el-col :offset="12" :span="20" style="text-align: right;">
          <el-button type="primary" :size="size" icon="el-icon-plus" @click="onCreate">添加</el-button>
          <el-button type="danger" :size="size" icon="el-icon-delete" @click="onDeleteBatch">批量删除</el-button>
          <el-button type="primary" :size="size" icon="el-icon-download" @click="onExport">{{ $t('common.export') }}</el-button>
        </el-col>
      </el-row>
    </el-header>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import OptionSet from '@/components/OptionSet/index'
import Cascader from '@/components/Cascader/index'

export default {
  name: 'Query',
  components: {
    OptionSet,
    Cascader
  },
  props: {
    formConfig: {
      type: [Array, Object],
      default: () => {
        return {
          export: {
            size: 1000
          },
          items: []
        }
      }
    }
    // folding: {
    //   type: Boolean,
    //   default: () => true
    // }
    // form: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // }
  },
  data() {
    return {
      isExporting: false,
      show: false,
      form: {},
      folding: false
    }
  },
  computed: {
    ...mapGetters(['size', 'minMainHeight']),
    selfAdaption() {
      var totalSpan = 0
      this.formConfigs.formConfigA.forEach(item => {
        totalSpan += item.span === undefined ? 18 : item.span
      })
      return totalSpan > 18 ? 0 : 18 - totalSpan
    },
    formConfigs() {
      const returnVal = {
        formConfigA: [],
        formConfigB: []
      }
      let count = 6
      for (const v of this.formConfig.items) {
        count += v.span
        if (count <= 24) {
          returnVal.formConfigA.push(v)
        } else {
          returnVal.formConfigB.push(v)
        }
      }
      returnVal.export = this.formConfig.export
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.folding = !(count <= 24)
      return returnVal
    }
  },
  created() {
    this.resetForm('created')
  },
  methods: {
    isEmpty(val) {
      if (!val && val !== 0 && val !== '') {
        return ''
      }
      if (Array.prototype.isPrototypeOf(val) && val.length === 0) {
        return []
      }
      if (Object.prototype.isPrototypeOf(val) && Object.keys(val).length === 0) {
        return {}
      }
      return val
    },
    onSubmit() {
      for (var k in this.form) {
        this.form[k] = this.isEmpty(this.form[k])
      }
      // eslint-disable-next-line no-redeclare
      for (var k in this.form) {
        if (Array.isArray(this.form[k])) {
          for (var i = this.form[k].length - 1; i >= 0; i--) {
            if (this.form[k][i] === undefined) {
              this.form[k].splice(i, 1)
            }
          }
        }
      }
      this.$emit('onSubmit', this.form)
    },
    onCreate() {
      this.$emit('onCreate')
    },
    onDeleteBatch() {
      this.$emit('onDeleteBatch')
    },
    deepCopy(data) {
      if (typeof data !== 'object') {
        return data
      }
      if (Array.isArray(data)) {
        return data.map(this.deepCopy)
      }
      const copyData = {}
      for (const [key, value] of Object.entries(data)) {
        copyData[key] = this.deepCopy(value)
      }
      return copyData
    },
    onExport() {
      for (var k in this.form) {
        this.form[k] = this.isEmpty(this.form[k])
      }
      // eslint-disable-next-line no-redeclare
      for (var k in this.form) {
        if (Array.isArray(this.form[k])) {
          for (var i = this.form[k].length - 1; i >= 0; i--) {
            if (this.form[k][i] === undefined) {
              this.form[k].splice(i, 1)
            }
          }
        }
      }
      const form = this.deepCopy(this.form)
      form.page = 1
      form.rows = this.formConfig.export.rows
      form.__export__ = true
      form.__name__ = this.formConfig.export.name
      this.$emit('onSubmit', form)
    },
    resetForm(val) {
      this.formCopy = {}
      for (const v of this.formConfig.items) {
        this.formCopy[v.name] = v.value === null ? '' : v.value || ''
      }
      this.form = JSON.parse(JSON.stringify(this.formCopy))
      if (val === 'created') return
      this.$emit('onSubmit', this.form)
    },
    handleClick(row) {
      console.log(row)
    }
  }
}
</script>
<style scoped lang="scss">
.minmax-box {
  display: flex;
  .minmax-input {
    width: calc((100% - 6px) / 2);
  }

  .division-line {
    padding: 0 2px;
    width: 6px;
    display: flex;
    justify-content: center;
  }
}
.el-date-editor.el-input,
.el-range-editor.el-input__inner,
.el-select {
  width: 100%;
}
</style>
