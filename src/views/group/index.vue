<template>
  <div class="app-container">
    <Operation>
      <template #create>
        <el-tooltip  class="item" effect="dark" content="新增" placement="bottom">
          <el-button icon="el-icon-plus" @click="handleCreate"/>
        </el-tooltip>
      </template>
      <template #filter>
        <FlexForm ref="filterInfo" label-width="0" :inline="true" form-name="filterForm" :form-data="filterForm.formData" :dynamic-form-model="filterForm.dynamicFormModel" :rules="filterForm.rules">
          <template #formButton>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="重置" placement="bottom">
                <el-button icon="el-icon-refresh" @click="resetForm('filterInfo','filterForm')" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="搜索" placement="bottom">
                <el-button icon="el-icon-search" @click="initList" />
              </el-tooltip>
            </el-form-item>
          </template>
        </FlexForm>
      </template>
    </Operation>
    <OperateTable :table-data="tableData" :column-data="columnData" >
      <template #configButton="slotProp">
        <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
          <el-button icon="el-icon-edit" @click="handleUpdate(slotProp.row)" class="elbuttondefault"/>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
          <el-button icon="el-icon-delete" @click="handleDelete(slotProp.row)" class="elbuttondefault"/>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="网关分组" placement="bottom">
          <el-button icon="el-icon-setting" @click="handleSet(slotProp.row)" class="elbuttondefault"/>
        </el-tooltip>
      </template>
    </OperateTable>
    <Pagination v-show="totalRowCount>0" :total="totalRowCount" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="initList" />
    <div class="dialog">
      <el-dialog :title="dataTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" @closed="resetForm('dataInfo', 'dataForm')">
        <FlexForm ref="dataInfo" form-name="dataForm" :form-data="dataForm.formData" :dynamic-form-model="dataForm.dynamicFormModel" :rules="dataForm.rules" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('dataInfo', 'dataForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" :visible.sync="allotDeviceVisiable" class="el-dialog-form el-dialog-center" :modal="false" width="540px" @close="closeFieldViewConfigDialog">
        <span slot="title" class="el-dialog__title"><i class="el-icon-fa-th-large" />网关分组</span>
        <div>
          <el-transfer v-model.trim="checkDevices" class="allotDeviceTransfer" filterable :data="allotDevices" :titles="['待分配', '已分配']" @change="allotDeviceChange" />
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeAllotDeviceDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" @click="sumbitAllotDevice">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Operation from '@/components/Operation/index'
import FlexForm from '@/components/FlexForm/index'
import OperateTable from '@/components/FlexTable/OperateTable/index'
import Pagination from '@/components/Pagination/index'

import { setModel } from '@/utils/form'
import {
  fetchList,
  create,
  deleteId,
  fetchDevices,
  createAllotList
} from '@/api/group'

const _ = require('lodash')

export default {
  name: 'Group',
  components: { OperateTable, FlexForm, Operation, Pagination },
  data() {
    return {
      title: '网关组',
      groupId: '',
      dialogVisible: false,
      allotDeviceVisiable: false,
      allotTotalCount: 0,
      allotDevices: [],
      checkDevices: [],
      totalRowCount: 0,
      dataTitle: '',
      query: {
        currentPage: 1,
        pageSize: 10,
        orderby: 'updateTime',
        order: 'DESC'
      },
      filterForm: {
        formData: [
          {
            type: 'input',
            name: 'groupName',
            placeholder: '网关组名称',
            value: ''
          }
        ],
        dynamicFormModel: {},
        rules: {}
      },
      dataForm: {
        formData: [
          {
            type: 'input',
            name: 'groupName',
            label: '网关组名称',
            value: ''
          },
          {
            type: 'input',
            name: 'deviceDesc',
            label: '网关组描述',
            value: ''
          }
        ],
        dynamicFormModel: {},
        rules: {
          groupName: {
            required: true,
            message: '请输入网关组名称!'
          }
        }
      },
      columnData: [
        {
          label: '网关组名称',
          name: 'groupName'
        },
        {
          label: '网关组描述',
          name: 'deviceDesc'
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  mounted: function () {
    this.initFormModel()
    this.initList()
  },
  methods: {
    closeFieldViewConfigDialog: function () {
      this.viewConfigDialogVisible = false
    },
    allotDeviceChange: function (oldValue, orient, newValue) {
      const _this = this
      if (orient === 'right') {
        const temp = []
        _.each(this.allotDeviceLeft, (device) => {
          _.each(newValue, (key) => {
            if (device.key === key) {
              temp.push(device)
            }
          })
        })
      }
      _this.checkPageSize = _this.checkDevices.length
    },
    initFormData: function (formName, formData) {
      const _this = this
      this.$nextTick(function () {
        _.forIn(this[formName].dynamicFormModel, function (formItem, key) {
          _this[formName].dynamicFormModel[key] = formData[key]
        })
      })
    },
    initFormModel: function () {
      setModel(this, 'filterForm')
      setModel(this, 'dataForm')
    },
    initList: function () {
      const params = Object.assign(
        {},
        this.query,
        this.filterForm.dynamicFormModel
      )
      fetchList(params).then((response) => {
        // console.log(response,"4544")
        const result = response.data
        if (result !== undefined) {
          this.tableData = result
          this.totalRowCount = response.totalRowCount
        }
      })
    },
    handleSubmit: function (refName, formName) {
      this.$refs[refName].$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign(
            { groupId: this.groupId },
            this.dataForm.dynamicFormModel
          )
          create(data).then((response) => {
            this.dialogVisible = false
            this.$notify({
              message: '保存成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.initList()
          })
        }
      })
    },
    handleCreate: function () {
      this.dataTitle = '新增' + this.title
      this.groupId = ''
      this.dialogVisible = true
    },
    handleUpdate: function (row) {
      this.dataTitle = '修改' + this.title
      this.groupId = row.groupId
      this.dialogVisible = true
      this.initFormData('dataForm', row)
    },
    handleDelete: function (row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteId(row.groupId).then((response) => {
            this.$notify({
              message: '删除成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.initList()
          })
        })
        .catch(() => {
          this.$notify({
            type: 'success',
            message: '已取消删除'
          })
        })
    },
    handleSet: function (row) {
      this.allotDeviceVisiable = true
      this.groupId = row.groupId
      this.checkDevices = []
      fetchDevices(row.groupId).then((response) => {
        const result = response.data
        if (response.success) {
          this.allotDevices = result
          this.allotTotalCount = response.totalCount
          this.checkDevices = response.checkData
        } else {
          this.allotDevices = []
          this.allotTotalCount = 0
        }
      })
    },
    closeAllotDeviceDialog: function () {
      this.allotDeviceVisiable = false
    },
    sumbitAllotDevice: function () {
      const formData = new FormData()
      formData.append('egdeDeviceIds', this.checkDevices)
      formData.append('groupId', this.groupId)
      createAllotList(formData).then((response) => {
        if (response.success) {
          this.closeAllotDeviceDialog()
          this.$notify({
            message: '保存成功!',
            type: 'success',
            duration: this.$store.state.settings.duration
          })
        }
      })
    },
    resetForm: function (refName, formName) {
      this.$refs[refName].$refs[formName].resetFields()
      setModel(this, formName)
    }
  }
}
</script>

<style  lang="scss" scoped>
/deep/ .el-checkbox-group.el-transfer-panel__list.is-filterable {
  overflow-y: scroll !important;
  overflow-x: clip !important;
}
</style>

