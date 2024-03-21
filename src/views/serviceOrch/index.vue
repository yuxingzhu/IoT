<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip  content="新增">
                  <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add','')" :disabled="able"> </el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.serviceOrchName" :maxlength="20" placeholder="编排名称"></el-input>
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
        <el-table-column label="编排名称" prop="serviceOrchName" align="center" />
        <el-table-column label="编码" prop="serviceOrchCode" width="100" align="center" />
        <el-table-column label="描述" prop="serviceOrchDesc" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="180" align="center" />>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-tooltip  content="修改" placement="bottom">
              <el-button @click="openPartnerEditDialog('edit',scope.row)" size="small" icon="el-icon-edit" class="elbuttondefault">修改</el-button>
            </el-tooltip>
            <el-tooltip  content="下发" placement="bottom" style="margin-left:1px">
              <el-button @click="openEditDialog(scope.row)" size="small" icon="el-icon-paperclip" class="elbuttondefault">下发</el-button>
            </el-tooltip>
            <el-tooltip content="下发记录" placement="bottom" style="margin-left:1px">
              <el-button @click="openPartnerViewConfigDialog(scope.row)" size="small" icon="el-icon-notebook-2" class="elbuttondefault">下发记录</el-button>
            </el-tooltip>
            <el-tooltip  content="编排" placement="bottom" style="margin-left:1px">
              <el-button @click="handlePartnerCmd(scope.row)" size="small" icon="el-icon-connection" class="elbuttondefault">编排</el-button>
            </el-tooltip>
            <el-tooltip  content="删除" placement="bottom" style="margin-left:1px">
              <el-button @click="deletePartner(scope.row)" size="small" icon="el-icon-delete" class="elbuttondefault">删除</el-button>
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
                <el-form-item label="编排名称" prop="serviceOrchName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.serviceOrchName" :maxlength="100" :placeholder='placeholder'></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="编码" prop="serviceOrchCode">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.serviceOrchCode" :maxlength="100" :placeholder='placeholder'></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="描述" prop="serviceOrchDesc">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.serviceOrchDesc" :maxlength="100" :placeholder='placeholder'></el-input>
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
      <el-dialog :title="editDialogTitle" :visible.sync="layoutVisible" :close-on-click-modal="false" style="width:260%;margin-left: -73%;">
        <iframe id="iframeID" :src="resultSrc" width="100%" height="550px" frameborder="0"></iframe>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeLayoutDialog">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="editDialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeDialog">
        <div>
          <el-form ref="feServiceOrchAssignForm" :model="feServiceOrchAssignForm" :rules="feServiceOrchAssignRule" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="下发目标类型" prop="issuedTargetType">
                  <el-col :span="21">
                    <el-select v-model.trim="feServiceOrchAssignForm.issuedTargetType" @change="assign(feServiceOrchAssignForm.issuedTargetType)" placeholder="请选择" style="width:100%;">
                      <el-option label="网关" value='0'></el-option>
                      <el-option label="网关组" value='1'></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="下发目标" prop="issuedTargetId">
                  <el-col :span="21">
                    <el-select v-model.trim="values" multiple placeholder="请选择" style="width:100%;">
                      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width:16%">
                <p class="tip">目标可多选</p>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" @click="saveAssign" :loading="submiting">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="editDialogTitle" :visible.sync="viewConfigDialogVisible" :close-on-click-modal="false" style="width:150%;margin-left: -19%;" @close="closePartnerViewConfigDialog">
        <el-table ref="multipleTable" v-loading="loadingPartner" :data="loadingPartnerList" size="mini" tooltip-effect="dark" style="width: 100%;">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="下发目标类型" prop="typeName" width="100" align="center" />
          <el-table-column label="下发目标" prop="issuedTargetName" align="center" />
          <el-table-column label="下发时间" prop="createTime" align="center" />
          <el-table-column label="下发者" prop="createByName" width="100" align="center" />>
        </el-table>
        <pagination v-show="QueryTotal>0" :total="QueryTotal" :page.sync="QueryForm.currentPage" :limit.sync="QueryForm.pageSize" @pagination="findAssginList" />
        <div slot="footer">
          <el-button icon="fa-ban" @click="closePartnerViewConfigDialog">取 消</el-button>
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
  deletePartner,
  findSrc,
  loadAllFeEdgeGroupList,
  loadfeEdgeDeviceList,
  saveAssign,
  findAssginList
} from '@/api/serviceOrch'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ServiceOrch',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        serviceOrchName: '',
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
        serviceOrchId: '',
        serviceOrchName: '',
        serviceOrchDesc: '',
        serviceOrchCode: ''
      },
      resourceEditRules: {
        serviceOrchName: [
          {
            required: true,
            message: '请输入编排名称!',
            trigger: 'blur'
          }
        ],
        serviceOrchCode: [
          {
            required: true,
            message: '请输入编码!',
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      deviceId: {
        serviceOrchId: ''
      },
      configId: '',
      placeholder: '',
      resultSrc: '',
      layoutVisible: false,
      options: [],
      dialogVisible: false,
      feServiceOrchAssignForm: {
        serviceOrchId: '',
        issuedTargetId: '',
        issuedTargetType: '',
        issuedTargetName: '',
        targetName: '',
        createTime: '',
        createBy: ''
      },
      feServiceOrchAssignRule: {
        issuedTargetId: [
          {
            validator: (rule, value, callback) => {
              console.info(value)
              if (this.values.length === 0) {
                callback('请选择下发目标')
              }
              callback()
            },
            trigger: 'change'
          }
        ]
      },
      targetType: '',
      values: [],
      viewConfigDialogVisible: false,
      QueryForm: {
        serviceOrchId: '',
        pageSize: 10,
        currentPage: 1,
        orderby: 'createTime',
        order: 'desc'
      },
      QueryTotal: 0,
      loadingPartnerList: [],
      loadingPartner: false,
      able: false,
      realToal: ''
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.configId = this.configId
      getList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.data
          this.total = response.totalRowCount
          this.realToal = response.realCount
        } else {
          this.list = []
          this.total = []
        }
        if (this.realToal > 0) {
          this.able = true
        } else {
          this.able = false
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
        this.idList.push(this.value.serviceOrchId)
        this.deviceId.serviceOrchId = this.idList.toString()
      }
      if (this.length > 1) {
        this.abled = false
        this.disabled = true
        for (var i = 0; i < this.length; i++) {
          this.idList.push(this.multipleSelection[i].serviceOrchId)
        }
        this.deviceId.serviceOrchId = this.idList.toString()
      }
      if (this.length === 0) {
        this.abled = true
        this.disabled = true
      }
    },
    resetQueryForm() {
      this.listQuery = {
        serviceOrchName: '',
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
    openPartnerEditDialog(actionTyp, row) {
      this.resourceEditForm.configId = this.configId
      this.currentActionType = actionTyp
      if (actionTyp === 'add') {
        this.editDialogTitle = '新增编排'
      } else if (actionTyp === 'edit') {
        this.editDialogTitle = '修改编排'
        this.$nextTick(() => {
          this.resourceEditForm.serviceOrchId = row.serviceOrchId
          this.resourceEditForm.serviceOrchName = row.serviceOrchName
          this.resourceEditForm.serviceOrchDesc = row.serviceOrchDesc
          this.resourceEditForm.serviceOrchCode = row.serviceOrchCode
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
          this.deviceId.serviceOrchId = row.serviceOrchId
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
    handlePartnerCmd(row) {
      this.editDialogTitle = '服务编排'
      this.layoutVisible = true
      findSrc()
        .then(response => {
          if (response.success) {
            this.resultSrc = response.data
          } else {
            this.resultSrc = ''
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    closeLayoutDialog() {
      this.layoutVisible = false
    },
    loadAllFeEdgeGroupList() {
      loadAllFeEdgeGroupList()
        .then(response => {
          if (response.success) {
            this.options = response.data
          } else {
            this.options = []
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadfeEdgeDeviceList() {
      loadfeEdgeDeviceList()
        .then(response => {
          if (response.success) {
            this.options = response.data
          } else {
            this.options = []
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    openEditDialog(row) {
      this.editDialogTitle = '下发目标'
      this.dialogVisible = true
      this.feServiceOrchAssignForm.serviceOrchId = row.serviceOrchId
      this.feServiceOrchAssignForm.issuedTargetId = row.issuedTargetId
      if (this.value.issuedTargetType === null) {
        this.feServiceOrchAssignForm.issuedTargetType = '0'
        this.loadfeEdgeDeviceList()
      } else {
        this.feServiceOrchAssignForm.issuedTargetType = row.issuedTargetType
        this.assign(this.feServiceOrchAssignForm.issuedTargetType)
      }
      this.values = []
    },
    saveAssign() {
      const ss = this.values.join(',')
      this.feServiceOrchAssignForm.issuedTargetId = ss
      this.feServiceOrchAssignForm.issuedTargetType = this.targetType
      this.$refs['feServiceOrchAssignForm'].validate(valid => {
        if (valid) {
          saveAssign(this.feServiceOrchAssignForm)
            .then(response => {
              if (response.success) {
                this.closeDialog()
                this.getList()
                this.$notify({
                  message: '下发成功',
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
            .catch(error => {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
    assign(issuedTargetType) {
      this.values = []
      this.targetType = issuedTargetType
      if (this.targetType === '0') {
        this.loadfeEdgeDeviceList()
      } else if (this.targetType === '1') {
        this.loadAllFeEdgeGroupList()
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.$refs.feServiceOrchAssignForm.resetFields()
      this.feServiceOrchAssignForm.serviceOrchId = ''
      this.feServiceOrchAssignForm.issuedTargetId = ''
      this.feServiceOrchAssignForm.issuedTargetType = ''
      this.values = []
    },
    closePartnerViewConfigDialog() {
      this.viewConfigDialogVisible = false
      this.QueryForm = {
        serviceOrchId: '',
        pageSize: 10,
        currentPage: 1,
        orderby: 'createTime',
        order: 'desc'
      }
    },
    openPartnerViewConfigDialog(row) {
      this.editDialogTitle = '下发目标详情'
      this.viewConfigDialogVisible = true
      this.QueryForm.serviceOrchId = row.serviceOrchId
      this.findAssginList()
    },
    findAssginList() {
      this.loadingPartner = true
      findAssginList(this.QueryForm).then(response => {
        if (response.success) {
          this.loadingPartnerList = response.data
          this.QueryTotal = response.totalRowCount
        } else {
          this.loadingPartnerList = []
          this.QueryTotal = []
        }
        this.loadingPartner = false
      })
    }
  }
}
</script>
<style>
.tip {
  font-size: 10px;
  color: #bbb7b7;
}
</style>
