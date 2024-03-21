<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="16" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-tooltip content="新增" >
                <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add','')" />
              </el-tooltip>
              <el-form-item>
                <el-input v-model.trim="listQuery.tenantName" :maxlength="20" placeholder="租户名称" />
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
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;" >
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="租户名称" prop="tenantName" align="center" />
        <el-table-column label="过期时间" prop="permissionTime" align="center" />
        <el-table-column label="创建时间" prop="insertTime" align="center" />
        <el-table-column  label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom">
              <el-button size="small" icon="el-icon-edit" class="background-color: transparent !important;elbuttondefault" @click="openPartnerEditDialog('edit',scope.row)" >修改</el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-delete" class="background-color: transparent;elbuttondefault" @click="deletePartner(scope.row)">删除</el-button>
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
                <el-form-item label="租户名称" prop="tenantName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.tenantName" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="过期时间" prop="permissionTime">
                  <el-col :span="22">
                    <el-date-picker v-model.trim="resourceEditForm.permissionTime" :picker-options="pickerOption" type="datetime" placeholder="选择过期时间" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
    </div>
    <router-view />
  </div>
</template>

<script>
import {
  getList,
  saveResource,
  updateResource,
  deletePartner
} from '@/api/sys/authority'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex' // secondary package based on el-pagination

export default {
  name: 'Authority',
  components: { Pagination },
  data() {
    return {
      pickerOptions: {},
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        tenantName: '',
        status: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'insertTime',
        order: 'desc'
      },
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      resourceEditForm: {
        id: '',
        tenantName: '',
        status: '0',
        permissionTime: ''
      },
      resourceEditRules: {
        tenantName: [
          {
            required: true,
            message: '请输入租户名称!',
            trigger: 'blur'
          }
        ],
        permissionTime: [
          {
            required: true,
            message: '请选择过期时间!',
            trigger: 'change'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      deviceId: {
        id: ''
      },
      placeholder: ''
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters(['operationPermission'])
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
        this.idList.push(this.value.id)
        this.deviceId.id = this.idList.toString()
      }
      if (this.length > 1) {
        this.abled = false
        this.disabled = true
        for (var i = 0; i < this.length; i++) {
          this.idList.push(this.multipleSelection[i].id)
        }
        this.deviceId.id = this.idList.toString()
      }
      if (this.length === 0) {
        this.abled = true
        this.disabled = true
      }
    },
    resetQueryForm() {
      this.listQuery = {
        tenantName: '',
        status: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'insertTime',
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
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增租户'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改租户'
        this.$nextTick(() => {
          this.resourceEditForm.id = row.id
          this.resourceEditForm.tenantName = row.tenantName
          this.resourceEditForm.permissionTime = row.permissionTime
        })
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate((valid) => {
        if (valid) {
          if (this.currentActionType === 'add') {
            saveResource(this.resourceEditForm)
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
          this.deviceId.id = row.id
          deletePartner(this.deviceId)
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
    }
  }
}
</script>
