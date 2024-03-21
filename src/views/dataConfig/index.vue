<template>
  <div class="app-container">
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
              <el-tooltip  content="多行选择删除">
                <el-button class="filter-item" icon="el-icon-delete" @click="deleteAllSelect()" />
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="返回" placement="bottom">
                <el-button v-if='path === "/dataDevice"' @click="$router.back(-1)">
                  <svg-icon icon-class="back">返回</svg-icon>
                </el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

    </div>
    <el-table ref="dataConfigTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="网关名称" prop="edgeDeviceName" align="center" />
      <el-table-column label="设备名称" prop="deviceName" width="100" align="center" />
      <el-table-column label="设备属性" prop="deviceModel" align="center" />
      <el-table-column label="属性单位" prop="modelUnit" align="center" />
      <el-table-column  label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
            <el-button size="small" icon="el-icon-delete" @click="deleteDataDevice(scope.row)" class="elbuttondefault"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
      <div>
        <el-form ref="dataDeviceEditForm" :model="dataDeviceEditForm" :rules="dataDeviceEditRules" label-width="100px" size="mini" @submit.native.prevent>
          <el-row>
            <el-col :span="20">
              <el-form-item label="网关名称" prop="egwId">
                <el-col :span="22">
                  <el-select v-model.trim="dataDeviceEditForm.egwId" placeholder="请选择" @change="egwIdChange()">
                    <el-option v-for="item in egwOptions" :key="item.edgeDeviceId" :label="item.edgeDeviceName" :value="item.edgeDeviceId" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="设备名称" prop="deviceName">
                <el-col :span="22">
                  <el-select v-model.trim="dataDeviceEditForm.deviceName" placeholder="请选择" @change="deviceChange()">
                    <el-option v-for="item in deviceOptions" :key="item.nid" :label="item.deviceName" :value="{value :item.deviceName, select: item.profileNid}" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="设备属性" prop="deviceModel">
                <el-col :span="22">
                  <el-select v-model.trim="dataDeviceEditForm.deviceModel" placeholder="请选择" multiple>
                    <el-option v-for="item in deviceModelOptions" :key="item.nid" :label="item.name" :value="{ value: item.name, unit: item.resUnit }" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveRoleResourceConfig">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  userEdgeDeviceList,
  getNeDeviceList,
  getNeDeviceResouecesList,
  saveRoleResourceConfig,
  deleteDataDevice
} from '@/api/dataConfig'
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
        relationId: this.$route.query.relationId,
        path: this.$route.path,
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      editDialogVisible: false,
      dataDeviceEditForm: {
        egwId: '',
        deviceName: '',
        deviceModel: '',
        boardType: 1,
        relationId: this.$route.query.relationId
      },
      dataDeviceEditRules: {
        egwId: [
          {
            required: true,
            message: '请选择网关名称!',
            trigger: 'change'
          }
        ],
        deviceName: [
          {
            required: true,
            message: '请选择设备名称!',
            trigger: 'change'
          }
        ],
        deviceModel: [
          {
            required: true,
            message: '请选择设备属性!',
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      deviceOptions: [],
      egwOptions: [],
      deviceModelOptions: [],
      relationId: this.$route.query.relationId,
      path: this.$route.path,
      boardType: 1,
      deviceIdList: [],
      deviceId: ''
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.getList()
    this.integw()
  },
  methods: {
    integw() {
      userEdgeDeviceList().then((res) => {
        if (res.success) {
          this.egwOptions = res.data
        }
      })
    },
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
    // resetQueryForm() {
    //   this.listQuery = {
    //     roleName: '',
    //     roleCode: '',
    //     currentPage: 1,
    //     pageSize: 10,
    //     orderby: 'createTime',
    //     order: 'desc'
    //   }
    // },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.dataDeviceEditForm.resetFields()
      this.multipleSelection = []
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增配置'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改配置'
        this.$nextTick(() => {})
      }
      this.editDialogVisible = true
    },
    saveRoleResourceConfig() {
      this.$refs['dataDeviceEditForm'].validate((valid) => {
        if (valid) {
          if (this.path === '/dataConfig') {
            this.boardType = 1
          }
          if (this.path === '/dataDevice') {
            this.boardType = 2
          }
          if (this.currentActionType === 'add') {
            let success = true
            this.dataDeviceEditForm.deviceModel.forEach((ele) => {
              const dataDevice = {
                egwId: this.dataDeviceEditForm.egwId,
                deviceName: this.dataDeviceEditForm.deviceName.value,
                deviceModel: ele.value,
                boardType: this.boardType,
                relationId: this.relationId,
                modelUnit: ele.unit
              }
              saveRoleResourceConfig(dataDevice)
                .then((response) => {
                  if (response.success) {
                    this.getList()
                  } else {
                    success = false
                  }
                })
                .catch((error) => {
                  console.log(error)
                })
            })
            if (success) {
              this.$notify({
                message: '保存成功',
                type: 'success',
                duration: this.$store.state.settings.duration
              })
              this.closeEditDialog()
            } else {
              this.$notify.error({
                title: '错误',
                message: '请求出错！'
              })
            }
          }
        } else {
          return false
        }
      })
    },
    deleteDataDevice(row) {
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDataDevice(row.deviceId).then((response) => {
          if (response.success) {
            this.$notify({
              message: '删除成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.getList()
          }
        })
      })
    },
    deleteOne(row) {
      const deviceId = {
        id: JSON.stringify(row.deviceId)
      }
      deleteDataDevice(deviceId)
        .then((response) => {
          var result = response.data
          if (response.success) {
          } else {
            this.$notify.error(result.message)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    egwIdChange() {
      const query = {
        agwId: this.dataDeviceEditForm.egwId
      }
      getNeDeviceList(query).then((res) => {
        if (res.success) {
          this.deviceOptions = res.data
          this.dataDeviceEditForm.deviceName = ''
        }
      })
    },
    deviceChange() {
      const query = {
        egwId: this.dataDeviceEditForm.egwId,
        nid: this.dataDeviceEditForm.deviceName.select,
        deviceName: this.dataDeviceEditForm.deviceName.value,
        relationId: this.$route.query.relationId
      }
      getNeDeviceResouecesList(query).then((res) => {
        if (res.success) {
          this.deviceModelOptions = res.data
          this.dataDeviceEditForm.deviceModel = ''
        }
      })
    },
    handleSelectionChange(val) {
      console.info(val)
      this.deviceIdList = []
      this.multipleSelection = val
      this.multipleSelection.forEach((dataDevice) => {
        this.deviceIdList.push(dataDevice.deviceId)
      })
      this.deviceId = this.deviceIdList.join(',')
    },
    deleteAllSelect() {
      this.$confirm('请确认是否删除该批记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDataDevice(this.deviceId).then((response) => {
            if (response.success) {
              this.$notify({
                message: '删除成功',
                type: 'success',
                duration: this.$store.state.settings.duration
              })
              this.getList()
            }
          })
        })
        .catch(() => {})
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
.el-tree-roleresources {
  height: 300px;
  overflow: hidden;
  overflow-y: scroll;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #00aa72;
  border-color: #00aa72;
}
</style>
