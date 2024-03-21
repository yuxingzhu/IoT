<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm">
              <el-form-item>
                <el-tooltip content="新增">
                  <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog()"> </el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.profileName" :maxlength="20" placeholder="设备配置名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-tooltip content="重置">
                  <el-button icon="el-icon-refresh" @click="resetQueryForm"></el-button>
                </el-tooltip>
                <el-tooltip content="搜索">
                  <el-button icon="el-icon-search" @click="getList"></el-button>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>

        </el-row>
      </div>
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="设备配置名称" prop="profileName" align="center" />
        <el-table-column label="设备配置功能" prop="resourceReadWrites" align="center" >
           <template scope="scope">
            {{ scope.row.resourceReadWrites=== 'RW' ?'采集写入' : '采集' }}
          </template>
        </el-table-column>
        <el-table-column label="厂商名称" prop="manufacturer" align="center" />
        <el-table-column label="型号" prop="model" align="center" />
        <el-table-column label="设备配置描述" prop="description" align="center" />
        <el-table-column label="设备配置标签" prop="jsonLabels" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-tooltip content="配置" placement="bottom">
              <el-button @click="down(scope.row)" size="small" icon="el-icon-download"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
              <el-button @click="deletePartner(scope.row)" size="small" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false"  @close="closeEditDialog">
        <div>
          <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceEditRules" label-width="100px" size="mini">
            <el-row>
              <el-col :span="24">
                <el-form-item label="选择模型" prop="path">
                  <el-col :span="24">
                    <el-upload class="upload-demo" :action="action" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-success="handleSuccess" :on-error="handleError" :on-exceed="handleExceed" :before-upload="beforeUpload" :file-list="fileList">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">上传文件大小不能超过5MB的yaml文件</div>
                    </el-upload>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" @click="uploadFile" :loading="submiting">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getList, saveResource, deletePartner } from '@/api/manualProfile'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ManualProfile',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        profileName: '',
        isUpload: 0,
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      resourceEditForm: {
        id: '',
        path: '',
        realName: '',
        agwId: ''
      },
      resourceEditRules: {
        path: [
          {
            required: true,
            message: '请选择模型文件!'
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
      configId: '',
      placeholder: '',
      fileList: [],
      action: process.env.VUE_APP_BASE_API + '/nprofile/uploadFile'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
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
    handleClick(tab, event) {
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.length = this.multipleSelection.length
      this.idList = []
      if (this.length === 1) {
        this.disabled = false
        this.abled = false
        this.value = this.multipleSelection[0]
        this.idList.push(this.value.nid)
        this.deviceId.nid = this.idList.toString()
      }
      if (this.length > 1) {
        this.abled = false
        this.disabled = true
        for (var i = 0; i < this.length; i++) {
          this.idList.push(this.multipleSelection[i].nid)
        }
        this.deviceId.nid = this.idList.toString()
      }
      if (this.length === 0) {
        this.abled = true
        this.disabled = true
      }
    },
    resetQueryForm() {
      this.listQuery = {
        profileName: '',
        isUpload: 0,
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      }
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.resourceEditForm.resetFields()
      this.multipleSelection = []
    },
    openPartnerEditDialog() {
      this.editDialogTitle = '上传设备模型'
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate(valid => {
        if (valid) {
          saveResource(this.resourceEditForm)
            .then(response => {
              if (response.success) {
                this.$notify({
                  message: '保存成功',
                  type: 'success',
                  duration: 2000
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
          return false
        }
      })
    },
    beforeUpload(file) {
      var isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.submiting = false
        this.$notify({
          title: '警告',
          message: '上传文件大小不能超过 5MB!',
          type: 'warning'
        })
      }
    },
    handleRemove(file, fileList) {
      this.resourceEditForm.path = ''
    },
    handleSuccess(response, file, fileList) {
      if (response.success) {
        this.resourceEditForm.path = response.data.realContextPath
        this.resourceEditForm.realName = response.data.realName
      } else {
        fileList.shift()
        this.$notify.error({
          title: '错误',
          message: response.message
        })
      }
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
      this.saveResource()
      this.fileList.shift()
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
                  duration: 2000
                })
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
        })
        .catch(() => {})
    },
    down(row) {
      const downUrl =
        process.env.VUE_APP_BASE_API + '/nprofile/downloadhelp?nid=' + row.nid
      window.open(downUrl)
    }
  }
}
</script>
