<template>
  <div>
    <div class="app-container" v-if="!isChildren">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip  content="新增">
                  <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add','')"> </el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.edgeDeviceName" :maxlength="20" placeholder="节点名称"></el-input>
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
        <el-table-column label="节点名称" prop="edgeDeviceName" align="center" />
        <el-table-column label="节点位置" prop="devicePosition" align="center" />
        <el-table-column label="IP地址" prop="ipAddress" align="center" />
        <el-table-column label="应用端口" prop="nodePort" align="center" />
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template scope="scope">
            <svg-icon :icon-class="scope.row.status  ? 'online' : 'offline'" />
            {{ scope.row.status ?' 在线' : '离线' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom">
              <el-button @click="openPartnerEditDialog('edit',scope.row)" size="small" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip content="配置" placement="bottom">
              <el-button @click="jump(scope.row)" size="small" icon="el-icon-setting"></el-button>
            </el-tooltip>
            <el-tooltip  content="删除" placement="bottom">
              <el-button @click="deletePartner(scope.row)" size="small" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="节点名称" prop="edgeDeviceName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.edgeDeviceName" :maxlength="10000"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="IP地址" prop="ipAddress">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.ipAddress" :maxlength="10000"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="应用端口" prop="nodePort">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.nodePort" :maxlength="10000"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="节点位置" prop="devicePosition">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.devicePosition" :maxlength="10000"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" @click="saveResource" :loading="submiting">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getList, deletePartner, addResource, updateResource, deleteLocal } from '@/api/node'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Node',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        edgeDeviceName: '',
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
        edgeDeviceId: '',
        edgeDeviceName: '',
        devicePosition: '',
        ipAddress: '',
        nodePort: ''
      },
      resourceEditRules: {
        edgeDeviceName: [
          {
            required: true,
            message: '请输入节点名称!',
            trigger: 'blur'
          }
        ],
        ipAddress: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (
                !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
                  value
                )
              ) {
                callback('IP地址格式不正确！')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        nodePort: [
          {
            required: true,
            message: '请输入应用端口!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                !/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
                  value
                )
              ) {
                callback('应用端口不正确')
              } else {
                callback()
              }
            }
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      deviceId: {
        edgeDeviceId: '',
        status: ''
      },
      edgeDeviceId: '',
      placeholder: '',
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
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
          this.total = []
        }
        this.listLoading = false
      })
    },
    resetQueryForm() {
      this.listQuery = {
        edgeDeviceName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      }
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.resourceEditForm.resetFields()
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增节点'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改节点'
        this.$nextTick(() => {
          this.resourceEditForm.edgeDeviceId = row.edgeDeviceId
          this.resourceEditForm.edgeDeviceName = row.edgeDeviceName
          this.resourceEditForm.devicePosition = row.devicePosition
          this.resourceEditForm.ipAddress = row.ipAddress
          this.resourceEditForm.nodePort = row.nodePort
        })
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate((valid) => {
        if (valid) {
          if (this.currentActionType === 'add') {
            addResource(this.resourceEditForm)
              .then((response) => {
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
              .catch((error) => {
                console.log(error)
              })
          } else if (this.currentActionType === 'edit') {
            updateResource(this.resourceEditForm)
              .then((response) => {
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
              .catch((error) => {
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
          this.deviceId.edgeDeviceId = row.edgeDeviceId
          if (row.status) {
            deletePartner(this.deviceId)
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: response.message,
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.getList()
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            deleteLocal(this.deviceId)
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: response.message,
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.getList()
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        })
        .catch(() => {})
    },
    jump(row) {
      this.$router.push(`/configs?edgeDeviceId=${row.edgeDeviceId}&type=2`)
    }
  }
}
</script>
<style lang="scss" scoped >
.el-tag-small {
  cursor: pointer;
}
.el-tag + .el-tag {
  margin-left: 10px;
}

.el-tag {
  background-color: #edfaf5;
  border-color: #edfaf5;
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  color: #00aa72;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}

.el-tag .el-tag__close:hover {
  color: #fff;
  background-color: rgb(172, 214, 200) !important;
}
.el-tag .el-tag__close {
  color: #6864CE !important;
}
.el-loading-spinner .el-loading-text {
  color: #6864CE !important;
  margin: 3px 0;
  font-size: 14px;
}

.el-loading-spinner i {
  color: #6864CE !important;
}
</style>
