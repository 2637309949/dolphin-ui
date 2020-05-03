<template>
  <el-select v-model="valueTurn" :multiple="multiple" :placeholder="placeholder">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.text"
      :value="item.value"
    />
  </el-select>
</template>
<script>
export default {
  name: 'OptionSet',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, Array],
      default: () => ['', 0, []]
    },
    multiple: {
      type: Boolean,
      default: () => false
    }
  },
  data: function() {
    return {
      selectValue: '',
      options: []
    }
  },
  computed: {
    // valueTurn() {
    //   get: () => {
    // typeof this.value === 'string' ? return this.value : return this.value.toString()
    //     if (typeof this.value === 'string') {
    //       return this.value
    //     } else {
    //       return this.value.toString()
    //     }
    //   }
    // }
    valueTurn: {
      get: function() {
        if (typeof this.value === 'string') {
          return this.value
        } else if (typeof this.value === 'number') {
          return this.value.toString()
        } else if (typeof this.value === 'object') {
          return this.value
        }
        return this.value
      },
      set: function(newValue) {
        if (typeof this.value === 'string') {
          // this.value = newValue
          this.$emit('update:value', newValue)
        } else if (typeof this.value === 'number') {
          // this.value = parseInt(newValue)
          this.$emit('update:value', parseInt(newValue))
        } else if (typeof this.value === 'object') {
          this.$emit('update:value', newValue)
        }
      }
    }
  },
  watch: {
    // 'value': function(newVal, oldVal) {
    //   debugger
    //   typeof newVal === 'string' ? this.selectValue = newVal : this.selectValue = newVal.toString()
    // },
    // 'selectValue': function(newVal, oldVal) {
    //   debugger
    //   typeof this.value === 'string' ? this.$emit('update:value', newVal) : this.$emit('update:value', parseInt(newVal))
    // }
  },
  created() {
    this.multiple
    this.getOptions()
  },
  methods: {
    async getOptions() {
      this.options = await this.$store.dispatch('optionset/formatterData', this.code)
    }
  }
}
</script>
<style>
</style>
