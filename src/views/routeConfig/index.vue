<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip  content="新增">
                  <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add','')"/>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="消息路由ID" prop="routeId" width="180" align="center" />
        <el-table-column label="消息路由名称" prop="routeName" width="200" align="center" />
        <el-table-column label="优先级" prop="topicFilterPriority" align="center" />
        <el-table-column label="过滤名称" prop="topicFilterName" align="center" />
        <el-table-column label="过滤Key" prop="topicFilterKey" align="center" />
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-tooltip   content="修改" placement="bottom">
              <el-button @click="openPartnerEditDialog('edit',scope.row)" size="small" icon="el-icon-edit" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip  content="删除" placement="bottom">
              <el-button @click="deletePartner(scope.row)" size="small" icon="el-icon-delete" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="配置" placement="bottom">
              <el-button icon="el-icon-setting" @click="handleSet(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="tagTableVisible == 'visible'" class="page-form">
        <FlexCard :title="connectionName">
          <div class="operation">
            <el-tooltip    class="item" effect="dark" content="新增" placement="bottom">
              <el-button @click="openValueEditDialog('add','')"><i class="el-icon-plus" /></el-button>
            </el-tooltip>
          </div>
          <el-table ref="multipleTable" v-loading="valueListLoading" :data="valueList" stripe size="mini" tooltip-effect="dark" style="width: 100%;">
            <el-table-column label="序号" type="index" width="80" align="center" />
            <el-table-column label="过滤值" prop="topicFilterValue" align="center" />
            <el-table-column label="操作" width="250" align="center"  >
              <template slot-scope="scope">
                <el-tooltip content="修改" placement="bottom">
                  <el-button @click="openValueEditDialog('edit',scope.row)" size="small" icon="el-icon-edit" class="background-color: transparent !important;"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
                  <el-button @click="deleteValuePartner(scope.row)" size="small" icon="el-icon-delete" class="background-color: transparent;"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="valueQuery.currentPage" :limit.sync="valueQuery.pageSize" @pagination="initTagList" />
        </FlexCard>
      </div>
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceFileRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="优先级" prop="topicFilterPriority">
                  <el-col :span="22">
                    <el-input-number v-model.trim="resourceEditForm.topicFilterPriority" controls-position="right" @change="handleChange" :min="1" :max="20" style="width:100%"></el-input-number>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="过滤名称" prop="topicFilterName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.topicFilterName" :maxlength="100" placeholder=''></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="过滤Key" prop="topicFilterKey">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.topicFilterKey" :maxlength="100" placeholder=''></el-input>
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
      <el-dialog :title="valueDialogTitle" :visible.sync="fileDialogVisible" :close-on-click-modal="false" @close="closeDialog">
        <div>
          <el-form ref="resourceFileForm" :model="resourceFileForm" :rules="resourceEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="过滤值" prop="topicFilterValue">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceFileForm.topicFilterValue" :maxlength="100" placeholder=''></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" @click="saveValue" :loading="submiting">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FlexCard from '@/components/FlexCard/index'
import Pagination from '@/components/Pagination'
import {
  getList,
  saveResource,
  editResource,
  deletePartner,
  initTagList,
  saveValue,
  editValue,
  deleteValuePartner
} from '@/api/routeConfig'

