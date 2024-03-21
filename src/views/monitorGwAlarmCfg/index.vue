<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
              <el-tooltip  content="添加">
                <el-button icon="el-icon-plus" @click="handleCreate" />
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="alarmName">
              <el-input v-model.trim="listQuery.alarmName" placeholder="告警项名称" />
            </el-form-item>
            <el-form-item prop="monitorName">
              <el-select v-model.trim="listQuery.monitorName" placeholder="监控项名称">
                <el-option v-for="item in monitorList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQuery" />
              </el-tooltip>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="handleFilter" />
              </el-tooltip>

            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="告警项名称" prop="alarmName" align="center" />
      <el-table-column label="监控项名称" prop="monitorName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.monitorName | alarmNameFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作符" prop="operator" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operator | operatorFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阈值" prop="threshold" align="center" />
      <el-table-column label="告警级别" prop="alarmLevel" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmLevel | alarmLevelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置时间" prop="createTime" align="center" />
      <el-table-column label="配置状态" prop="alarmCfgStatus" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.alarmCfgStatus ? 'online' : 'offline'" />
          <span>{{ scope.row.alarmCfgStatus | alarmCfgStatusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-tooltip content="修改">
            <el-button icon="el-icon-edit" @click="handleUpdate(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button icon="el-icon-delete" @click="handleDelete(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
          <el-tooltip content="应用网关组">
            <el-button icon="el-icon-setting" @click="showGroup(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini" @submit.native.prevent>
        <el-row v-show="false">
          <el-col>
            <el-form-item prop="alarmCfgId">
              <input v-model.trim="temp.alarmCfgId" type="hidden">
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="告警项名称" prop="alarmName">
              <el-input v-model.trim="temp.alarmName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="监控项名称" prop="monitorName">
              <el-select v-model.trim="temp.monitorName">
                <el-option v-for="item in monitorList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="操作符" prop="operator">
              <el-select v-model.trim="temp.operator">
                <el-option v-for="item in operatorList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="阈值" prop="threshold">
              <el-input v-model.trim="temp.threshold" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="告警级别" prop="alarmLevel">
              <el-select v-model.trim="temp.alarmLevel">
                <el-option v-for="item in alarmLevelList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="配置状态" prop="alarmCfgStatus">
              <el-select v-model.trim="temp.alarmCfgStatus">
                <el-option v-for="item in alarmCfgStatusList" :key="item.value" :label="item.label" :value="item.value" />
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
    <el-dialog title="应用网关组" :visible.sync="dialogGroupVisible" :close-on-click-modal="false">
      <el-tree ref="tree" :data="groupList" show-checkbox default-expand-all node-key="groupId" :props="{label: 'groupName'}" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="applyGroup()">
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
  getGroup,
  applyGroup
} from '@/api/monitorGwAlarmCfg'
import Pagination from '@/components/Pagination'

const monitorList = [
  {
    value: 5,
    label: 'flash使用率'
  },
  {
    value: 2,
    label: '内存使用率'
  },
  {
    value: 1,
    label: 'CPU使用率'
  }
]

const operatorList = [
  {
    value: 1,
    label: '>'
  },
  {
    value: 2,
    label: '<'
  },
  {
    value: 3,
    label: '='
  },
  {
    value: 4,
    label: '>='
  },
  {
    value: 5,
    label: '<='
  }
]
const alarmLevelList = [
  {
    value: 1,
    label: '严重'
  },
  {
    value: 2,
    label: '紧急'
  },
  {
    value: 3,
    label: '一般'
  },
  // {
  //   value: 3,
  //   label: '一般严重'
  // },
  // {
  //   value: 4,
  //   label: '严重'
  // },
  // {
  //   value: 5,
  //   label: '灾难'
  // }
]

const alarmCfgStatusList = [
  {
    value: true,
    label: '启用'
  },
  {
    value: false,
    label: '停用'
  }
]
const monitorNameKeyValue = formatterList(monitorList)
const operatorKeyValue = formatterList(operatorList)
const alarmLevelKeyValue = formatterList(alarmLevelList)
const alarmCfgStatusKeyValue = formatterList(alarmCfgStatusList)

function formatterList(list) {
  return list.reduce((pre, cur) => {
    pre[cur.value] = cur.label
    return pre
  }, {})
}

export default {
  components: { Pagination },
  filters: {
    alarmNameFilter(key) {
      return monitorNameKeyValue[key]
    },
    operatorFilter(key) {
      return operatorKeyValue[key]
    },
    alarmLevelFilter(key) {
      return alarmLevelKeyValue[key]
    },
    alarmCfgStatusFilter(key) {
      return alarmCfgStatusKeyValue[key]
    }
  },
  data() {
    return {
       eventtype:[
{
    value: 1,
    label: '故障通知'
  },
  {
    value: 2,
    label: '预警通知'
  },
  {
    value: 3,
    label: '普通通知'
  } 
],

      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        alarmName: '',
        monitorName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      temp: {
        alarmCfgId: '',
        alarmName: '',
        monitorName: '',
        operator: '',
        threshold: '',
        alarmLevel: '',
        alarmCfgStatus: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增告警配置',
        update: '修改告警配置'
      },
      rules: {
        alarmName: [
          { required: true, message: '请输入告警项名称', trigger: 'blur' }
        ],
        monitorName: [
          { required: true, message: '请选择监控项名称', trigger: 'change' }
        ],
        operator: [
          { required: true, message: '请选择操作符', trigger: 'change' }
        ],
        threshold: [
          { required: true, message: '请输入阈值', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
           if (this.temp.monitorName === 4) {
                if (
                  !/^[\(,\[ ](-?\d+)(\.\d+)?\,{1}(-?\d+)(\.\d+)?(([\),\] ]$))/.test(
                    ruleValue
                  )
                ) {
                  callback("规则值区间格式有误!");
                }
                 else {
                  var value0 = ruleValue.replace(/\s+/g, "");
                  if (value0[1] === "," && value0[0] === "[") {
                    callback("规则值区间格式有误!");
                  } else {
                    if (
                      value0[value0.length - 2] === "," &&
                      value0[value0.length - 1] === "]"
                    ) {
                      callback("规则值区间格式有误!");
                    } else {
                      if (
                        value0[1] === "," &&
                        value0[value0.length - 2] === ","
                      ) {
                        callback("规则值区间格式有误!");
                      } else {
                        var rules = value0.split(",");
                        var s1 = rules[0];
                        var s2 = rules[1];
                        var ss = [];
                        var s = [];
                        if (s1[0] === "[") {
                          ss = rules[0].split("[");
                        } else {
                          ss = rules[0].split("(");
                        }
                        if (s2[s2.length - 1] === "]") {
                          s = rules[1].split("]");
                        } else {
                          s = rules[1].split(")");
                        }
                        var first = ss[1];
                        var second = s[0];
                        if (
                          (first !== null || second !== null) &&
                          parseFloat(first) >= 0 &&
                          parseFloat(second) >= 0 &&
                          parseFloat(first) >= parseFloat(second)
                        ) {
                          callback("规则值区间格式有误!");
                        } else {
                          second = s[0];
                          if (
                            (first !== null || second !== null) &&
                            parseFloat(first) <= 0 &&
                            parseFloat(second) <= 0 &&
                            parseFloat(first) >= parseFloat(second)
                          ) {
                            callback("规则值区间格式有误!");
                          } else {
                            if (
                              (first !== null || second !== null) &&
                              parseFloat(first) >= 0 &&
                              parseFloat(second) <= 0
                            ) {
                              callback("规则值区间格式有误!");
                            } else {
                              callback();
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        alarmLevel: [
          { required: true, message: '请选择告警级别', trigger: 'change' }
        ],
        alarmCfgStatus: [
          { required: true, message: '请选择配置状态', trigger: 'change' }
        ]
      },
      monitorList: monitorList,
      operatorList: operatorList,
      alarmLevelList: alarmLevelList,
      alarmCfgStatusList: alarmCfgStatusList,
      groupTemp: {
        alarmCfgId: '',
        groupIds: []
      },
      dialogGroupVisible: false,
      groupList: []
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  watch: {
    dialogFormVisible(val) {
      if (!val && this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
    },
    dialogGroupVisible(val) {
      if (!val && this.$refs['tree']) {
        this.$refs['tree'].setCheckedKeys([])
      }
    }
  },
  created() {
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
          this.total = 0
        }
        this.listLoading = false
      })
    },
    resetQuery() {
      this.$refs['filterForm'].resetFields()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createData(this.temp).then(response => {
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
        this.temp = Object.assign({}, row)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateData(this.temp).then(response => {
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
      this.$confirm(
        '删除告警配置将同时删除此配置生成的告警信息，请确认是否删除该配置?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteData(row.alarmCfgId).then(response => {
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
    handleCommand(command) {
      if (command === 'showGroup') {
        this.showGroup()
      }
    },
    showGroup(row) {
      getGroup().then(response => {
        if (response.success) {
          const groupIds = row.groupIds
          this.groupTemp = {
            alarmCfgId: row.alarmCfgId,
            groupIds: groupIds
          }
          this.groupList = response.data
          this.$nextTick(() => {
            this.$refs['tree'].setCheckedKeys(groupIds)
          })
        } else {
          this.groupList = []
        }
        this.dialogGroupVisible = true
      })
    },
    applyGroup() {
      const groupIds = this.$refs['tree'].getCheckedKeys()
      if (
        groupIds.sort().join(',') === this.groupTemp.groupIds.sort().join(',')
      ) {
        this.$notify.warning('网关组没有改变，无需保存!')
      } else {
        this.groupTemp.groupIds = groupIds
        applyGroup(this.groupTemp).then(response => {
          this.getList()
          this.dialogGroupVisible = false
          this.$notify({
            message: response.message,
            type: 'success',
            duration: this.$store.state.settings.duration
          })
        })
      }
    }
  }
}
</script>
