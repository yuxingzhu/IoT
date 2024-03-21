<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="16" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip  content="新增">
                  <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add','')" >新增</el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.projectName" :maxlength="20" placeholder="项目名称" />
              </el-form-item>

              <el-form-item>
                <el-tooltip content="重置">
                  <el-button icon="el-icon-refresh" @click="resetQueryForm" />
                </el-tooltip>
                <el-tooltip content="搜索">
                  <el-button icon="el-icon-search" @click="getList"/>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="项目名称" prop="projectName" align="center" />
        <el-table-column label="项目描述" prop="projectDesc" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column  label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom">
              <el-button size="small" icon="el-icon-edit" class="background-color: transparent !important; elbuttondefault" @click="openPartnerEditDialog('edit',scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-delete" class="background-color: transparent; elbuttondefault" @click="deletePartner(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column></el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="项目名称" prop="projectName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.projectName" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="项目描述" prop="projectDesc">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.projectDesc" type="textarea" :rows="4" :maxlength="100" :placeholder="placeholder" />
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
} from '@/api/projectManage'
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
        projectName: '',
        currentPage: 1,
        pageSize: 10,
        orderBy: 'id',
        order: 'desc'
      },
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      resourceEditForm: {
        id: '',
        projectName: '',
        projectDesc: ''
      },
      resourceEditRules: {
        projectName: [
          {
            required: true,
            message: '请输入项目名称!',
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      projectId: {
        id: ''
      },
      placeholder: ''
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
        projectName: '',
        currentPage: 1,
        pageSize: 10,
        orderBy: 'id',
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
        this.editDialogTitle = '新增项目'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改项目'
        this.$nextTick(() => {
          this.resourceEditForm.id = row.id
          this.resourceEditForm.projectName = row.projectName
          this.resourceEditForm.projectDesc = row.projectDesc
        })
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate((valid) => {
        if (valid) {
          if (this.currentActionType === 'add') {
            this.resourceEditForm.id = ''
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
          this.projectId.id = row.id
          deletePartner(this.projectId)
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
    jump(row) {
      this.$router.push(`/aiotDevice?projectId=${row.id}`)
    }
  }
}
</script>
