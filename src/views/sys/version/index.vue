<template>
  <div class="app-container">
    <Operation>
      <template  #create>
        <el-tooltip class="item" effect="dark" content="新增" placement="bottom">
          <el-button icon="el-icon-plus" @click="handleCreate" />
        </el-tooltip>
      </template>
      <template #filter>
        <FlexForm ref="filterInfo" label-width="0" :inline="true" form-name="filterForm" :form-data="filterForm.formData" :dynamic-form-model="filterForm.dynamicFormModel" :rules="filterForm.rules">
          <template #formButton>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="重置" placement="bottom">
                <el-button icon="el-icon-refresh" @click="filterForm.dynamicFormModel.versionName=''" />
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
          <el-button icon="el-icon-edit" @click="handleUpdate(slotProp.row)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="下载" placement="bottom">
          <el-button icon="el-icon-download" @click="handleDowloadFile(slotProp.row)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="网关升级" placement="bottom">
          <el-button icon="el-icon-connection" @click="openSendDialog(slotProp.row)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
          <el-button icon="el-icon-delete" @click="handleDelete(slotProp.row)" />
        </el-tooltip>
      </template>
    </OperateTable>
    <Pagination :total="totalRowCount" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="initList" />
    <div class="dialog">
      <el-dialog :close-on-click-modal="false" :title="dataTitle" :visible.sync="dialogVisible" @closed="resetForm('dataInfo', 'dataForm')">
        <FlexForm ref="dataInfo" form-name="dataForm" :form-data="dataForm.formData" :dynamic-form-model="dataForm.dynamicFormModel" :rules="dataForm.rules">
          <template #eventFormItem>
            <el-form-item label="文件上传">
              <el-upload ref="uploadFile" action="/api/versionManage/uploadFile" :on-change="previewFile" :multiple="false" :limit="1" :file-list="file" :auto-upload="false" :on-success="fileUploadSuccess">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">(上传文件大小不能超过5M，格式为yml文件)</div>
              </el-upload>
            </el-form-item>
          </template>
        </FlexForm>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('dataInfo', 'dataForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <el-dialog :title="dataTitle" :visible.sync="sendConfigDialogVisible" :close-on-click-modal="false" style="width:150%;margin-left: -19%;" @close="closeSendConfigDialog">
      <div>
        <template>
          <el-table ref="multipleTable" :data="edgeDeviceList" style="width: 100%;" size="mini" @selection-change="selectionChange">
            <el-table-column type="selection" width="100" />
            <el-table-column prop="edgeDeviceName" label="网关名称" />
            <el-table-column prop="ipAddress" label="IP地址" width="180" show-overflow-tooltip />
            <el-table-column prop="mac" label="MAC地址" show-overflow-tooltip />
          </el-table>
        </template>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeSendConfigDialog">关 闭</el-button>
        <el-button type="primary" icon="fa-save" @click="sendToEdgeDevice">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Operation from '@/components/Operation/index'
import FlexForm from '@/components/FlexForm/index'
import OperateTable from '@/components/FlexTable/OperateTable/index'
import Pagination from '@/components/Pagination/index'

import { setModel } from '@/utils/form'
import {
  fetchList,
  create,
  update,
  deleteId,
  loadAllEdgeDevice,
  sendToEdgeDevice
} from '@/api/sys/version'
import { mapGetters } from 'vuex'

const _ = require('lodash')
const YAML = require('yamljs')

export default {
  name: 'Mac',
  components: { OperateTable, FlexForm, Operation, Pagination },
  data() {
    return {
      id: '',
      fileName: '',
      isUpdate: false,
      dataTitle: '',
      dialogVisible: false,
      fileVisible: false,
      totalRowCount: 10,
      errorTableData: [],
      file: [],
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
            name: 'versionName',
            placeholder: '版本名称',
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
            name: 'versionName',
            label: '版本名称',
            value: ''
          },
          {
            type: 'input',
            name: 'versionDesc',
            label: '版本描述',
            value: ''
          }
        ],
        dynamicFormModel: {},
        rules: {
          versionName: {
            required: true,
            message: '请输入版本名称!'
          },
          versionDesc: {
            required: true,
            message: '请输入版本描述!'
          }
        }
      },
      columnData: [
        {
          label: '版本名称',
          name: 'versionName'
        },
        {
          label: '版本描述',
          name: 'versionDesc'
        },
        {
          label: '文件名称',
          name: 'fileName'
        },
        {
          label: '修改时间',
          name: 'updateTime'
        }
      ],
      tableData: [],
      value: '',
      length: '',
      sendConfigDialogVisible: false,
      edgeDeviceList: {},
      multipleSelection: [],
      selection: [],
      sendParms: {
        macAddress: [],
        fileName: '',
        versionName: '',
        versionId: ''
      }
    }
  },
  mounted: function() {
    this.initFormModel()
    this.initList()
    this.loadAllEdgeDevice()
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  methods: {
    previewFile: function(file) {
      const _this = this
      if (file.size / 1024 / 1024 > 5) {
        this.$notify({
          message: '版本文件大小必须小于5M!',
          type: 'error',
          duration: this.$store.state.settings.duration
        })
        this.$refs.uploadFile.clearFiles()
        return false
      }

      const reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = () => {
        try {
          const ymlObject = YAML.parse(reader.result)
          if (JSON.parse(JSON.stringify(ymlObject)).version === undefined) {
            _this.$notify({
              message: '版本文件校验不通过!',
              type: 'error',
              duration: this.$store.state.settings.duration
            })
            this.$refs.uploadFile.clearFiles()
            return false
          }
        } catch (e) {
          _this.$notify({
            message: '版本文件校验不通过!',
            type: 'error',
            duration: this.$store.state.settings.duration
          })
          this.$refs.uploadFile.clearFiles()
          return false
        }
      }
    },
    closeFileDialog: function() {
      this.fileVisible = false
      this.initList()
    },
    initFormData: function(formName, formData) {
      const _this = this
      this.$nextTick(function() {
        _.forIn(this[formName].dynamicFormModel, function(formItem, key) {
          _this[formName].dynamicFormModel[key] = formData[key]
        })
      })
    },
    initFormModel: function() {
      setModel(this, 'filterForm')
      setModel(this, 'dataForm')
    },
    initList: function() {
      const params = Object.assign(
        {},
        this.query,
        this.filterForm.dynamicFormModel
      )
      fetchList(params).then((response) => {
        const result = response.data
        this.tableData = result
        this.totalRowCount = response.totalRowCount
      })
    },
    handleSubmit: function(refName, formName) {
      if (!this.isUpdate) {
        this.createVersion(refName, formName)
      } else {
        this.updateVersion(refName, formName)
      }
    },
    createVersion: function(refName, formName) {
      if (this.$refs.uploadFile.uploadFiles[0] !== undefined) {
        this.fileName = this.$refs.uploadFile.uploadFiles[0].name
        if (
          !_.endsWith(this.fileName, '.yml') &&
          !_.endsWith(this.fileName, '.yaml')
        ) {
          this.$notify({
            message: '版本文件必须为yml文件!',
            type: 'error',
            duration: this.$store.state.settings.duration
          })
          return false
        }
      } else {
        this.$notify({
          message: '请上传版本文件!',
          type: 'error',
          duration: this.$store.state.settings.duration
        })
        return false
      }

      this.$refs[refName].$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign(
            { versionId: this.id, fileName: this.fileName },
            this.dataForm.dynamicFormModel
          )
          create(data).then((response) => {
            this.$refs.uploadFile.submit()
            this.dialogVisible = false
          })
        }
      })
    },
    updateVersion: function(refName, formName) {
      let isUploadFile = true
      if (this.$refs.uploadFile.uploadFiles[0] !== undefined) {
        this.fileName = this.$refs.uploadFile.uploadFiles[0].name
        if (
          !_.endsWith(this.fileName, '.yml') &&
          !_.endsWith(this.fileName, '.yaml')
        ) {
          this.$notify({
            message: '版本文件必须为yml文件!',
            type: 'error',
            duration: this.$store.state.settings.duration
          })
          return false
        }
      } else {
        isUploadFile = false
      }

      this.$refs[refName].$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign(
            { versionId: this.id, fileName: this.fileName },
            this.dataForm.dynamicFormModel
          )
          update(data).then((response) => {
            if (isUploadFile) {
              this.$refs.uploadFile.submit()
            } else {
              this.initList()
            }
            this.dialogVisible = false
          })
        }
      })
    },
    handleCreate: function() {
      this.dataTitle = '新增版本管理信息'
      this.id = ''
      this.isUpdate = false
      this.fileName = ''
      this.dialogVisible = true
    },
    handleUpdate: function(row) {
      this.dataTitle = '修改版本管理信息'
      this.id = row.versionId
      this.fileName = row.fileName
      this.dialogVisible = true
      this.isUpdate = true
      this.initFormData('dataForm', row)
    },
    loadAllEdgeDevice() {
      loadAllEdgeDevice()
        .then((response) => {
          if (response.success) {
            this.edgeDeviceList = response.data
          } else {
            this.edgeDeviceList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    selectionChange(val) {
      this.multipleSelection = val
    },
    openSendDialog(row) {
      this.dataTitle = '升级网关'
      this.sendConfigDialogVisible = true
      this.sendParms.fileName = row.fileName
      this.sendParms.versionName = row.versionName
      this.sendParms.versionId = row.versionId
    },
    closeSendConfigDialog() {
      this.$refs.multipleTable.clearSelection()
      this.sendConfigDialogVisible = false
      this.sendParms.macAddress = []
      this.sendParms.fileName = ''
      this.sendParms.versionName = ''
      this.sendParms.versionId = ''
    },
    sendToEdgeDevice() {
      if (
        this.sendParms.fileName === '' ||
        this.sendParms.fileName === undefined
      ) {
        this.$notify({
          type: 'error',
          message: '请先上传版本管理文件'
        })
      }
      if (this.multipleSelection.length === 0) {
        this.$notify({
          type: 'error',
          message: '请先选择升级网关'
        })
      } else {
        this.$confirm('请确认是否升级所选网关?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.length = this.multipleSelection.length
            if (this.length === 1) {
              this.value = this.multipleSelection[0]
              this.sendParms.macAddress.push(this.value.mac)
            }
            if (this.length > 1) {
              for (var i = 0; i < this.length; i++) {
                this.sendParms.macAddress.push(this.multipleSelection[i].mac)
              }
            }
            sendToEdgeDevice(this.sendParms)
              .then((response) => {
                if (response.success) {
                  this.$refs.multipleTable.clearSelection()
                  this.sendConfigDialogVisible = false
                  this.$notify({
                    message: '升级任务下发成功!',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '升级任务下发失败！'
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          })
          .catch(() => {})
      }
    },
    handleDelete: function(row) {
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = { versionId: row.versionId, fileName: row.fileName }
          deleteId(params).then((response) => {
            if (response.success) {
              this.$notify({
                message: '删除成功!',
                type: 'success',
                duration: this.$store.state.settings.duration
              })
              this.initList()
            } else {
              this.$notify.error({
                title: '错误',
                message: '请求出错！'
              })
            }
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    fileUploadSuccess: function(response, file, fileList) {
      if (response.success) {
        this.$notify({
          message: '保存成功',
          type: 'success',
          duration: this.$store.state.settings.duration
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: response.message
        })
      }
      this.initList()
    },
    handleUploadFile: function() {
      this.fileVisible = true
    },
    handleDowloadFile: function(row) {
      if (row.fileName === '' || row.fileName === undefined) {
        this.$notify({
          type: 'error',
          message: '请先上传版本管理文件'
        })
      } else {
        window.open('/api/versionManage/download?fileName=' + row.fileName)
      }
    },
    resetForm: function(refName, formName) {
      this.$refs[refName].$refs[formName].resetFields()
      this.$refs.uploadFile.clearFiles()
    }
  }
}
</script>
