<el-form-item v-for="formItem in formData" :key="formItem.name" :style="{width:formItemWidth}" :label="formItem.label" :prop="formItem.name" :rules="rules">
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
    type="textarea"
    v-model.trim="dynamicFormModel[formItem.name]"
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
    :placeholder="formItem.placeholder"
  />

</el-form-item>

<script>
export default {
  name: 'FormItem',
  props: {
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formItemContentWidth: {
      type: String,
      required: false,
      default: '100%'
    },
    formItemWidth: {
      type: String,
      required: false,
      default: '100%'
    },
    formItem: {
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
    }
  }
}
</script>

<style scoped>

</style>
