<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
              <el-tooltip  content="新增">
                <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add', '')" />
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="listQuery.taskName" :maxlength="20" placeholder="任务调度名称" />
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQueryForm" />
              </el-tooltip>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="getList" />
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="任务调度名称" prop="taskName" align="center" />
      <el-table-column label="设备名称" prop="deviceName" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="设备描述" prop="deviceDasc" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="执行频率" prop="frequency" align="center" />
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column  label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="bottom">
            <el-button size="small" icon="el-icon-edit" @click="openPartnerEditDialog('edit', scope.row)" class="elbuttondefault">修改</el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="bottom" style="margin-left: 1px">
            <el-button size="small" icon="el-icon-delete" @click="deletePartner(scope.row)" class="elbuttondefault">删除</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
      <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceEditRules" label-width="100px" size="mini" @submit.native.prevent>
        <el-row v-show="false">
          <el-col :span="20">
            <el-form-item prop="id">
              <input v-model.trim="resourceEditForm.id" type="hidden">
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item label="任务调度名称" prop="taskName">
              <el-input v-model.trim="resourceEditForm.taskName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item label="设备描述" prop="deviceNameList">
              <el-select v-model.trim="resourceEditForm.deviceNameList" multiple>
                <el-option v-for="item in deviceList" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item label="执行频率" prop="frequency">
              <input v-model.trim="resourceEditForm.frequency" type="hidden">
              <el-col :span="4">
                <el-input v-model.trim="resourceEditForm.frequencyDay" :maxlength="20" />
              </el-col>
              <el-col :span="2" style="padding-top: 0%; margin-left: 0px; margin-right: 0%">
                <span>&nbsp;日&nbsp;</span>
              </el-col>

              <el-col :span="4">
                <el-input v-model.trim="resourceEditForm.frequencyHour" :maxlength="20" />
              </el-col>
              <el-col :span="2" style="padding-top: 0%; margin-left: 0px; margin-right: 0%">
                <span>&nbsp;时</span>
              </el-col>

              <el-col :span="4">
                <el-input v-model.trim="resourceEditForm.frequencyMinute" :maxlength="20" />
              </el-col>
              <el-col :span="2" style="padding-top: 0%; margin-left: 0px; margin-right: 0%">
                <span>&nbsp;分</span>
              </el-col>

              <el-col :span="4">
                <el-input v-model.trim="resourceEditForm.frequencySecond" :maxlength="20" />
              </el-col>
              <el-col :span="2" style="padding-top: 0%; margin-left: 0px; margin-right: 0%">
                <span>&nbsp;秒</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveResource">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getList,
  saveResource,
  updateResource,
  deletePartner,
  findDeviceList,
  findDeviceListExcludeId
} from '@/api/neTask'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Exportconfig',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        taskName: '',
        agwId: '',
        currentPage: 1,
        pageSize: 10,
        orderBy: 'id',
        order: 'desc'
      },
      resourceEditForm: {
        id: '',
        agwId: '',
        taskName: '',
        deviceNameList: [],
        deviceName: '',
        frequency: 'hidden',
        frequencyDay: '',
        frequencyHour: '',
        frequencyMinute: '',
        frequencySecond: ''
      },
      resourceEditRules: {
        taskName: [
          { required: true, message: '请输入任务调度名称', trigger: 'blur' }
        ],
        deviceNameList: [
          {
            required: true,
            message: '请选择设备名称!',
            trigger: 'change'
          }
        ],
        frequency: [
          { required: true, message: '执行频率不能为空' },
          {
            validator: (rule, value, callback) => {
              const reg = /^[0-9]*[1-9][0-9]*$/
              const regh = /^([1][0-9]|[1-9]|[2][0-3])$/
              const regm = /^([1-5][0-9]|[1-9])$/
              const regs = /^([1-5][0-9]|[1-9])$/
              const d = this.resourceEditForm.frequencyDay
              const h = this.resourceEditForm.frequencyHour
              const m = this.resourceEditForm.frequencyMinute
              const s = this.resourceEditForm.frequencySecond
              if (d === '' && h === '' && m === '' && s === '') {
                callback('执行频率不能为空！')
              } else if (d !== '' && !reg.test(d)) {
                callback('天请填写正整数!')
              } else if (h !== '' && !regh.test(h)) {
                callback('时请填写1-23正整数!')
              } else if (m !== '' && !regm.test(m)) {
                callback('分请填写1-59正整数!')
              } else if (s !== '' && !regs.test(s)) {
                callback('秒请填写1-59正整数!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      // 新增修改-设备列表
      deviceList: [],
      length: 0,
      editDialogVisible: false,
      currentActionType: 'add',
      editDialogTitle: '',
      neTaskId: {
        id: ''
      },
      edgeDeviceId: '',
      agwIds: {
        agwId: '',
        id: ''
      }
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.initParams()
    this.getList()
    this.findDeviceList()
  },
  methods: {
    initParams() {
      if (this.$route.query.edgeDeviceId !== undefined) {
        this.edgeDeviceId = this.$route.query.edgeDeviceId
      }
    },
    getList() {
      this.listLoading = true
      this.listQuery.agwId = this.edgeDeviceId
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
    resetQueryForm() {
      this.listQuery = {
        taskName: '',
        agwId: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'id',
        order: 'desc'
      }
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.resourceEditForm.resetFields()
      this.resourceEditForm.frequencyDay = ''
      this.resourceEditForm.frequencyHour = ''
      this.resourceEditForm.frequencyMinute = ''
      this.resourceEditForm.frequencySecond = ''
    },
    findDeviceListExcludeIds(id, row) {
      this.agwIds.agwId = this.edgeDeviceId
      this.agwIds.id = id
      findDeviceListExcludeId(this.agwIds)
        .then((response) => {
          if (response.success) {
            this.deviceList = response.data
            this.editDialogTitle = '修改任务调度'
            this.$nextTick(() => {
              this.resourceEditForm.id = row.id
              this.resourceEditForm.agwId = row.agwId
              this.resourceEditForm.taskName = row.taskName
              this.resourceEditForm.deviceNameList = row.deviceName.split(',')
              this.resourceEditForm.deviceName = row.deviceName
              this.resourceEditForm.frequency = row.frequency
              this.resourceEditForm.frequencyDay = row.frequencyDay
              this.resourceEditForm.frequencyHour = row.frequencyHour
              this.resourceEditForm.frequencyMinute = row.frequencyMinute
              this.resourceEditForm.frequencySecond = row.frequencySecond
            })
          } else {
            this.deviceList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    openPartnerEditDialog(actionType, row) {
      this.resourceEditForm.agwId = this.edgeDeviceId
      this.findDeviceList()
      this.currentActionType = actionType
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增任务调度'
      } else if (this.currentActionType === 'edit') {
        this.findDeviceListExcludeIds(row.id, row)
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate((valid) => {
        if (valid) {
          if (this.currentActionType === 'add') {
            this.resourceEditForm.id = ''
            saveResource(this.joinData(this.resourceEditForm))
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
          } else {
            // console.log(this.joinData(this.resourceEditForm))
            updateResource(this.joinData(this.resourceEditForm))
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: '更新成功',
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
          this.neTaskId.id = row.id
          deletePartner(this.neTaskId)
            .then((response) => {
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
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    findDeviceListExcludeId(id) {
      this.agwIds.agwId = this.edgeDeviceId
      this.agwIds.id = id
      findDeviceListExcludeId(this.agwIds)
        .then((response) => {
          if (response.success) {
            this.deviceList = response.data
          } else {
            this.deviceList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    findDeviceList() {
      this.agwIds.agwId = this.edgeDeviceId
      findDeviceList(this.agwIds)
        .then((response) => {
          if (response.success) {
            this.deviceList = response.data
          } else {
            this.deviceList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    splitData(obj) {
      return {
        deviceNameList: obj.deviceName.split(',')
      }
    },
    joinData(obj) {
      obj.deviceName = obj.deviceNameList.join(',')
      return obj
    }
  }
}
</script>
<style>
.el-divider__text {
  position: absolute;
  background-color: #fff;
  padding: 0 20px;
  color: #30313347;
}
.el-divider--horizontal {
  display: block;
  height: 2px;
  width: 100%;
  margin: 24px 0;
}
</style>
<style lang="scss" >
@import '~@/styles/variables.scss';
.el-loading-spinner.el-loading-text  {
  color: $el-loading-spinner;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i  {
  color: $el-loading-spinner;
}
</style>
