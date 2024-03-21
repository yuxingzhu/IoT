<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip content="新增">
                  <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add','')" />
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="网桥名称" prop="bridgeName" align="center" />
        <el-table-column label="地址" prop="ipAddress" align="center" />
        <el-table-column label="子网掩码" prop="subnetMask" align="center" />
        <el-table-column label="桥接网口" prop="bridgePort" width="150" align="center" />
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-tooltip  content="删除" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-delete" @click="deletePartner(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="bridgeForm" :model="bridgeForm" :rules="feDeviceAddressEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网桥名称" prop="bridgeName">
                  <el-col :span="22">
                    <el-input v-model.trim="bridgeForm.bridgeName" :maxlength="200" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="地址" prop="ipAddress">
                  <el-col :span="22">
                    <el-input v-model.trim="bridgeForm.ipAddress" :maxlength="200" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="子网掩码" prop="subnetMask">
                  <el-col :span="22">
                    <el-input v-model.trim="bridgeForm.subnetMask" :maxlength="200" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网桥接口" prop="bridgePort">
                  <el-col :span="22">
                    <el-select v-model.trim="bridgeForm.bridgePort" multiple style="width:100%">
                      <el-option v-for="item in groupList" :key="item.name" :label="item.name" :value="item.name" />
                    </el-select>
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
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
import {
  getList,
  saveBridge,
  deleteData,
  getBridge
} from '@/api/bridgeConfiguration'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

Vue.use(JsonViewer)
export default {
  name: 'BridgeConfiguration',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      ip: '',
      submiting: false,
      listLoading: false,
      groupList: [],
      listQuery: {
        agwId: '',
        currentPage: 1,
        pageSize: 10,
        orderby: '',
        order: 'desc'
      },
      edgeDeviceId: '',
      editDialogVisible: false,
      bridgeForm: {
        bridgeName: '',
        ipAddress: '',
        bridgePort: '',
        subnetMask: '',
        agwId: ''
      },
      feDeviceAddressEditRules: {
        bridgeName: [
          {
            required: true,
            message: '请输入网桥名称!',
            trigger: 'blur'
          }
        ],
        ipAddress: [
          {
            required: true,
            message: '请输入地址!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
              var valuedata = value
              if (reg.test(valuedata) == false) {
                callback('输入的ip地址格式不正确!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        subnetMask: [
          {
            required: true,
            message: '请输入子网掩码',
            trigger: 'blur'
          },
          {
            pattern: /^(?:[1-9]|[12][0-9]|3[012])$/,
            message: '子网掩码填写区间为1-32之间'
          }
        ],
        bridgePort: [
          {
            required: true,
            message: '请选择桥接网口!',
            trigger: 'blur'
          }
        ]
      },
      currentActionType: '',
      editDialogTitle: ''
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.initParams()
    this.getList()
  },
  methods: {
    initParams() {
      if (this.$route.query.edgeDeviceId !== undefined) {
        this.edgeDeviceId = this.$route.query.edgeDeviceId
        this.ip = this.$route.query.ip
      }
    },
    getList() {
      this.listLoading = true
      this.listQuery.agwId = this.edgeDeviceId
      this.bridgeForm.bridgePort = ''
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
    handleSelectionChange(val) {
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      this.bridgeForm.agwId = this.edgeDeviceId
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增网桥配置'
        this.listQuery.agwId = this.edgeDeviceId
        this.bridgeForm.bridgePort = ''
        this.groupList = []
        getBridge(this.listQuery).then((response) => {
          if (response.success) {
            response.groupList.forEach(element => {
              this.groupList.push({
                name: element
              })
            })
          }
        })
      }
      this.editDialogVisible = true
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.bridgeForm.resetFields()
      this.multipleSelection = []
    },
    saveFeDeviceAddress() {
      this.$refs['bridgeForm'].validate((valid) => {
        if (valid) {
          var con = this.bridgeForm.bridgePort
          this.bridgeForm.bridgePort = con.toString()
          this.bridgeForm.agwId = this.edgeDeviceId
          if (this.currentActionType === 'add') {
            saveBridge(this.bridgeForm)
              .then((response) => {
                if (response.success) {
                  this.closeEditDialog()
                  this.getList()
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
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
      var con = row.bridgePort
      this.bridgeForm.bridgePort = con.toString()
      this.bridgeForm.agwId = this.edgeDeviceId
      this.bridgeForm.bridgeName = row.bridgeName
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(row.id, this.bridgeForm)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.getList()
                this.connectionType = ''
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
<style >
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
}
.el-divider__text,
.el-link {
  font-weight: 500;
  font-size: 16px;
}
.el-divider__text {
  position: absolute;
  background-color: #fff;
  padding: 0 20px;
  color: #303133a1;
}
.shou {
  cursor: pointer;
  text-decoration: underline;
}
.el-switch__label--left {
  position: relative;
  left: 44px;
  color: #fff;
  z-index: -1111;
  margin-right: 3px;
}
.el-switch__label--right {
  position: relative;
  right: 44px;
  color: #fff;
  z-index: -1111;
  margin-left: 3px;
}
.el-switch__label.is-active {
  z-index: 1111;
  color: #fff;
}
.el-switch__label--left {
  position: relative;
  left: 46px;
  color: #fff;
  z-index: -1111;
}
.el-switch__label--right {
  position: relative;
  right: 46px;
  color: #fff;
  z-index: -1111;
}
.el-switch__label--right.is-active {
  z-index: 1111;
  color: #fff !important;
}
.el-switch__label--left.is-active {
  z-index: 1111;
  color: #605d5d !important;
}
.el-switch__label * {
  line-height: 1;
  font-size: 12px;
  display: inline-block;
}
.el-switch__core {
  margin: 0;
  position: relative;
  width: 40px;
  height: 18px;
  border: 1px solid #dcdfe6;
  outline: 0;
  border-radius: 9px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #dcdfe6;
  -webkit-transition: border-color 0.3s, background-color 0.3s;
  transition: border-color 0.3s, background-color 0.3s;
  vertical-align: middle;
}
.el-radio.is-bordered {
  border-radius: 4px;
  border: 0px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 40px;
}
.el-collapse {
  border: 1px solid #ebeef5;
}
.el-collapse-item__header.is-active {
  border-bottom-color: #ebeef5;
}
.el-collapse-item__header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 25px;
  line-height: 48px;
  background-color: #fff;
  color: #303133;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  font-size: 12px;
  font-weight: 500;
  -webkit-transition: border-bottom-color 0.3s;
  transition: border-bottom-color 0.3s;
  outline: 0;
  margin-left: 10px;
}
.el-collapse-item__content {
  font-size: 13px;
  color: #303133;
  line-height: 1.769230769230769;
  margin-left: 4px;
}
</style>
