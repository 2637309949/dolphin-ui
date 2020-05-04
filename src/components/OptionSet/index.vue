<template>
  <el-select v-model="valueTurn" :multiple="multiple" :placeholder="placeholder">
    <el-option v-for="item in options" :key="item.value" :label="item.text" :value="item.value" />
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
    valueTurn: {
      get: function() {
        return this.value
      },
      set: function(newValue) {
        this.$emit('update:value', newValue)
      }
    }
  },
  created() {
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
