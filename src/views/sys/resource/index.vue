<template>
  <div>
    <div v-if="!isChildren" class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm">
              <el-form-item>
                <el-tooltip content="刷新">
                  <el-button icon="el-icon-refresh" @click="refreshResourceTree"></el-button>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

      </div>
      <div class="block">
        <el-tree :data="resourceTreeDataList" node-key="id" default-expand-all :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }} </span>
            <div div="custom-siblings-index"></div>
            <div class="tree-node"> </div>
            <span></span>
            <span>
              <span style="width:40px;text-align: center;">{{data.resourceUrl}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span style="width:90px;text-align: center;">{{data.siblingsIndex}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span style="width:90px;text-align: center;">
              </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-tooltip content="新增" >
                <el-button class="filter-item" icon="el-icon-plus"   @click="openPartnerEditDialog('add',data)"> </el-button>
              </el-tooltip>
              <el-tooltip content="修改" placement="bottom" style="margin-left:1px" >
                <el-button @click="openPartnerEditDialog('edit',data)" size="small" :disabled="(data.parentResourceId === 0)" icon="el-icon-edit"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" style="margin-left:1px" >
                <el-button @click="deletePartner(data)" size="small" :disabled="(data.parentResourceId === 0)" icon="el-icon-delete"></el-button>
              </el-tooltip>
            </span>
          </span>
        </el-tree>
      </div>
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="feEdgeDeviceEditForm" :model="feEdgeDeviceEditForm" :rules="feDeviceAddressEditRules" label-width="100px" size="mini">
            <el-row>
              <el-col :span="22">
                <el-form-item label="父级资源" prop="parentResourceId">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.parentResourceName" :disabled="true" :maxlength="10000" />
                    <input type="hidden" v-model.trim="feEdgeDeviceEditForm.parentResourceId" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="资源名称" prop="resourceName">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.resourceName" :rows="2" maxlength="10" placeholder="不超过10个字符." />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="排序号" prop="siblingsIndex">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.siblingsIndex" :rows="2" placeholder="兄弟节点间的顺序." />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22" v-show="feEdgeDeviceEditForm.parentResourceId !==0">
                <el-form-item label="资源节点" prop="resourceNode">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.resourceNode" :rows="2" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="资源URL" prop="resourceUrl">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.resourceUrl" :rows="2" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="资源图标类名" prop="resourceIcon">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.resourceIcon" :rows="2" placeholder="例如：'fa-home' (来自http://www.fontawesome.com.cn/faicons)." />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" :loading="submiting"  @click="saveFeDeviceAddress">确 定</el-button>
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
  deletePartner
} from '@/api/sys/resource'
import { mapGetters } from 'vuex'

export default {
  name: 'Resource',
  data() {
    return {
      submiting: false,
      resourceTreeDataList: [],
      loadingResourceTreeDataList: false,
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
        resourceId: '',
        parentResourceId: '',
        parentResourceName: '',
        resourceName: '',
        permissionExpression: '',
        actionType: 0,
        resourceUrl: '',
        resourceNode: '',
        siblingsIndex: '',
        resourceIcon: ''
      },
      feDeviceAddressEditRules: {
        parentResourceId: [
          {
            required: true,
            message: '未选择父级资源!',
            trigger: 'blur'
          }
        ],
        resourceName: [
          {
            required: true,
            message: '请输入资源名称!',
            trigger: 'blur'
          }
        ],
        siblingsIndex: [
          {
            required: true,
            message: '请输资源排序号!'
          },
          {
            validator: (rule, value, callback) => {
              if (!/^\d+$/.test(value)) {
                callback('排序号必须是整数!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        resourceNode: [
          {
            required: true,
            message: '请输入资源节点!',
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
        resourceId: ''
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
    this.refreshResourceTree()
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  methods: {
    refreshResourceTree() {
      this.loadingResourceTreeDataList = true
      getList(this.listQuery).then(response => {
        if (response.success) {
          this.resourceTreeDataList = response.data
        } else {
          this.resourceTreeDataList = []
        }
        this.loadingResourceTreeDataList = false
      })
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.feEdgeDeviceEditForm.resetFields()
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      if (row.parentResourceId === 0) {
        this.feEdgeDeviceEditForm.resourceNode = ' '
      }
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增资源'
        this.$nextTick(() => {
          this.feEdgeDeviceEditForm.parentResourceId = row.id
          this.feEdgeDeviceEditForm.parentResourceName = row.label
        })
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改资源'
        this.$nextTick(() => {
          this.feEdgeDeviceEditForm.resourceId = row.id
          this.feEdgeDeviceEditForm.resourceName = row.label
          this.feEdgeDeviceEditForm.parentResourceId = row.parentResourceId
          this.feEdgeDeviceEditForm.parentResourceName = row.parentResourceName
          this.feEdgeDeviceEditForm.permissionExpression =
            row.permissionExpression
          this.feEdgeDeviceEditForm.actionType = row.actionType
          this.feEdgeDeviceEditForm.resourceNode = row.resourceNode
          this.feEdgeDeviceEditForm.resourceUrl = row.resourceUrl
          this.feEdgeDeviceEditForm.siblingsIndex = row.siblingsIndex
          this.feEdgeDeviceEditForm.resourceIcon = row.resourceIcon
        })
      }
      this.editDialogVisible = true
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
                  this.refreshResourceTree()
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
                  this.refreshResourceTree()
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
    deletePartner(params) {
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deviceId.resourceId = params.id
          deletePartner(this.deviceId)
            .then(response => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.refreshResourceTree()
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
.block {
  width: 95%;
  height: auto;
  border: 1px solid #aca6a640;
  box-shadow: 1px 4px 6px #aca6a640;
}
.el-tree-node__content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 34px;
  cursor: pointer;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  white-space: normal;
  font-size: 14px;
  vertical-align: middle;
  white-space: normal;
  font-size: 14px;
  width: 100%;
  margin-left: -50px;
  padding-left: 50px;
  box-sizing: border-box;
}
.tree-node {
  width: 50px;
  text-align: center;
  /* display: inline-block; */
  /* vertical-align: middle; */
  float: right;
  /* padding: 5px; */
  /* box-sizing: border-box; */
  /* line-height: 1; */
  min-height: 30px;
}
.custom-label {
  width: auto;
  display: inline-block;
  vertical-align: middle;
  float: left;
}
.custom-siblings-index {
  width: 40px;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  float: right;
  padding: 5px;
  box-sizing: border-box;
  line-height: 1;
  min-height: 30px;
}
.el-form-item-tips {
  font-size: 10px !important;
  color: #605e5e66;
  margin-left: 5px;
}
</style>
