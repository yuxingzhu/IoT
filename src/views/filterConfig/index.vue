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
              <el-form-item>
                <el-input v-model.trim="listQuery.fieldName" :maxlength="20" placeholder="校验字段名称" />
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
        <el-table-column label="校验字段名称" prop="fieldName" align="center" />
        <el-table-column label="规则名称" prop="ruleName" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.ruleName === "max" ? "最大值":( scope.row.ruleName === "min" ? "最小值":(scope.row.ruleName === "equals" ? "等于":"区间")) }}
          </template>
        </el-table-column>
        <el-table-column label="规则值" prop="ruleValue" width="200" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="200" align="center" />
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom" >
              <el-button size="small" class="elbuttondefault" icon="el-icon-edit" @click="openPartnerEditDialog('edit',scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom">
              <el-button size="small" class="elbuttondefault" icon="el-icon-delete" @click="deletePartner(scope.row)"/>
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
                <el-form-item label="校验字段名称" prop="fieldName">
                  <el-col :span="22">
                    <el-autocomplete v-model.trim="state" :fetch-suggestions="querySearchAsync" placeholder="请输入校验字段关键词" style="width:100%;" @select="handleSelect" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="规则名称" prop="ruleName">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.ruleName" class="el-block" style="width:100%;" @change="handleChange(resourceEditForm.ruleName)">
                      <el-option label="等于" value="equals" />
                      <el-option label="区间" value="range" />
                      <el-option label="最大值" value="max" />
                      <el-option label="最小值" value="min" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="规则值" prop="ruleValue">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.ruleValue" :maxlength="100" :placeholder="placeholder" />
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
  editResource,
  deletePartner,
  findByTenantId
} from '@/api/filter'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Filter',
  components: { Pagination },
  data() {
    return {
      submitFlag: false,
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        configId: '',
        fieldName: '',
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
        ruleId: '',
        ruleName: '',
        ruleValue: '',
        validateMessage: '',
        configId: '',
        fieldName: 'hidden',
        ruleIfMvelExpression: ''
      },
      resourceEditRules: {
        ruleName: [
          {
            required: true,
            message: '请选择规则名称!',
            trigger: 'change'
          }
        ],
        fieldName: [
          {
            required: true,
            message: '校验字段名称不能为空!'
          },
          {
            validator: (rule, value, callback) => {
              if (this.state === '') {
                callback('请输入校验字段名称!')
              } else if (this.states.indexOf(this.state) === -1) {
                callback('该校验字段尚未录入！')
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        ruleValue: [
          {
            required: true,
            message: '请输入规则值!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const ruleName = this.resourceEditForm.ruleName
              const ruleValue = this.resourceEditForm.ruleValue
              switch (ruleName) {
                case 'equals':
                  if (!/^(-?\d+)(\.\d+)?$/.test(ruleValue)) {
                    callback('规则值为任意数字!')
                  } else {
                    callback()
                  }
                  break
                case 'max':
                case 'min':
                  if (!/^(-?\d+)(\.\d+)?$/.test(ruleValue)) {
                    callback('规则值为任意数字!')
                  } else {
                    callback()
                  }
                  break
                case 'range':
                  if (
                    !/^[\(,\[ ](-?\d+)(\.\d+)?\,{1}(-?\d+)(\.\d+)?(([\),\] ]$))/.test(
                      ruleValue
                    )
                  ) {
                    callback('规则值区间格式有误!')
                  } else {
                    var value0 = ruleValue.replace(/\s+/g, '')
                    if (value0[1] === ',' && value0[0] === '[') {
                      callback('规则值区间格式有误!')
                    } else {
                      if (
                        value0[value0.length - 2] === ',' &&
                        value0[value0.length - 1] === ']'
                      ) {
                        callback('规则值区间格式有误!')
                      } else {
                        if (
                          value0[1] === ',' &&
                          value0[value0.length - 2] === ','
                        ) {
                          callback('规则值区间格式有误!')
                        } else {
                          var rules = value0.split(',')
                          var s1 = rules[0]
                          var s2 = rules[1]
                          var ss = []
                          var s = []
                          if (s1[0] === '[') {
                            ss = rules[0].split('[')
                          } else {
                            ss = rules[0].split('(')
                          }
                          if (s2[s2.length - 1] === ']') {
                            s = rules[1].split(']')
                          } else {
                            s = rules[1].split(')')
                          }
                          var first = ss[1]
                          var second = s[0]
                          if (
                            (first !== null || second !== null) &&
                            parseFloat(first) >= 0 &&
                            parseFloat(second) >= 0 &&
                            parseFloat(first) >= parseFloat(second)
                          ) {
                            callback('规则值区间格式有误!')
                          } else {
                            second = s[0]
                            if (
                              (first !== null || second !== null) &&
                              parseFloat(first) <= 0 &&
                              parseFloat(second) <= 0 &&
                              parseFloat(first) >= parseFloat(second)
                            ) {
                              callback('规则值区间格式有误!')
                            } else {
                              if (
                                (first !== null || second !== null) &&
                                parseFloat(first) >= 0 &&
                                parseFloat(second) <= 0
                              ) {
                                callback('规则值区间格式有误!')
                              } else {
                                callback()
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  break
              }
            },
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      deviceId: {
        ruleId: ''
      },
      configId: '',
      placeholder: '',
      restaurants: [],
      state: '',
      timeout: null,
      lists: [],
      ids: {
        profilenid: ''
      },
      Str: []
    }
  },
  created() {
    this.initParams()
    this.getList()
    this.findByTenantId()
  },
  methods: {
    findByTenantId() {
      this.ids.profilenid = this.configId
      findByTenantId(this.ids).then(response => {
        if (response.success) {
          this.states = response.data
          this.restaurants = this.states.map(item => {
            return { value: item, address: item }
          })
        } else {
          this.restaurants = []
        }
      })
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 2000 * Math.random())
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    initParams() {
      if (this.$route.query.configId !== undefined) {
        this.configId = this.$route.query.configId
        console.info(this.configId)
      }
    },
    getList() {
      this.listLoading = true
      this.listQuery.configId = this.configId
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
        this.idList.push(this.value.ruleId)
        this.deviceId.ruleId = this.idList.toString()
      }
      if (this.length > 1) {
        this.abled = false
        this.disabled = true
        for (var i = 0; i < this.length; i++) {
          this.idList.push(this.multipleSelection[i].ruleId)
        }
        this.deviceId.ruleId = this.idList.toString()
      }
      if (this.length === 0) {
        this.abled = true
        this.disabled = true
      }
    },
    resetQueryForm() {
      this.listQuery = {
        configId: '',
        fieldName: '',
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
      this.state = ''
      this.findByTenantId()
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      this.resourceEditForm.configId = this.configId
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增策略配置'
      } else if (this.currentActionType === 'edit') {
        this.states.push(row.fieldName)
        this.restaurants.push({ value: row.fieldName, address: row.fieldName })
        this.editDialogTitle = '修改策略配置'
        this.$nextTick(() => {
          this.resourceEditForm.ruleName = row.ruleName
          this.resourceEditForm.ruleValue = row.ruleValue
          this.resourceEditForm.validateMessage = row.validateMessage
          this.resourceEditForm.configId = row.configId
          this.resourceEditForm.ruleId = row.ruleId
          this.resourceEditForm.fieldName = row.fieldName
          this.state = this.resourceEditForm.fieldName
          this.resourceEditForm.ruleIfMvelExpression = row.ruleIfMvelExpression
        })
      }
      this.editDialogVisible = true
    },
    saveResource() {
      this.$refs['resourceEditForm'].validate(valid => {
        if (valid && !this.submitFlag) {
          this.submitFlag = true
          this.resourceEditForm.fieldName = this.state
          if (this.currentActionType === 'add') {
            saveResource(this.resourceEditForm)
              .then(response => {
                this.submitFlag = false
                if (response.success) {
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.closeEditDialog()
                  this.getList()
                  this.restaurants.indexOf({
                    value: this.resourceEditForm.fieldName,
                    address: this.resourceEditForm.fieldName
                  })
                  this.states.splice(
                    this.states.indexOf(this.resourceEditForm.fieldName),
                    1
                  )
                  this.restaurants.splice(
                    this.restaurants.indexOf({
                      value: this.resourceEditForm.fieldName,
                      address: this.resourceEditForm.fieldName
                    }),
                    1
                  )
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch(error => {
                console.log(error)
                this.submitFlag = false
              })
          } else {
            editResource(this.resourceEditForm)
              .then(response => {
                this.submitFlag = false
                if (response.success) {
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.closeEditDialog()
                  this.getList()
                  this.restaurants.indexOf({
                    value: this.resourceEditForm.fieldName,
                    address: this.resourceEditForm.fieldName
                  })
                  this.states.splice(
                    this.states.indexOf(this.resourceEditForm.fieldName),
                    1
                  )
                  this.restaurants.splice(
                    this.restaurants.indexOf({
                      value: this.resourceEditForm.fieldName,
                      address: this.resourceEditForm.fieldName
                    }),
                    1
                  )
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch(error => {
                console.log(error)
                this.submitFlag = false
              })
          }
        } else {
          return false
        }
      })
    },
    handleChange(value) {
      this.resourceEditForm.ruleValue = ''
      if (value === 'equals') {
        this.placeholder = '任意数字'
      } else if (value === 'max' || value === 'min') {
        this.placeholder = '任意整数'
      } else if (value === 'range') {
        this.placeholder = '任意一个整数区间,如:[-2,4]'
      }
    },
    deletePartner(row) {
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deviceId.ruleId = row.ruleId
          deletePartner(this.deviceId)
            .then(response => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.getList()
                this.findByTenantId()
                this.connectionType = ''
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
