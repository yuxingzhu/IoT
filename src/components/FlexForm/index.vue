/*
Created by: Lu 19/08/28
params:
  - formName:         String  表单ref名称
  - inline:           Boolean 是否一行内放置表单
  - dynamicFormModel: Object  表单数据对象
  - labelWidth:       String  表单域标签的宽
*/

<template>
  <el-form :ref="formName" :slice="slice" :inline="inline" :model="dynamicFormModel" size="mini" :label-width="labelWidth" @submit.native.prevent>
    <el-form-item v-for="formItem in formData" :key="formItem.name" :style="{width:formItemWidth}" :label="formItem.label" :prop="formItem.name" :rules="rules[formItem.name]">
      <el-input
        v-if="formItem.type == 'input'"
        v-model.trim="dynamicFormModel[formItem.name]"
        :style="{width:formItemContentWidth}"
        :prefix-icon="formItem.prefixIcon"
        :suffix-icon="formItem.suffixIcon"
        :placeholder="formItem.placeholder"
      />
      <el-input
        v-if="formItem.type == 'textarea'"
        v-model.trim="dynamicFormModel[formItem.name]"
        type="textarea"
        size="medium"
        :style="{width:formItemContentWidth}"
        :prefix-icon="formItem.prefixIcon"
        :suffix-icon="formItem.suffixIcon"
        :placeholder="formItem.placeholder"
      />
      <el-select
        v-if="formItem.type == 'select'"
        v-model.trim="dynamicFormModel[formItem.name]"
        :placeholder="formItem.placeholder"
        :style="{width:formItemContentWidth}"
        @change="change"
      >
        <el-option v-for="selectItem in formItem.options" :key="selectItem.label" :label="selectItem.label" :value="selectItem.value" />
      </el-select>

      <el-autocomplete
        v-if="formItem.type == 'remote'"
        v-model.trim="dynamicFormModel[formItem.name]"
        :fetch-suggestions="formItem.remoteSearch"
        :style="{width:formItemContentWidth}"
        :placeholder="formItem.placeholder"
      />

      <el-date-picker
        v-if="formItem.type == 'dateTimePicker'"
        v-model.trim="dynamicFormModel[formItem.name]"
        :style="{width:formItemContentWidth}"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :placeholder="formItem.placeholder"
      />

    </el-form-item>
    <slot name="eventFormItem" />
    <slot name="formButton" />
  </el-form>
</template>
<script>
const _ = require('lodash')
export default {
  name: 'FlexForm',
  props: {
    slice: {
      type: Number,
      default: 0
    },
    inline: {
      type: Boolean,
      require: false,
      default: false
    },
    formName: {
      type: String,
      default: 'dynamicForm'
    },
    labelWidth: {
      type: String,
      require: false,
      default: '100px'
    },
    formData: {
      type: Array,
      default: () => {
        return []
      }
    },
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dynamicFormModel: {
      type: Object,
      default: () => {
        return {}
      }
    },
    change: {
      type: Function,
      required: false,
      default: (selValue) => {
      }
    }
  },
  data: function() {
    return {
      formItemContentWidth: '100%',
      formItemWidth: '100%'
    }
  },
  mounted: function() {
    this.initFormItemContentWidth()
  },
  methods: {
    initFormItemContentWidth() {
      let width = '100%'
      let formWidth = '100%'
      this.$nextTick(() => {
        if (this.inline && this.slice === 0) {
          this.formItemWidth = 'auto'
          this.formItemContentWidth = 'auto'
        } else {
          formWidth = ((this.$refs[this.formName].$el.clientWidth) - (10 * this.slice)) / this.slice - 20
          width = formWidth - _.parseInt(this.labelWidth)
          this.formItemWidth = formWidth + 'px'
          this.formItemContentWidth = width + 'px'
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
