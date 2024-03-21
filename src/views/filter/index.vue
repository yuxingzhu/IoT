<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-form ref="listQuery" :model="listQuery">
          <el-row :gutter="24">
            <el-col :span="3">
              <el-form-item prop="fieldName">
                <el-input v-model.trim="listQuery.fieldName" :maxlength="20" placeholder="校验字段名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="el-align-center">
                <el-button @click="resetQueryForm" icon="el-icon-refresh">重 置</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button type="primary" @click="getList()" icon="el-icon-search">查 询</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="13" style="padding-left:28%;">
              <el-tooltip class="item" effect="dark" content="新增">
                <el-button @click="openPartnerEditDialog('add')" icon="el-icon-plus"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="修改" :disabled="disabled">
                <el-button @click="openPartnerEditDialog('edit')" icon="el-icon-edit" :disabled="disabled"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" :disabled="abled">
                <el-button @click="deletePartner()" icon="el-icon-delete" :disabled="abled"></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table v-loading="listLoading" stripe   :data="list" border style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column label="校验字段名称" prop="fieldName" align="center" />
        <el-table-column label="规则名称" prop="ruleName" align="center" />
        <el-table-column label="规则值" prop="ruleValue" align="center" />
        <el-table-column label="规则前置条件" prop="ruleIfMvelExpression" align="center" />
        <el-table-column label="校验信息" prop="validateMessage" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :visible.sync="editDialogVisible" class="el-dialog-form el-dialog-center" width="30%" @close="closeEditDialog">
        <span class="el-dialog__title" slot="title">
          <i class="el-icon-fa-th-large"></i>
          {{editDialogTitle}}
        </span>
        <div>
          <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceEditRules" label-width="120px">
            <el-row>
              <el-col :span="20">
                <el-form-item label="校验字段名称" prop="fieldName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.fieldName" :maxlength="100" :placeholder='placeholder'></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="规则名称" prop="ruleName">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.ruleName" class="el-block" @change='handleChange' style="width:100%;">
                      <el-option label="required" value="required"></el-option>
                      <el-option label="email" value="email"></el-option>
                      <el-option label="url" value="url"></el-option>
                      <el-option label="number" value="number"></el-option>
                      <el-option label="digits" value="digits"></el-option>
                      <el-option label="equalsTo" value="equalsTo"></el-option>
                      <el-option label="equals" value="equals"></el-option>
                      <el-option label="maxlength" value="maxlength"></el-option>
                      <el-option label="minlength" value="minlength"></el-option>
                      <el-option label="lengthrange" value="lengthrange"></el-option>
                      <el-option label="max" value="max"></el-option>
                      <el-option label="min" value="min"></el-option>
                      <el-option label="range" value="range"></el-option>
                      <el-option label="regex" value="regex"></el-option>
                      <el-option label="in" value="in"></el-option>
                      <el-option label="nin" value="nin"></el-option>
                      <el-option label="mindatetime" value="mindatetime"></el-option>
                      <el-option label="maxdatetime" value="maxdatetime"></el-option>
                      <el-option label="datetimerange" value="datetimerange"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="规则值" prop="ruleValue">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.ruleValue" :maxlength="100" :placeholder='placeholder'></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="规则前置条件" prop="ruleIfMvelExpression">
                  <el-col :span="22">
                    <el-input class="el-block" v-model.trim="resourceEditForm.ruleIfMvelExpression" placeholder="如:name == 'RPM'">

                    </el-input>
                  </el-col>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="校验信息" prop="validateMessage">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.validateMessage" :maxlength="100"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" @click="saveResource" :loading="submiting">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import {
  getList,
  saveResource,
  editResource,
  deletePartner
} from '@/api/filter'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Filter',
  components: { Pagination },
  data() {
    return {
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
        fieldName: '',
        ruleIfMvelExpression: ''
      },
      resourceEditRules: {
        ruleName: [
          {
            required: true,
            message: '请选择规则名称!'
          }
        ],
        fieldName: [
          {
            required: true,
            message: '请填写所属字段名称!'
          }
        ],
        ruleValue: [
          {
            required: true,
            message: '请输入规则值!'
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
      placeholder: ''
    }
  },
  created() {
    this.initParams()
    this.getList()
  },
  methods: {
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
      this.listQuery.area = ''
      this.$refs.listQuery.resetFields()
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.resourceEditForm.resetFields()
      this.multipleSelection = []
    },
    openPartnerEditDialog(actionType) {
      var _this = this
      _this.currentActionType = actionType
      this.resourceEditForm.configId = this.configId
      if (_this.currentActionType === 'add') {
        _this.editDialogTitle = '新增过滤规则'
      } else if (_this.currentActionType === 'edit') {
        _this.editDialogTitle = '修改过滤规则'
        Vue.nextTick(function() {
          _this.resourceEditForm.ruleName = _this.value.ruleName
          _this.resourceEditForm.ruleValue = _this.value.ruleValue
          _this.resourceEditForm.validateMessage = _this.value.validateMessage
          _this.resourceEditForm.configId = _this.value.configId
          _this.resourceEditForm.ruleId = _this.value.ruleId
          _this.resourceEditForm.fieldName = _this.value.fieldName
          _this.resourceEditForm.ruleIfMvelExpression =
            _this.value.ruleIfMvelExpression
        })
      }
      _this.editDialogVisible = true
    },
    saveResource() {
      var _this = this
      this.$refs.resourceEditForm.validate(function(valid) {
        if (valid) {
          if (_this.currentActionType === 'add') {
            saveResource(_this.resourceEditForm)
              .then(response => {
                if (response.success) {
                  _this.$message.success('保存成功!')
                  _this.closeEditDialog()
                  _this.getList()
                } else {
                  _this.$message.error('请求出错!')
                }
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            editResource(_this.resourceEditForm)
              .then(response => {
                if (response.success) {
                  _this.$message.success('保存成功!')
                  _this.closeEditDialog()
                  _this.getList()
                } else {
                  _this.$message.error('请求出错!')
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
    handleChange(value) {},
    deletePartner() {
      var _this = this
      this.$confirm('确定要删除该过滤规则?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletePartner(_this.deviceId)
            .then(response => {
              var result = response.data
              if (response.success) {
                _this.$message.success('删除成功!')
                _this.getList()
                _this.connectionType = ''
              } else {
                _this.$message.error(result.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
