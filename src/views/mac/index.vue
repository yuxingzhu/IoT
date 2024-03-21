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
                <el-button icon="el-icon-refresh" @click="filterForm.dynamicFormModel.macAddress=''"/>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="搜索" placement="bottom">
                <el-button icon="el-icon-search" @click="initList" />
              </el-tooltip>
            </el-form-item>
          </template>
        </FlexForm>
      </template>
      <template #operating>
        <el-tooltip  class="item" effect="dark" content="上传" placement="bottom">
          <el-button icon="el-icon-upload" @click="handleUploadFile">上传</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="下载模板" placement="bottom">
          <el-button icon="el-icon-download" @click="handleDowloadFile" >下载</el-button>
        </el-tooltip>
      </template>
    </Operation>
    <OperateTable :table-data="tableData" :column-data="columnData" >
      <template #configButton="slotProp">
        <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
          <el-button icon="el-icon-edit" @click="handleUpdate(slotProp.row)" class="elbuttondefault"
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
          <el-button icon="el-icon-delete" @click="handleDelete(slotProp.row)" class="elbuttondefault"
          />
        </el-tooltip>
      </template>
    </OperateTable>
    <Pagination
      :total="totalRowCount"
      :page.sync="query.currentPage"
      :limit.sync="query.pageSize"
      @pagination="initList"
    />
    <div class="dialog">
      <el-dialog :close-on-click-modal="false" :title="dataTitle" :visible.sync="dialogVisible" @closed="resetForm('dataInfo', 'dataForm')">
        <FlexForm ref="dataInfo" form-name="dataForm" :form-data="dataForm.formData" :dynamic-form-model="dataForm.dynamicFormModel" :rules="dataForm.rules" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('dataInfo', 'dataForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="fileVisible"
        :close-on-click-modal="false"
        class="el-dialog-form el-dialog-center"
        size="tiny"
        @close="closeFileDialog"
      >
        <span slot="title" class="el-dialog__title"><i
          class="el-icon-fa-th-large"
        />数据上传</span>
        <el-upload
          action=""
          :multiple="false"
          :file-list="file"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">(上传文件大小不能超过5MB的excel文件)</div>
        </el-upload>

        <div v-if="errorTableData.length>0">
          <h4 style="color:#dc0d0d;text-indent:2px;padding:5px 0;border-left:10px solid #dc0d0d;border-top:1px solid #ccc;">错误列表</h4>
          <el-table
            :data="errorTableData"
            style="width: 100%"
          >
            <el-table-column
              prop="macAddress"
              label="MAC地址"
            />
            <el-table-column
              prop="permissionTime"
              label="过期时间"
            />
          </el-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import Operation from '@/components/Operation/index'
import FlexForm from '@/components/FlexForm/index'
import OperateTable from '@/components/FlexTable/OperateTable/index'
import Pagination from '@/components/Pagination/index'
import { setModel } from '@/utils/form'
import { fetchList, create, deleteId } from '@/api/mac'
const _ = require('lodash')

export default {
  name: 'Mac',
  components: { OperateTable, FlexForm, Operation, Pagination },
  data() {
    return {
      id: '',
      dataTitle: '',
      dialogVisible: false,
      fileVisible: false,
      totalRowCount: 10,
      errorTableData: [],
      file: [],
      query: {
        currentPage: 1,
        pageSize: 10,
        orderby: 'insertTime',
        order: 'DESC'
      },
      filterForm: {
        formData: [{
          type: 'input',
          name: 'macAddress',
          placeholder: 'MAC地址',
          value: ''
        }],
        dynamicFormModel: {},
        rules: {}
      },
      dataForm: {
        formData: [{
          type: 'input',
          name: 'macAddress',
          label: 'MAC地址',
          value: ''
        }, {
          type: 'dateTimePicker',
          name: 'permissionTime',
          label: '过期时间',
          value: ''
        }],
        dynamicFormModel: {},
        rules: {
          macAddress: [{
            required: true,
            message: '请输入MAC地址!'
          }, {
            validator: (rule, value, callback) => {
              if (!/^([a-fA-F0-9]{2}:){5}([a-fA-F0-9]{2})$/.test(value)) {
                callback('MAC地址格式为00:00:00:00:00:00形式！')
              } else {
                callback()
              }
            }, trigger: 'change'
          }
          ],
          permissionTime: [{
            required: true,
            message: '请输入过期时间!'
          }, {
            validator: (rule, value, callback) => {
              const m1 = moment()
              const m2 = moment(value)
              const du = moment.duration(m2 - m1, 'ms')
              if (du <= 0) {
                callback('过期时间必须大于当前时间！')
              } else {
                callback()
              }
            }, trigger: 'blur'
          }]
        }
      },
      columnData: [
        {
          label: 'MAC地址',
          name: 'macAddress'
        },
        {
          label: '过期时间',
          name: 'permissionTime'
        }
      ],
      tableData: []
    }
  },
  mounted: function() {
    this.initFormModel()
    this.initList()
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  methods: {
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
      const params = Object.assign({}, this.query, this.filterForm.dynamicFormModel)
      fetchList(params).then(response => {
        const result = response.data
        this.tableData = result
        this.totalRowCount = response.totalRowCount
      })
    },
    handleSubmit: function(refName, formName) {
      this.$refs[refName].$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign({ id: this.id }, this.dataForm.dynamicFormModel)
          create(data).then(response => {
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
    handleCreate: function() {
      this.dataTitle = '新增网关授权信息'
      this.id = ''
      this.dialogVisible = true
    },
    handleUpdate: function(row) {
      this.dataTitle = '修改网关授权信息'
      this.id = row.id
      this.dialogVisible = true
      this.initFormData('dataForm', row)
    },
    handleDelete: function(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteId(row.id).then(response => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
          this.initList()
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    fileUploadSuccess: function(response, file, fileList) {
      var _this = this
      if (response.success) {
        _this.errorTableData = response.errorList
      }
    },
    handleUploadFile: function() {
      this.fileVisible = true
    },
    handleDowloadFile: function() {
      window.open('/api/mac/downloadFile')
    },
    resetForm: function(refName, formName) {
      this.$refs[refName].$refs[formName].resetFields()
    }
  }
}
</script>