export default {
  name: 'RouteConfig',
  components: { Pagination, FlexCard },
  data() {
    return {
      submiting: false,
      list: [],
      listLoading: false,
      listQuery: {
        routeId: ''
      },
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      resourceEditForm: {
        id: '',
        routeId: '',
        topicFilterName: '',
        topicFilterKey: '',
        topicFilterPriority: ''
      },
      resourceFileRules: {
        topicFilterName: [
          {
            required: true,
            message: '请填写过滤名称!',
            trigger: 'blur'
          }
        ],
        topicFilterKey: [
          {
            required: true,
            message: '请填写过滤Key!',
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      deviceId: {
        routeId: '',
        topicFilterKey: ''
      },
      routeId: '',
      routeName: '',
      fileDialogVisible: false,
      tagTableVisible: 'hidden',
      connectionName: '',
      valueQuery: {
        routeId: '',
        topicFilterKey: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'id',
        order: 'desc'
      },
      valueList: [],
      total: 0,
      valueListLoading: false,
      currentValueType: 'add',
      valueDialogTitle: '',
      resourceFileForm: {
        id: '',
        routeId: '',
        topicFilterKey: '',
        topicFilterValue: ''
      },
      resourceEditRules: {
        topicFilterValue: [
          {
            required: true,
            message: '输入过滤值!',
            trigger: 'blur'
          }
        ]
      },
      ids: {
        id: ''
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
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.initParams()
    this.getList()
  },
  methods: {
    initParams() {
      if (this.$route.query.routeId !== undefined) {
        this.routeId = this.$route.query.routeId
        this.listQuery.routeId = this.routeId
      }
      if (this.$route.query.routeName !== undefined) {
        this.routeName = this.$route.query.routeName
      }
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.data
        } else {
          this.list = []
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    resetQueryForm() {
      this.listQuery = {
        routeId: ''
      }
    },
    handleChange() {},
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.resourceEditForm.resetFields()
    },
    openPartnerEditDialog(actionType, row) {
      this.tagTableVisible = 'hidden'
      this.currentActionType = actionType
      this.resourceEditForm.routeId = this.routeId
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增路由配置'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改路由配置'
        this.$nextTick(() => {
          this.resourceEditForm.id = row.id
          this.resourceEditForm.topicFilterPriority = row.topicFilterPriority
          this.resourceEditForm.topicFilterName = row.topicFilterName
          this.resourceEditForm.topicFilterKey = row.topicFilterKey
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
          this.deviceId.routeId = row.routeId
          this.deviceId.topicFilterKey = row.topicFilterKey
          deletePartner(this.deviceId)
            .then(response => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.getList()
                this.initTagList()
                this.tagTableVisible = 'hidden'
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
    handleSet(row) {
      this.tagTableVisible = 'visible'
      this.connectionName = row.topicFilterKey + '过滤值配置:'
      this.valueQuery.routeId = this.routeId
      this.valueQuery.topicFilterKey = row.topicFilterKey
      this.resourceFileForm.topicFilterKey = row.topicFilterKey
      this.initTagList()
    },
    initTagList() {
      this.valueListLoading = true
      initTagList(this.valueQuery).then(response => {
        if (response.success) {
          this.valueList = response.data
          this.total = response.totalRowCount
        } else {
          this.valueList = []
          this.total = []
        }
        this.valueListLoading = false
      })
    },
    openValueEditDialog(actionType, row) {
      this.currentValueType = actionType
      this.resourceFileForm.routeId = this.routeId
      if (this.currentValueType === 'add') {
        this.valueDialogTitle = '新增过滤值'
      } else if (this.currentValueType === 'edit') {
        this.valueDialogTitle = '修改过滤值'
        this.$nextTick(() => {
          this.resourceFileForm.id = row.id
          this.resourceFileForm.routeId = row.routeId
          this.resourceFileForm.topicFilterKey = row.topicFilterKey
          this.resourceFileForm.topicFilterValue = row.topicFilterValue
        })
      }
      this.fileDialogVisible = true
    },
    saveValue() {
      this.$refs['resourceFileForm'].validate(valid => {
        if (valid) {
          if (this.currentValueType === 'add') {
            saveValue(this.resourceFileForm)
              .then(response => {
                if (response.success) {
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.closeDialog()
                  this.initTagList()
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
            editValue(this.resourceFileForm)
              .then(response => {
                if (response.success) {
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.closeDialog()
                  this.initTagList()
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
    closeDialog: function() {
      this.fileDialogVisible = false
      this.$refs.resourceFileForm.resetFields()
      this.initTagList()
    },
    deleteValuePartner(row) {
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.ids.id = row.id
          deleteValuePartner(this.ids)
            .then(response => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.initTagList()
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
    }
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

