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
                <el-input v-model.trim="listQuery.roleName" :maxlength="20" placeholder="角色名称" />
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
        <el-table-column label="角色名称" prop="roleName" align="center" />
        <el-table-column label="角色描述" prop="description" width="100" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column  label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom">
              <el-button size="small" icon="el-icon-edit" @click="openPartnerEditDialog('edit',scope.row)" class="elbuttondefault" >修改</el-button>
            </el-tooltip>
            <el-tooltip content="角色配置资源" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-setting" @click="loadRoleResourceDataList(1500,scope.row.id)" class="elbuttondefault">角色配置资源</el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-delete" @click="deletePartner(scope.row)" class="elbuttondefault">删除</el-button>

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
                <el-form-item label="角色名称" prop="roleName">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.roleName" :maxlength="10000" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="角色描述" prop="description">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.description" type="textarea" :rows="2" />
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
          <el-tree
            ref="roleResourceViewTree"
            v-loading="loadingRoleResourceDataList"
            element-loading-text="拼命加载中..."
            element-loading-class="el-loading-mask-opacity"
            :class="{loading: loadingRoleResourceDataList}"
            class="el-tree-roleresources"
            :data="roleResourceDataList"
            :props="defaultProps"
            node-key="id"
            show-checkbox
            default-expand-all
            expand-on-click-node
            :render-content="renderRoleResourceTreeNode"
          />
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeChangePwdDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveRoleResourceConfig">确 定</el-button>
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
  loadRoleResourceDataList,
  saveRoleResourceConfig
} from '@/api/sys/role'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        roleName: '',
        roleCode: '',
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
        roleName: '',
        roleCode: 'commamdUser',
        description: ''
      },
      feDeviceAddressEditRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称!',
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      item: '',
      value: {},
      idList: [],
      deviceId: {
        id: ''
      },
      changePwdDialogVisible: false,
      loadingRoleResourceDataList: false,
      roleResourceDataList: [],
      checkedResourceIdList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedList: {
        id: '',
        resourceIds: ''
      },
      roleResourceViewTree: []
    }
  },
  created() {
    this.isChildren = this.$route.meta.isChildren
    this.getList()
  },
  computed: {
    ...mapGetters(['operationPermission'])
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
        roleName: '',
        roleCode: '',
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
        this.editDialogTitle = '新增角色'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改角色'
        this.$nextTick(() => {
          this.feEdgeDeviceEditForm.id = row.id
          this.feEdgeDeviceEditForm.roleName = row.roleName
          this.feEdgeDeviceEditForm.description = row.description
          this.feEdgeDeviceEditForm.roleType = row.roleType
        })
      }
      this.editDialogVisible = true
    },

    closeChangePwdDialog() {
      this.changePwdDialogVisible = false
    },
    saveFeDeviceAddress() {
      this.$refs['feEdgeDeviceEditForm'].validate(valid => {
        if (valid) {
          if (this.currentActionType === 'add') {
            saveFeDeviceAddress(this.feEdgeDeviceEditForm)
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
            editFeDeviceAddress(this.feEdgeDeviceEditForm)
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
      if (row.roleType === 0) {
        this.$notify({
          title: '警告',
          message: '系统角色不能删除!',
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
              .then(response => {
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
              .catch(error => {
                console.log(error)
              })
          })
          .catch(() => {})
      }
    },
    renderRoleResourceTreeNode(h, param) {
      return (
        <span class='custom-tree-node'>
          <span>&nbsp;{param.node.label}</span>
        </span>
      )
    },
    loadRoleResourceDataList(loading, id) {
      this.deviceId.id = id
      this.editDialogTitle = '角色配置资源'
      this.changePwdDialogVisible = true
      this.loadingRoleResourceDataList = true
      loadRoleResourceDataList(this.deviceId).then(response => {
        if (response.success) {
          this.roleResourceDataList = response.allResourceList
          this.checkedResourceIdList = response.checkedResourceIdList
          this.$nextTick(() => {
            this.$refs.roleResourceViewTree.setCheckedKeys(
              response.checkedResourceIdList
            )
          })
        } else {
          this.roleResourceDataList = []
          this.checkedResourceIdList = []
        }
        this.loadingRoleResourceDataList = false
      })
    },
    saveRoleResourceConfig() {
      const id = this.deviceId.id
      const checkedKeys = this.$refs.roleResourceViewTree.getCheckedKeys()
      const checkedResourceIds = checkedKeys.sort().join(',')
      console.info(checkedResourceIds)
      console.info(this.checkedResourceIdList.sort().join(','))
      if (checkedResourceIds === this.checkedResourceIdList.sort().join(',')) {
        this.$notify({
          title: '警告',
          message: '配置没有改变,无需保存!',
          type: 'warning'
        })
      } else {
        this.checkedList.id = id
        this.checkedList.resourceIds = checkedResourceIds
        saveRoleResourceConfig(this.checkedList)
          .then(response => {
            if (response.success) {
              this.$notify({
                message: '保存成功',
                type: 'success',
                duration: this.$store.state.settings.duration
              })
              this.loadRoleResourceDataList(1500, id)
              this.changePwdDialogVisible = false
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
    }
  }
}
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-roleresources{
  height: 300px;
	overflow: hidden;
	overflow-y: scroll;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
	background-color: #00AA72;
	border-color: #00AA72;
}
</style>
