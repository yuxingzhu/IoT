<template>
  <div>
    <div v-if="!isChildren" class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item >
                <el-tooltip content="添加">
                  <el-button icon="el-icon-plus" @click="handleCreate" />
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.displayBoardName" :maxlength="20" placeholder="看板名称" />
              </el-form-item>
              <el-form-item>
                <el-tooltip content="重置">
                  <el-button icon="el-icon-refresh" @click="resetQuery" />
                </el-tooltip>
                <el-tooltip content="搜索">
                  <el-button icon="el-icon-search" @click="getList" />
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="listLoading" :data="list" stripe size="mini">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="看板名称" prop="displayBoardName" align="center" />
        <el-table-column label="看板描述" prop="displayBoardDesc" align="center" />
        <el-table-column label="看板类型" prop="displayBoardType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.displayBoardType | functionFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改">
              <el-button icon="el-icon-edit" class="elbuttondefault" @click="handleUpdate(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除">
              <el-button icon="el-icon-delete" class="elbuttondefault" @click="handleDelete(scope.row)" />
            </el-tooltip>
            <el-tooltip content="配置">
              <el-button icon="el-icon-setting" class="elbuttondefault" @click="jump(scope.row)"/>
            </el-tooltip>
            <el-tooltip content="权限配置">
              <el-button icon="el-icon-set-up" class="elbuttondefault" @click="dataPermissionConfig(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini">
          <el-row v-show="false">
            <el-col>
              <el-form-item prop="displayBoardId">
                <input v-model.trim="temp.displayBoardId" type="hidden">
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="看板名称" prop="displayBoardName">
                <el-col :span="22">
                  <el-input v-model.trim="temp.displayBoardName" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item label="看板描述" prop="displayBoardDesc">
                <el-col :span="22">
                  <el-input v-model.trim="temp.displayBoardDesc" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="看板类型" prop="displayBoardType">
                <el-col :span="22">
                  <el-select v-model.trim="temp.displayBoardType" style="width:100%;">
                    <el-option v-for="item in functionList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col>
              <el-form-item label="看板图片" prop="imagePath">
                <el-col :span="22">
                  <el-upload class="upload-demo" :action="action" :headers="headers" :on-remove="handleRemove" :on-error="onError" :on-progress="onProgress" :multiple="false" :limit="1" :on-exceed="handleExceed" :auto-upload="true" :data="uploadData" :on-success="handleSuccess" :before-upload="beforeUpload" :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20MB</div>
                  </el-upload>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </el-dialog>
      <el-dialog title="权限配置" :visible.sync="permissionVisible" :close-on-click-modal="false" width="540px">
        <span slot="title" class="el-dialog__title"><i class="el-icon-fa-th-large" />权限配置</span>
        <div>
          <el-transfer v-model.trim="checkUserIds" class="allotDeviceTransfer" filterable :data="uncheckUserIds" :titles="['待分配', '已分配']" @change="permissionChange" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closePermission">
            取消
          </el-button>
          <el-button type="primary" @click="addPermission">
            确认
          </el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList, createData, updateData, deleteData, getUserInfo, addPermissionList } from '@/api/dataBoard'
import Pagination from '@/components/Pagination'

const functionList = [
  {
    value: 1,
    label: '实时看版'
  },
  {
    value: 2,
    label: '数据看版'
  }
]

const functionKeyValue = formatterList(functionList)

