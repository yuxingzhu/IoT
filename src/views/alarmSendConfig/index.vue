<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
              <el-tooltip content="添加" >
                <el-button icon="el-icon-plus" @click="handleCreate"/>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="告警发送人" prop="senderId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.senderId | senderIdFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送方式" prop="sendMode" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sendMode | sendModeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警类型" prop="alarmType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmType | alarmTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警级别" prop="alarmLevel" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmLevel | alarmLevelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center" >
        <template slot-scope="scope">
          <el-tooltip content="修改">
            <el-button icon="el-icon-edit" @click="handleUpdate(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button icon="el-icon-delete" @click="handleDelete(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini" @submit.native.prevent>
        <el-row v-show="false">
          <el-col>
            <el-form-item prop="configId">
              <input type="hidden" v-model.trim="temp.configId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="告警发送人" prop="senderIdList">
              <el-select v-model.trim="temp.senderIdList" multiple>
                <el-option v-for="item in senderIdList" :key="item.id" :label="item.realName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="告警发送方式" prop="sendModeList">
              <el-select v-model.trim="temp.sendModeList" multiple>
                <el-option v-for="item in sendModeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="告警类型" prop="alarmTypeList">
              <el-select v-model.trim="temp.alarmTypeList" multiple>
                <el-option v-for="item in alarmTypeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="告警级别" prop="alarmLevelList">
              <el-select v-model.trim="temp.alarmLevelList" multiple>
                <el-option v-for="item in alarmLevelList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getList,
  createData,
  updateData,
  deleteData,
  getUserList
} from '@/api/alarmSendConfig'
import Pagination from '@/components/Pagination'

const sendModeList = [
  {
    value: '1',
    label: '手机'
  },
  {
    value: '2',
    label: '邮箱'
  }
]

const alarmTypeList = [
  {
    value: '1',
    label: 'CPU使用率'
  },
  {
    value: '2',
    label: '内存使用率'
  },
  {
    value: '3',
    label: '硬盘使用率'
  },
  {
    value: '4',
    label: '网关温度'
  },
  {
    value: '997',
    label: '设备离线告警'
  },
  {
    value: '998',
    label: '网关离线告警'
  },
  {
    value: '999',
    label: '服务告警'
  }
]

const alarmLevelList = [
  {
    value: '0',
    label: '未分类'
  },
  {
    value: '1',
    label: '资讯'
  },
  {
    value: '2',
    label: '警告'
  },
  {
    value: '3',
    label: '一般严重'
  },
  {
    value: '4',
    label: '严重'
  },
  {
    value: '5',
    label: '灾难'
  }
]

let senderKeyValue = []
const sendModeKeyValue = formatterList(sendModeList)
const alarmTypeKeyValue = formatterList(alarmTypeList)
const alarmLevelKeyValue = formatterList(alarmLevelList)

function formatterList(list) {
  return list.reduce((pre, cur) => {
    pre[cur.value] = cur.label
    return pre
  }, {})
}

export default {
  components: { Pagination },
  filters: {
    senderIdFilter(key) {
      return key.split(',').reduce((pre, cur) => {
        if (typeof pre === 'string') {
          pre += ','
        } else {
          pre = ''
        }
        pre += senderKeyValue[cur]
        return pre
      }, {})
    },
    sendModeFilter(key) {
      return key.split(',').reduce((pre, cur) => {
        if (typeof pre === 'string') {
          pre += ','
        } else {
          pre = ''
        }
        pre += sendModeKeyValue[cur]
        return pre
      }, {})
    },
    alarmTypeFilter(key) {
      return key.split(',').reduce((pre, cur) => {
        if (typeof pre === 'string') {
          pre += ','
        } else {
          pre = ''
        }
        pre += alarmTypeKeyValue[cur]
        return pre
      }, {})
    },
    alarmLevelFilter(key) {
      return key.split(',').reduce((pre, cur) => {
        if (typeof pre === 'string') {
          pre += ','
        } else {
          pre = ''
        }
        pre += alarmLevelKeyValue[cur]
        return pre
      }, {})
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      temp: {
        configId: '',
        senderIdList: [],
        senderId: '',
        sendModeList: [],
        sendMode: '',
        alarmTypeList: [],
        alarmType: '',
        alarmLevelList: [],
        alarmLevel: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增告警发送配置',
        update: '修改告警发送配置'
      },
      rules: {
        senderIdList: [
          { required: true, message: '请选择告警人', trigger: 'change' }
        ],
        sendModeList: [
          { required: true, message: '请选择告警发送方式', trigger: 'change' }
        ],
        alarmTypeList: [
          { required: true, message: '请选择告警类型', trigger: 'change' }
        ],
        alarmLevelList: [
          { required: true, message: '请选择告警级别', trigger: 'change' }
        ]
      },
      senderIdList: [],
      sendModeList: sendModeList,
      alarmTypeList: alarmTypeList,
      alarmLevelList: alarmLevelList
    }
  },
  computed: {
    // ...mapGetters(['operationPermission'])
  },
  watch: {
    dialogFormVisible(val) {
      if (!val && this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getUserList().then(response => {
        if (response.success) {
          for (const data of response.data) {
            data.id = data.id.toString()
          }
          this.senderIdList = response.data
        } else {
          this.senderIdList = []
        }
        senderKeyValue = this.senderIdList.reduce((pre, cur) => {
          pre[cur.id] = cur.realName
          return pre
        }, {})
        this.getList()
      })
    },
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
    resetQuery() {
      this.$refs['filterForm'].resetFields()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createData(this.joinData(this.temp)).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              message: response.message,
              type: 'success',
              duration: this.$store.state.settings.duration
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.temp = Object.assign(this.splitData(row), row)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateData(this.joinData(this.temp)).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              message: response.message,
              type: 'success',
              duration: this.$store.state.settings.duration
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('请确认是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.configId).then(response => {
          if (response.success) {
            this.$notify({
              message: response.message,
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }
        })
      })
    },
    splitData(obj) {
      return {
        senderIdList: obj.senderId.split(','),
        sendModeList: obj.sendMode.split(','),
        alarmTypeList: obj.alarmType.split(','),
        alarmLevelList: obj.alarmLevel.split(',')
      }
    },
    joinData(obj) {
      obj.senderId = obj.senderIdList.join(',')
      obj.sendMode = obj.sendModeList.join(',')
      obj.alarmType = obj.alarmTypeList.join(',')
      obj.alarmLevel = obj.alarmLevelList.join(',')
      return obj
    }
  }
}
</script>
