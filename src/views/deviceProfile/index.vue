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
                <el-input v-model.trim="listQuery.profileName" :maxlength="20" placeholder="名称" />
              </el-form-item>
              <el-form-item>
                <el-tooltip content="重置">
                  <el-button icon="el-icon-refresh" @click="resetQueryForm"/>
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
        <el-table-column label="名称" prop="profileName" align="center" />
        <el-table-column label="厂商" prop="manufacturer" align="center" />
        <el-table-column label="型号" prop="model" align="center" />
        <el-table-column label="描述" prop="description" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="操作" width="450" align="center">
          <template slot-scope="scope">
            <el-tooltip  content="修改" placement="bottom">
              <el-button size="small" icon="el-icon-edit" @click="openPartnerEditDialog('edit',scope.row)" class="elbuttondefault" />
            </el-tooltip>
            <el-tooltip content="配置资源属性" placement="bottom">
              <el-button size="small" icon="el-icon-setting" @click="jump(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip content="复制设备模型" placement="bottom">
              <el-button size="small" icon="el-icon-document-copy" @click="openPartnerEditDialog('copy',scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip  content="删除" placement="bottom">
              <el-button size="small" :disabled="scope.row.isUsed" icon="el-icon-delete" @click="deletePartner(scope.row)" class="elbuttondefault"/>
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
                <el-form-item label="名称" prop="profileName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.profileName" :disabled="resourceEditForm.isUsed" :maxlength="10000" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="厂商" prop="manufacturer">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.manufacturer" :maxlength="10000" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="型号" prop="model">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.model" :maxlength="10000" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="描述" prop="description">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.description" :maxlength="10000" />
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
import { mapGetters } from 'vuex'
import {
  getList,
  deletePartner,
  addResource,
  updateResource,
  addDevice
} from '@/api/profile'
// import {
//   getList
// } from '@/api/deviceResource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DeviceProfile',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        profileName: '',
        tenantId: '',
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
        nid: '',
        profileName: '',
        resourceReadWrites: '',
        manufacturer: '',
        model: '',
        description: '',
        jsonLabels: '',
        isUsed: false
      },
      resourceEditRules: {
        profileName: [
          {
            required: true,
            message: '请输入名称!',
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      deviceId: {
        nid: ''
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
    ...mapGetters(['operationPermission'])
  },
  created() {
    if (!this.isChildren) {
      this.Query()
    }
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
        // console.log(this.isChildren)
        if (!this.isChildren) {
          this.returnQuery()
        }
        this.listLoading = false
      })
    },
    returnQuery() {
      this.$router.push(
        `/deviceProfile?profileName=${this.listQuery.profileName}&currentPage=${this.listQuery.currentPage}&pageSize=${this.listQuery.pageSize}`
      )
    },
    Query() {
      this.listQuery.profileName = this.$route.query.profileName || ''
      this.listQuery.currentPage = +this.$route.query.currentPage || 1
      this.listQuery.pageSize = +this.$route.query.pageSize || 10
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
        profileName: '',
        tenantId: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      }
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.resourceEditForm.resetFields()
      this.dynamicTags = []
      this.resourceEditForm.jsonLabels = []
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增设备模型'
        this.resourceEditForm.isUsed = false
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改设备模型'
        this.$nextTick(() => {
          this.resourceEditForm.nid = row.nid
          this.resourceEditForm.profileName = row.profileName
          this.resourceEditForm.manufacturer = row.manufacturer
          this.resourceEditForm.model = row.model
          this.resourceEditForm.description = row.description
          this.resourceEditForm.isUsed = row.isUsed
          if (row.jsonLabels === 'null' || row.jsonLabels === '') {
            row.jsonLabels = null
          }
          this.dynamicTags =
            row.jsonLabels === null ? [] : row.jsonLabels.split(',')
        })
      } else if (this.currentActionType === 'copy') {
        this.editDialogTitle = '复制设备模型'
        this.resourceEditForm.isUsed = false
        this.$nextTick(() => {
          this.resourceEditForm.nid = row.nid
          this.resourceEditForm.profileName = row.profileName
          this.resourceEditForm.manufacturer = row.manufacturer
          this.resourceEditForm.model = row.model
          this.resourceEditForm.description = row.description
          // this.resourceEditForm.isUsed = row.isUsed
          if (row.jsonLabels === 'null' || row.jsonLabels === '') {
            row.jsonLabels = null
          }
          this.dynamicTags =
            row.jsonLabels === null ? [] : row.jsonLabels.split(',')
        })
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate(valid => {
        if (valid) {
          this.resourceEditForm.jsonLabels = this.dynamicTags.toString()
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
          } else if (this.currentActionType === 'edit') {
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
          } else if (this.currentActionType === 'copy') {
            addResource(this.resourceEditForm)
              .then(response => {
                if (response.success) {
                  // this.closeEditDialog()
                  // this.getList()
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
                addDevice(this.resourceEditForm).then((response) => {
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
          this.deviceId.nid = row.nid
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
      this.$router.push(`/resources?profileNid=${row.nid}&isUsed=${row.isUsed}`)
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
