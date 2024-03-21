<template>
  <div class="operation">
    <el-row>
      <el-col :span="1">
        <slot name="create" />
      </el-col>
      <el-col :span="15" class="table-filter">
        <slot name="filter" />
      </el-col>
      <el-col :span="8" class="table-operating">
        <slot name="operating" />
      </el-col>
    </el-row>
    <div class="operation-dialog">
      <el-dialog :visible.sync="isAddedShow" title="提示">
        <FlexForm :form-data="form" :dynamic-form-model="dynamicFormModel" :rules="dynamicFormRules" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="isAddedShow = false">取 消</el-button>
          <el-button type="primary" @click="isAddedShow = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FlexForm from '@/components/FlexForm/index'
const _ = require('lodash')
export default {
  name: 'Operation',
  components: { FlexForm },
  data() {
    return {
      form: [{
        type: 'input',
        label: '活动活动名称',
        name: 'deviceName',
        value: ''
      }],
      dynamicFormModel: {},
      dynamicFormRules: {
        deviceName: { required: true, message: '请选择活动区域', trigger: 'change' }
      },
      isAddedShow: false
    }
  },
  created: function() {
    this.initModel()
  },
  methods: {
    showAddDialog: function() {
      console.info('showAddDialog')
      this.isAddedShow = true
    },
    initModel: function(_formData) {
      const _this = this
      const modelData = {}
      _.forEach(_formData, function(value) {
        modelData[value.name] = value.value
      })
      _this.dynamicFormModel = modelData
    }
  }
}
</script>

<style scoped>

</style>
