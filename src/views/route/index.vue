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
                <el-input v-model.trim="listQuery.routeId" :maxlength="20" placeholder="消息路由ID"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.routeName" :maxlength="20" placeholder="消息路由名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model.trim="listQuery.messageSourceType" placeholder="消息来源" style="width:100%">
                  <el-option label="设备" value="device"></el-option>
                  <el-option label="边缘应用" value="edge"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model.trim="listQuery.messageTargetType" placeholder="消息目标" style="width:100%">
                  <el-option label="IOT平台" value="platform"></el-option>
                  <el-option label="边缘应用" value="edge"></el-option>
                </el-select>
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
        <el-table-column label="消息路由ID" prop="routeId" align="center" />
        <el-table-column label="消息路由名称" prop="routeName" align="center" />
        <el-table-column label="消息来源" prop="messageSourceType" align="center">
          <template scope="scope">
            {{ scope.row.messageSourceType ==="platform" ?'IOT平台' : scope.row.messageSourceType ==="edge" ?'边缘应用' :'设备' }}
          </template>
        </el-table-column>
        <el-table-column label="来源边缘应用名称" prop="messageSourceName" align="center" />
        <el-table-column label="消息目标" prop="messageTargetType" align="center" >
           <template scope="scope">
            {{ scope.row.messageTargetType ==="platform" ?'IOT平台' : scope.row.messageTargetType ==="edge" ?'边缘应用' :'设备' }}
          </template>
        </el-table-column>
        <el-table-column label="目标边缘应用名称" prop="messageTargetName" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-tooltip  content="修改" placement="bottom">
              <el-button @click="openPartnerEditDialog('edit',scope.row)" size="small" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip content="路由配置" placement="bottom">
              <el-button @click="jump(scope.row)" size="small" icon="el-icon-setting"></el-button>
            </el-tooltip>
            <el-tooltip  content="删除" placement="bottom">
              <el-button @click="deletePartner(scope.row)" size="small"  icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceEditRules" label-width="130px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="消息路由ID" prop="routeId">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.routeId" :maxlength="10000" :disabled="currentActionType === 'edit'"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="消息路由名称" prop="routeName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.routeName" :maxlength="10000"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="消息来源" prop="messageSourceType">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.messageSourceType" style="width:100%">
                      <el-option label="设备" value="device"></el-option>
                      <el-option label="边缘应用" value="edge"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="resourceEditForm.messageSourceType ==='edge'">
              <el-col :span="20">
                <el-form-item label="来源边缘应用名称" prop="messageSourceName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.messageSourceName" :maxlength="10000"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="消息目标" prop="messageTargetType">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.messageTargetType" style="width:100%">
                      <el-option label="IOT平台" value="platform"></el-option>
                      <el-option label="边缘应用" value="edge"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="resourceEditForm.messageTargetType ==='edge'">
              <el-col :span="20">
                <el-form-item label="目标边缘应用名称" prop="messageTargetName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.messageTargetName" :maxlength="10000"></el-input>
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
import { mapGetters } from 'vuex'
import {
  getList,
  deletePartner,
  addResource,
  updateResource
} from '@/api/route'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Route',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        routeId: '',
        routeName: '',
        messageSourceType: '',
        messageTargetType: '',
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
        routeId: '',
        routeName: '',
        messageSourceType: '',
        messageSourceName: '',
        messageTargetType: '',
        messageTargetName: ''
      },
      resourceEditRules: {
        routeId: [
          {
            required: true,
            message: '请输入消息路由ID!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!/^[a-zA-Z0-9_]{1,}$/.test(value)) {
                callback(
                  '消息路ID由字母、数字或下划线组成!'
                )
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        routeName: [
          {
            required: true,
            message: '请输入消息路由名称!',
            trigger: 'blur'
          }
        ],
        messageSourceType: [
          {
            required: true,
            message: '请选择消息来源!',
            trigger: 'change'
          }
        ],
        messageTargetType: [
          {
            required: true,
            message: '请选择消息目标!',
            trigger: 'change'
          }
        ],
        messageSourceName: [
          {
            validator: (rule, value, callback) => {
              if (this.resourceEditForm.messageSourceType === 'edge' && value === '') {
                callback('请输入来源边缘应用名称!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        messageTargetName: [
          {
            validator: (rule, value, callback) => {
              if (this.resourceEditForm.messageTargetType === 'edge' && value === '') {
                callback('请输入目标边缘应用名称!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      deviceId: {
        routeId: ''
      },
      configId: '',
      placeholder: '',
      areaList: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    // ...mapGetters(['operationPermission'])
  },
  created() {
    this.isChildren = this.$route.meta.isChildren
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
    resetQueryForm() {
      this.listQuery = {
        routeId: '',
        routeName: '',
        messageSourceType: '',
        messageTargetType: '',
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
        this.editDialogTitle = '新增消息路由'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改消息路由'
        this.$nextTick(() => {
          this.resourceEditForm.routeId = row.routeId
          this.resourceEditForm.routeName = row.routeName
          this.resourceEditForm.messageSourceType = row.messageSourceType
          this.resourceEditForm.messageSourceName = row.messageSourceName
          this.resourceEditForm.messageTargetType = row.messageTargetType
          this.resourceEditForm.messageTargetName = row.messageTargetName
        })
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate(valid => {
        if (valid) {
          if (this.currentActionType === 'add') {
            addResource(this.resourceEditForm)
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
            updateResource(this.resourceEditForm)
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
          this.deviceId.routeId = row.routeId
          deletePartner(this.deviceId)
            .then(response => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
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
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
        this.resourceEditForm.jsonLabels = this.dynamicTags
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    jump(row) {
      this.$router.push(`/routeConfig?routeId=${row.routeId}&routeName=${row.routeName}`)
    }
  }
}
</script>
<style scoped>
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
  color: #00aa72 !important;
}
</style>
