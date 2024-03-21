<template>
  <div>
    <div v-if="!isChildren" class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip  content="新增">
                  <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add','')" />
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.username" :maxlength="20" placeholder="用户名" />
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.realName" :maxlength="20" placeholder="姓名" />
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
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="用户名" prop="username" align="center" />
        <el-table-column label="姓名" prop="realName" width="80" align="center" />
        <el-table-column label="租户名称" prop="tenantName" align="center" />
        <el-table-column label="用户角色" prop="roleNameList" align="center">
          <template scope="scope">
            <span v-for="item in scope.row.roleNameList" :key="item.roleName" class="el-tag-small" type="success" effect="plain">{{ item.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template scope="scope">
            <svg-icon :icon-class="scope.row.status === 1 ? 'unlock' : 'lock'" />
            {{ scope.row.status ===1 ?'启用' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column label="操作权限" prop="operationPermission" align="center">
          <template scope="scope">
            <svg-icon :icon-class="scope.row.operationPermission === 1 ? 'edit' : 'setting' " />
            {{ scope.row.operationPermission ===1 ? '查看' : '管理' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="insertTime" align="center" />
        <el-table-column  label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom">
              <el-button size="small" icon="el-icon-edit" class="background-color: transparent !important; elbuttondefault " @click="openPartnerEditDialog('edit',scope.row)" >修改</el-button>
            </el-tooltip>
            <el-tooltip content="修改密码" placement="bottom" style="margin-left:1px">
              <el-button v-show="eabled" size="small" :disabled="!eabled" icon="el-icon-edit-outline" class="background-color: transparent !important;elbuttondefault" @click="openChangePwdDialog(scope.row)" >修改密码</el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-delete" class="background-color: transparent; elbuttondefault" @click="deletePartner(scope.row)" >删除</el-button>>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="feEdgeDeviceEditForm" :model="feEdgeDeviceEditForm" :rules="feDeviceAddressEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="用户名" prop="username">
                  <el-col :span="22">
                    <el-input v-if="'add'=== currentActionType" v-model.trim="feEdgeDeviceEditForm.username" :maxlength="10000" />
                    <el-input v-else v-model.trim="feEdgeDeviceEditForm.username" :disabled="true" :maxlength="10000" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="姓名" prop="realName">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.realName" :maxlength="10000" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-if="userName =='admin'" :span="20">
                <el-form-item label="租户名称" prop="tenantId">
                  <el-col :span="22">
                    <el-select v-model.trim="feEdgeDeviceEditForm.tenantId" placeholder="请选择">
                      <el-option v-for="item in tenantList" :key="item.id" :label="item.tenantName" :value="item.id" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="用户角色" prop="roleId">
                  <el-col :span="22">
                    <el-select v-model.trim="feEdgeDeviceEditForm.roleId" placeholder="请选择">
                      <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="状态" prop="status">
                  <el-col :span="22">
                    <el-select v-model.trim="feEdgeDeviceEditForm.status" style="width:100%">
                      <el-option label="启用" :value="1" />
                      <el-option label="禁用" :value="0" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="currentActionType == 'add'">
              <el-col :span="20">
                <el-form-item label="用户密码" prop="password">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.password" type="password" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="currentActionType == 'add'">
              <el-col :span="20">
                <el-form-item label="重复密码" prop="repassword">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.repassword" type="password" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="操作权限" prop="operationPermission">
                  <el-col :span="22">
                    <el-select v-model.trim="feEdgeDeviceEditForm.operationPermission" style="width:100%">
                      <el-option label="管理" :value="0" />
                      <el-option label="查看" :value="1" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="手机号" prop="telephone">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.telephone" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="邮箱" prop="eMail">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.eMail" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveFeDeviceAddress">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="editDialogTitle" :visible.sync="changePwdDialogVisible" :close-on-click-modal="false" @close="closeChangePwdDialog">
        <div>
          <el-form ref="changePwdForm" :model="changePwdForm" :rules="changePwdRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="用户名" prop="username">
                  <el-col :span="22">
                    <span>
                      {{ changePwdForm.username }}
                    </span>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="用户密码" prop="password">
                  <el-col :span="22">
                    <el-input v-model.trim="changePwdForm.password" type="password" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="重复密码" prop="repassword">
                  <el-col :span="22">
                    <el-input v-model.trim="changePwdForm.repassword" type="password" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeChangePwdDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" :loading="submiting" @click="changePasswd">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import {
  saveFeDeviceAddress,
  editFeDeviceAddress,
  getList,
  deletePartner,
  loadAllTenantList,
  loadAllRoleList,
  changePasswd
} from '@/api/sys/user'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        username: '',
        realName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      length: 0,
      disabled: true,
      abled: true,
      unable: true,
      editDialogVisible: false,
      feEdgeDeviceEditForm: {
        id: '',
        username: '',
        roleId: '',
        status: '',
        password: '',
        repassword: '',
        realName: '',
        tenantId: '',
        telephone: '',
        eMail: '',
        operationPermission: ''
      },
      feDeviceAddressEditRules: {
        username: [
          {
            required: true,
            message: '请输入用户名!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!/^[a-zA-Z]{1}[a-zA-Z0-9_]{2,19}$/.test(value)) {
                callback('用户名必须由字母开头,3~20个字母、数字及下划线组成!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        roleId: [
          {
            required: true,
            message: '请选择角色!',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入账户密码!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\sA-Za-z0-9])\S{8,}$/.test(
                  value
                )
              ) {
                callback('密码由至少8位大小写字母、数字和特殊符号组成!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        repassword: [
          {
            required: true,
            message: '请重新输入账户密码!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\sA-Za-z0-9])\S{8,}$/.test(
                  value
                )
              ) {
                callback('密码由至少8位大小写字母、数字和特殊符号组成!')
              } else if (value !== this.feEdgeDeviceEditForm.password) {
                callback('两次输入密码不一致!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        realName: [
          {
            required: true,
            message: '请输入姓名!',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择状态!',
            trigger: 'change'
          }
        ],
        operationPermission: [
          {
            required: true,
            message: '请选择操作权限!',
            trigger: 'change'
          }
        ],
        tenantId: [
          {
            required: true,
            message: '请选择租户类型!',
            trigger: 'change'
          }
        ],
        telephone: [
          {
            validator: (rule, value, callback) => {
              if (
                !/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(
                  value
                ) &&
                value !== ''
              ) {
                callback('手机号码格式不正确!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        eMail: [
          {
            validator: (rule, value, callback) => {
              if (
                !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
                  value
                ) &&
                value !== ''
              ) {
                callback('邮箱格式不正确!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      cityData: '',
      feEdgeCloudList: [],
      item: '',
      props: {
        label: 'name',
        value: 'name',
        children: 'cities'
      },
      value: {},
      idList: [],
      deviceId: {
        id: ''
      },
      tenantList: [],
      roleList: [],
      roleStrList: [],
      userName: '',
      changePwdDialogVisible: false,
      changePwdForm: {
        id: '',
        username: '',
        password: '',
        repassword: ''
      },
      changePwdRules: {
        password: [
          {
            required: true,
            message: '请输入账户密码!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\sA-Za-z0-9])\S{8,}$/.test(
                  value
                )
              ) {
                callback('密码由至少8位大小写字母、数字和特殊符号组成!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        repassword: [
          {
            required: true,
            message: '请重新输入账户密码!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\sA-Za-z0-9])\S{8,}$/.test(
                  value
                )
              ) {
                callback('密码由至少8位大小写字母、数字和特殊符号组成!')
              } else if (value !== this.changePwdForm.password) {
                callback('两次输入密码不一致!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      eabled: true,
      roleId: ''
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.isChildren = this.$route.meta.isChildren
    this.getList()
    this.loadAllTenantList()
    this.loadAllRoleList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then((response) => {
        if (response.success) {
          this.list = response.data
          this.total = response.totalRowCount
          this.userName = response.userName
          this.roleId = response.roleId
          this.userId = response.userId
          if (this.roleId === '2' || this.roleId === 2 || this.userName === 'admin') {
            this.eabled = true
          } else {
            this.eabled = false
          }
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
        this.roleName = this.value.username
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
        username: '',
        realName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      }
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.feEdgeDeviceEditForm.resetFields()
      this.multipleSelection = []
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增用户'
        this.editDialogVisible = true
      } else if (this.currentActionType === 'edit') {
        if (row.username === 'admin') {
          this.$notify({
            title: '警告',
            message: '管理员账号不能修改!',
            type: 'warning'
          })
        } else {
          this.editDialogTitle = '修改用户'
          this.$nextTick(() => {
            this.feEdgeDeviceEditForm.id = row.id
            this.feEdgeDeviceEditForm.username = row.username
            this.feEdgeDeviceEditForm.realName = row.realName
            this.feEdgeDeviceEditForm.tenantId = row.tenantId
            this.feEdgeDeviceEditForm.roleId = row.roleId
            this.feEdgeDeviceEditForm.status = row.status
            this.feEdgeDeviceEditForm.updateTime = row.updateTime
            this.feEdgeDeviceEditForm.telephone = row.telephone
            this.feEdgeDeviceEditForm.eMail = row.eMail
            this.feEdgeDeviceEditForm.operationPermission =
              row.operationPermission
          })
          this.editDialogVisible = true
        }
      }
    },
    openChangePwdDialog(row) {
      this.editDialogTitle = '修改密码'
      this.changePwdDialogVisible = true
      this.$nextTick(() => {
        this.changePwdForm.id = row.id
        this.changePwdForm.username = row.username
      })
    },
    closeChangePwdDialog() {
      this.changePwdDialogVisible = false
      this.$refs.changePwdForm.resetFields()
    },
    saveFeDeviceAddress() {
      this.$refs['feEdgeDeviceEditForm'].validate((valid) => {
        if (valid) {
          if (this.currentActionType === 'add') {
            saveFeDeviceAddress(this.feEdgeDeviceEditForm)
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
            editFeDeviceAddress(this.feEdgeDeviceEditForm)
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
    loadAllTenantList() {
      loadAllTenantList()
        .then((response) => {
          if (response.success) {
            this.tenantList = response.data
          } else {
            this.tenantList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    loadAllRoleList() {
      loadAllRoleList()
        .then((response) => {
          if (response.success) {
            this.roleList = response.data
          } else {
            this.roleList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    deletePartner(row) {
      if (row.username === 'admin') {
        this.$notify({
          title: '警告',
          message: '管理员账号不能删除!',
          type: 'warning'
        })
      } else {
        if (row.id === this.userId) {
          this.$notify({
            title: '警告',
            message: '当前用户正在登录，不可删除！',
            type: 'warning'
          })
        } else {
          this.$confirm('请确认是否删除该记录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deviceId.id = row.id
              deletePartner(this.deviceId)
                .then((response) => {
                  var result = response.data
                  if (response.success) {
                    this.$notify({
                      message: '删除成功!',
                      type: 'success',
                      duration: this.$store.state.settings.duration
                    })
                    this.getList()
                  } else {
                    this.$notify.error(result.message)
                  }
                })
                .catch((error) => {
                  console.log(error)
                })
            })
            .catch(() => {})
        }
      }
    },
    changePasswd() {
      this.$refs['changePwdForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确定要修改该用户的密码?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            changePasswd(this.changePwdForm)
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.closeChangePwdDialog()
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
        }
      })
    }
  }
}
</script>