function formatterList(list) {
  return list.reduce((pre, cur) => {
    pre[cur.value] = cur.label
    return pre
  }, {})
}
export default {
  components: { Pagination },
  filters: {
    functionFilter(key) {
      return functionKeyValue[key]
    }
  },
  data() {
    return {
      isChildren: '',
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        displayBoardName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'displayBoardId',
        order: 'desc'
      },
      temp: {
        displayBoardId: '',
        displayBoardName: '',
        displayBoardDesc: '',
        displayBoardType: '',
        imagePath: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增数据看板',
        update: '修改数据看板'
      },
      rules: {
        displayBoardName: [
          { required: true, message: '请输入看板名称', trigger: 'blur' }
        ],
        displayBoardDesc: [
          { required: true, message: '请输入看板描述', trigger: 'blur' }
        ],
        displayBoardType: [
          { required: true, message: '请选择看板类型', trigger: 'change' }
        ]
        // imagePath: [
        //   { required: true, message: '请上传看板图片', trigger: 'blur' }
        // ]
      },
      functionList: functionList,
      dialogPlayVisible: false,
      registerId: this.$route.query.registerId,
      length: 0,
      fileList: [],
      uploadData: {},
      action: process.env.VUE_APP_BASE_API + '/dataDisplayBoard/uploadFile',
      updateaction: '',
      headers: {
        From: 'browser'
      },
      defaultImg: '',
      // 权限配置
      permissionVisible: false,
      checkUserIds: [],
      uncheckUserIds: [],
      displayBoardId: ''
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  watch: {
    dialogFormVisible(val) {
      if (!val && this.$refs['dataForm']) {
        this.fileList = []
        this.$refs['dataForm'].resetFields()
      }
    }
  },
  created() {
    this.isChildren = this.$route.meta.isChildren
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then((response) => {
        if (response.success) {
          this.list = response.data
          this.total = response.totalRowCount
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    resetQuery() {
      this.listQuery = {
        displayBoardName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'displayBoardId',
        order: 'desc'
      }
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData(this.temp).then((response) => {
            this.dialogFormVisible = false
            this.$notify({
              message: '保存成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.temp.displayBoardDesc = row.displayBoardDesc
        this.temp.displayBoardName = row.displayBoardName
        this.temp.displayBoardId = row.displayBoardId
        this.temp.displayBoardType = row.displayBoardType
        this.temp.imagePath = row.imagePath
        if (this.temp.imagePath !== null) {
          this.fileList = [
            {
              name:
                this.temp.imagePath.split('_')[0] +
                '.' +
                this.temp.imagePath.split('_')[1].split('.')[1],
              url: this.temp.imagePath
            }
          ]
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateData(this.temp).then((response) => {
            this.dialogFormVisible = false
            this.$notify({
              message: '保存成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.fileList = []
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('请确认是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.displayBoardId).then((response) => {
          if (response.success) {
            this.$notify({
              message: '删除成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.getList()
          }
        })
      })
    },
    handleUploadFile: function() {},
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.fileList.shift()
        this.$notify({
          title: '警告',
          message: '看板图片不能超过20MB!',
          type: 'warning'
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
        message: '最多支持一个上传文件!',
        type: 'warning'
      })
    },
    uploadFile() {
      this.fileList.shift()
    },
    handleSuccess(response, file, fileList) {
      // this.loadings.close()
      if (response.success) {
        this.temp.imagePath = response.path
        console.info(this.temp.imagePath)
        console.info(
          this.temp.imagePath.split('_')[0] +
            this.temp.imagePath.split('_')[1].split('.')[1]
        )
        this.fileList = [
          {
            name:
              this.temp.imagePath.split('_')[0] +
              '.' +
              this.temp.imagePath.split('_')[1].split('.')[1],
            url: this.temp.imagePath
          }
        ]
      } else {
        fileList.shift()
        this.$notify.error({
          title: '错误',
          message: response.message
        })
      }
    },
    onProgress(event, file, fileList) {},
    onError(err, file, fileList) {
      this.$notify.error({
        title: '错误',
        message: JSON.parse(err.message).message
      })
    },
    handleRemove(file, fileList) {
      this.temp.imagePath = ''
    },
    jump(row) {
      if (row.displayBoardType === 1) {
        // 实时看版
        this.$router.push(`/dataConfig?relationId=${row.displayBoardId}`)
      }
      if (row.displayBoardType === 2) {
        // 数据看版 跳至数据组
        this.$router.push(`/dataGroup?displayBoardId=${row.displayBoardId}`)
      }
    },
    dataPermissionConfig(row) {
      getUserInfo(row.displayBoardId).then(response => {
        if (response.success) {
          this.checkUserIds = response.checkData
          this.uncheckUserIds = response.uncheckData
        } else {
          this.uncheckUserIds = []
          this.checkUserIds = []
        }
      })
      this.displayBoardId = row.displayBoardId
      this.permissionVisible = true
    },
    closePermission() {
      this.permissionVisible = false
      this.displayBoardId = ''
      this.uncheckUserIds = []
      this.checkUserIds = []
    },
    permissionChange: function(oldValue, orient, newValue) {
      // const _this = this
      // console.log(oldValue)
      // console.log(orient)
      // console.log(newValue)
      // if (orient === 'right') {
      //   const temp = []
      //   _.each(this.allotDeviceLeft, (device) => {
      //     _.each(newValue, (key) => {
      //       if (device.key === key) {
      //         temp.push(device)
      //       }
      //     })
      //   })
      // }
    },
    addPermission() {
      const formData = new FormData()
      formData.append('userIds', this.checkUserIds)
      formData.append('displayBoardId', this.displayBoardId)
      addPermissionList(formData).then(response => {
        if (response.success) {
          this.displayBoardId = ''
          this.permissionVisible = false
          this.$notify({
            message: response.message,
            type: 'success',
            duration: this.$store.state.settings.duration
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '请求出错！'
          })
        }
      })
      // console.log(this.checkUserIds)
    }
  }
}
</script>

<style lang="scss" scoped>
.play-img {
  width: 640px;
  height: 360px;
  clear: both;
  display: block;
  margin: auto;
}
</style>
