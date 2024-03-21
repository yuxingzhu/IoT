<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="16" class="table-filter">
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
        <el-table-column label="型号" prop="gatewayModel" align="center" />
        <el-table-column label="设备版本" prop="deviceVersion" align="center" />
        <el-table-column label="厂商" prop="manufacturer" align="center" />
        <el-table-column label="设备归属权" prop="deviceOwnership" align="center" />
        <el-table-column label="网关架构" prop="architecture" align="center" />
        <el-table-column  label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom">
              <el-button size="small" icon="el-icon-edit" class="background-color: transparent !important; elbuttondefault" @click="openPartnerEditDialog('edit',scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-delete" class="background-color: transparent;  elbuttondefault" @click="deletePartner(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceEditRules" label-width="130px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网关型号" prop="gatewayModel">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.gatewayModel" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="厂商" prop="manufacturer">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.manufacturer" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网关架构" prop="architecture">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.architecture" placeholder="请选择">
                      <el-option label="X86" value="X86" />
                      <el-option label="ARM" value="ARM" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="是否开启网关认证" prop="isKong">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.isKong" placeholder="请选择">
                      <el-option label="是" :value="1" />
                      <el-option label="否" :value="0" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备版本" prop="manufadeviceVersioncturer">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.deviceVersion" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备归属权" prop="deviceOwnership">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.deviceOwnership" :maxlength="100" :placeholder="placeholder" />
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
import { getList, saveResource, deletePartner } from '@/api/gatewayType'
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
        currentPage: 1,
        pageSize: 10,
        orderby: 'id',
        order: 'desc'
      },
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      resourceEditForm: {
        id: '',
        gatewayModel: '',
        manufacturer: '',
        architecture: '',
        isKong: '',
        deviceVersion:'',
        deviceOwnership:''
      },
      resourceEditRules: {
        gatewayModel: [
          {
            required: true,
            message: '请输入网关型号!',
            trigger: 'blur'
          }
        ],
        manufacturer: [
          {
            required: true,
            message: '请输入厂商!',
            trigger: 'blur'
          }
        ],
        architecture: [
          {
            required: true,
            message: '请选择网关架构!',
            trigger: 'change'
          }
        ],
        isKong: [
          {
            required: true,
            message: '请选择是否开启网关认证!',
            trigger: 'change'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
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
        console.log(response,"486")
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
        currentPage: 1,
        pageSize: 10,
        orderby: 'id',
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
        this.editDialogTitle = '修改网关型号'
        this.$nextTick(() => {
          this.resourceEditForm.id = row.id
          this.resourceEditForm.gatewayModel = row.gatewayModel
          this.resourceEditForm.manufacturer = row.manufacturer
          this.resourceEditForm.architecture = row.architecture
          this.resourceEditForm.deviceVersion = row.deviceVersion
          this.resourceEditForm.deviceOwnership = row.deviceOwnership
          this.resourceEditForm.isKong = row.isKong === true ? 'true' : 'false'
        })
      } else if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增网关型号'
        this.resourceEditForm.id = ''
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate((valid) => {
        if (valid) {
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
          deletePartner(row.id)
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
<style>
.el-button--default{
  border-radius: 5px !important;
}
.elbuttondefault{
  background: white !important;
  color: #000000 !important;
}

</style>
