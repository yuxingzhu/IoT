<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip class="item" effect="dark" content="返回" placement="bottom">
                  <el-button @click="$router.back(-1)">
                    <svg-icon icon-class="back" />返回
                  </el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-tooltip content="新增">
                  <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add','')" />
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.name" :maxlength="20" placeholder="名称" >名称</el-input>
              </el-form-item>

              <el-form-item>
                <el-tooltip content="重置">
                  <el-button icon="el-icon-refresh" @click="resetQueryForm"/>
                </el-tooltip>
                <el-tooltip content="搜索">
                  <el-button icon="el-icon-search" @click="getList" />
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4">
            <el-tooltip  class="item" effect="dark" content="上传" placement="bottom">上传
              <el-button icon="el-icon-upload" @click="openFileEditDialog" >上传</el-button>
            </el-tooltip>
            <el-tooltip  class="item" effect="dark" content="下载模板" placement="bottom">
              <el-button icon="el-icon-download" @click="handleDowloadFile" >下载</el-button>
            </el-tooltip>
            <el-tooltip  class="item" effect="dark" content="导出资源属性" placement="bottom">
              <el-button icon="el-icon-notebook-2" @click="handleExportFile">导出</el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="名称" prop="name" width="180" align="center" />
        <el-table-column label="描述" prop="description" align="center" />
        <el-table-column label="读写属性" prop="resourceReadWrites" align="center">
          <template scope="scope">
            {{ scope.row.resourceReadWrites=== 'RW' ?'读写' : (scope.row.resourceReadWrites=== 'R'?'只读':'只写' ) }}
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="resUnit" align="center" />
        <el-table-column  label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom">
              <el-button :disabled="isUsed" size="small" icon="el-icon-edit" @click="openPartnerEditDialog('edit',scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom">
              <el-button size="small" :disabled="isUsed" icon="el-icon-delete" @click="deletePartner(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceFileRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="名称" prop="name">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.name" :maxlength="100" placeholder="" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="描述" prop="description">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.description" :maxlength="100" placeholder="" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="读写属性" prop="resourceReadWrites">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.resourceReadWrites" style="width:100%">
                      <el-option label="只读" value="R" />
                      <el-option label="只写" value="W" />
                      <el-option label="读写" value="RW" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="单位" prop="resUnit">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.resUnit" :maxlength="100" placeholder="" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveResource">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="editDialogTitle" :visible.sync="fileDialogVisible" :close-on-click-modal="false" @close="closeDialog">
        <div>
          <el-form ref="resourceFileForm" :model="resourceFileForm" :rules="resourceEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="24">
                <el-form-item label="选择文件" prop="path">
                  <el-col :span="24">
                    <el-upload
                      class="upload-demo"
                      :action="action"
                      :on-remove="handleRemove"
                      :on-error="onError"
                      :on-progress="onProgress"
                      :multiple="false"
                      :limit="1"
                      :auto-upload="true"
                      :data="uploadData"
                      :on-success="handleSuccess"
                      :before-upload="beforeUpload"
                      :file-list="fileList"
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">上传文件大小不能超过4MB,条数不能超过20000</div>
                    </el-upload>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div v-if="errorTableData.length>0">
                  <h4 style="color:#dc0d0d;text-indent:2px;padding:5px 0;border-left:10px solid #dc0d0d;border-top:1px solid #ccc;">错误列表</h4>
                  <el-table :data="errorTableData" style="width: 100%">
                    <el-table-column prop="name" width="180" align="center" label="名称" />
                    <el-table-column prop="error" align="center" label="原因" />
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getList,
  saveResource,
  editResource,
  deletePartner
} from '@/api/resources'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Resources',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        profileId: '',
        name: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'nid',
        order: 'desc'
      },
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      resourceEditForm: {
        nid: '',
        profileNid: '',
        name: '',
        description: '',
        resourceReadWrites: '',
        resUnit: ''
      },
      resourceFileRules: {
        name: [
          {
            required: true,
            message: '请填写名称!',
            trigger: 'blur'
          }
          // {
          //   pattern: /^[A-Za-z]+$/,
          //   message: '名称必须是英文字母',
          //   trigger: 'blur'
          // }
        ],
        resourceReadWrites: [
          {
            required: true,
            message: '请选择读写属性!',
            trigger: 'change'
          }
        ],
        description: [
          {
            required: true,
            message: '请填写描述!',
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      deviceId: {
        nid: ''
      },
      profileNid: '',
      isUsed: false,
      fileDialogVisible: false,
      errorTableData: [],
      resourceFileForm: {
        id: '',
        path: '',
        realName: '',
        agwId: ''
      },
      resourceEditRules: {
        path: [
          {
            required: true,
            message: '请选择文件!'
          }
        ]
      },
      fileList: [],
      uploadData: {},
      action: process.env.VUE_APP_BASE_API + '/neDeviceResources/uploadFile',
      showProgress: false,
      processLength: 0,
      loading: '',
      loadings: ''
    }
  },
  computed: {
    // ...mapGetters(['operationPermission'])
  },
  created() {
    this.initParams()
    this.getList()
  },
  methods: {
    initParams() {
      if (this.$route.query.profileNid !== undefined) {
        this.profileNid = this.$route.query.profileNid
        this.uploadData = { profileNid: this.profileNid }
        if (this.$route.query.isUsed === 'false') {
          this.isUsed = false
        } else {
          this.isUsed = true
        }
      }
    },
    getList() {
      this.listLoading = true
      this.listQuery.profileNid = this.profileNid
      getList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.data
          this.total = response.totalRowCount
        } else {
          this.list = []
          this.total = []
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    resetQueryForm() {
      this.listQuery = {
        profileNid: '',
        name: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'nid',
        order: 'desc'
      }
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.resourceEditForm.resetFields()
      this.multipleSelection = []
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      this.resourceEditForm.profileNid = this.profileNid
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增资源属性'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改资源属性'
        this.$nextTick(() => {
          this.resourceEditForm.profileNid = row.profileNid
          this.resourceEditForm.name = row.name
          this.resourceEditForm.description = row.description
          this.resourceEditForm.resourceReadWrites = row.resourceReadWrites
          this.resourceEditForm.resUnit = row.resUnit
          this.resourceEditForm.nid = row.nid
        })
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate(valid => {
        if (valid) {
          if (this.currentActionType === 'add') {
            saveResource(this.resourceEditForm)
              .then(response => {
                if (response.success) {
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.closeEditDialog()
                  this.getList()
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            editResource(this.resourceEditForm)
              .then(response => {
                if (response.success) {
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.closeEditDialog()
                  this.getList()
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch(error => {
                console.log(error)
              })
          }
        } else {
          return false
        }
      })
    },
    deletePartner(row) {
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deviceId.nid = row.nid
          deletePartner(this.deviceId)
            .then(response => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.getList()
                this.connectionType = ''
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '请求出错！'
                })
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    handleUploadFile: function() {
      this.fileVisible = true
    },
    handleDowloadFile: function() {
      window.open(
        process.env.VUE_APP_BASE_API + '/neDeviceResources/downloadFile'
      )
    },
    handleExportFile: function() {
      window.open(
        process.env.VUE_APP_BASE_API + '/neDeviceResources/exportFile?profileNid=' + this.profileNid
      )
    },
    closeDialog: function() {
      this.fileDialogVisible = false
      this.$refs.resourceFileForm.resetFields()
      this.uploadData = { profileNid: this.profileNid }
      this.errorTableData = []
      this.fileList.shift()
      this.getList()
    },
    openFileEditDialog() {
      this.editDialogTitle = '上传属性资源'
      this.fileDialogVisible = true
    },
    beforeUpload(file) {
      this.$refs.resourceFileForm.resetFields()
      this.errorTableData.length = 0
    },
    handleError(file, fileList) {
      this.$notify.error({
        title: '错误',
        message: '上传失败！'
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleExceed(files, fileList) {
      this.$notify({
        title: '警告',
        message: '上传文件数量超出限制!',
        type: 'warning'
      })
    },
    uploadFile() {
      this.fileList.shift()
    },
    handleSuccess(response, file, fileList) {
      this.loadings.close()
      if (response.success) {
        if (response.errorList.length === 0) {
          this.closeDialog()
          this.$notify({
            message: '上传成功!',
            type: 'success'
          })
        }
        this.errorTableData = response.errorList
      } else {
        fileList.shift()
        this.$notify.error({
          title: '错误',
          message: response.message
        })
      }
    },
    onProgress(event, file, fileList) {
      this.loadings = this.$loading({
        lock: true,
        text: '正在上传中...',
        fontSize: '100px',
        spinner: 'el-icon-loading',
        spinnerColor: 'red',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    // eslint-disable-next-line handle-callback-err
    onError(err, file, fileList) {
      this.loadings.close()
      this.closeDialog()
      this.$notify({
        message: '上传成功!',
        type: 'success'
      })
    },
    handleRemove(file, fileList) {}
  }
}
</script>
<style>
.el-loading-spinner .el-loading-text {
  color: #00c3c4 !important;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i {
  color: #00c3c4 !important;
}
</style>

