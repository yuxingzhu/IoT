<template>
  <div>
    <div v-if="!isChildren" class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="16" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-input v-model.trim="listQuery.modeName" :maxlength="20" placeholder="模板名称" />
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
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="模板名称" prop="modeName" align="center" />
        <el-table-column label="连接协议" prop="connectionProtocol" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column  label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="模板详情" placement="bottom">
              <el-button size="small" icon="el-icon-more" class="background-color: transparent !important; elbuttondefault" @click="openModelConn(scope.row)"/>
            </el-tooltip>
            <el-tooltip content="修改" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-edit" class="background-color: transparent !important; elbuttondefault" @click="openPartnerEditDialog('edit',scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-delete" class="background-color: transparent; elbuttondefault" @click="deletePartner(scope.row)" />

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
                <el-form-item label="模板名称" prop="modeName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.modeName" :maxlength="100" :placeholder="placeholder" />
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
import { getList, saveResource, deletePartner } from '@/api/model'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

export default {
  name: 'Model',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        modeName: '',
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
        id: '',
        modeName: ''
      },
      resourceEditRules: {
        modeName: [
          {
            required: true,
            message: '请输入模板名称!',
            trigger: 'blur'
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
        modeName: '',
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
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改模板名称'
        this.$nextTick(() => {
          this.resourceEditForm.id = row.id
          this.resourceEditForm.modeName = row.modeName
        })
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate(valid => {
        if (valid) {
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
    openModelConn(row) {
      this.$router.push(
        `/connModel?modeId=${row.id}&connectProtocol=${row.connectionProtocol}&profileNid=${row.profileId}`
      )
    }
  }
}
</script>
