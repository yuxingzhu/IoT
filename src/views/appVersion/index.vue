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
            <el-form-item prop="versionName">
              <el-input v-model.trim="listQuery.versionName" placeholder="版本名称" />
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
      <el-table-column label="版本名称" prop="versionName" align="center" />
      <el-table-column label="版本简介" prop="versionDesc" align="center" />
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="上传状态" prop="status" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.status === 1 ? 'online' : 'offline'" />
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="删除">
            <el-button icon="el-icon-delete" @click="handleDelete(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
          <el-tooltip content="安装">
            <el-button :disabled="scope.row.status != 1" icon="el-icon-magic-stick" @click="handleInstall(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini" @submit.native.prevent>
        <el-row>
          <el-col>
            <el-form-item label="版本名称" prop="versionName">
              <el-input v-model.trim="temp.versionName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="版本描述" prop="versionDesc">
              <el-input v-model.trim="temp.versionDesc" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="文件上传" prop="filePath">
              <el-upload ref="upload" :action="action" drag :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed">
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="应用参数" prop="paramList">
              <div class="param-border">
                <el-button icon="el-icon-plus" @click="addParam">添加</el-button>
                <div class="el-upload__text" style="float: right;color: red;"><em>请根据实际情况来配置参数</em></div>
                <el-table :data="temp.paramList">
                  <el-table-column label="参数类型" align="center">
                    <template slot-scope="scope">
                      <el-select v-model.trim="scope.row.paramType">
                        <el-option v-for="item in paramTypeList" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="参数名称" align="center">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.paramName" />
                    </template>
                  </el-table-column>
                  <el-table-column label="参数默认值" align="center">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.paramValue" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button icon="el-icon-delete" @click="delParam(scope)" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="安装" :visible.sync="dialogInstallFormVisible" width="50%">
      <el-form ref="installDataForm" :rules="installRules" :model="installTemp" label-width="100px" size="mini" @submit.native.prevent>
        <el-row>
          <el-col>
            <el-form-item label="网关" prop="egwListHidden">
              <div class="param-border">
                <input v-model.trim="installTemp.egwListHidden" type="hidden">
                <el-table ref="multipleTable" :data="egwList" @selection-change="egwSelectionChange">
                  <el-table-column type="selection" width="80" align="center" />
                  <el-table-column label="网关名称" prop="egwName" align="center" />
                  <el-table-column label="网关IP地址" prop="egwIp" align="center" />
                  <el-table-column label="网关CPU核数" prop="egwCpu" align="center" />
                  <el-table-column label="网关内存" prop="egwMemory" align="center" />
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="应用参数" prop="paramList">
              <div class="param-border">
                <el-table :data="installTemp.paramList">
                  <el-table-column label="参数类型" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.paramType | paramTypeFilter }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="参数名称" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.paramName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="参数值" align="center">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.paramValue" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInstallFormVisible = false">取消</el-button>
        <el-button type="primary" @click="install()">安装</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getList,
  createData,
  deleteData,
  findEgwInfo,
  findByVersionId,
  install
} from '@/api/appVersion'
import Pagination from '@/components/Pagination'

const paramTypeList = [
  {
    value: 'Env',
    label: '环境变量'
  },
  {
    value: 'Binds',
    label: '目录映射'
  },
  {
    value: 'PortBindings',
    label: '端口映射'
  },
  {
    value: 'Devices',
    label: '设备映射'
  }
]

const paramTypeKeyValue = formatterList(paramTypeList)

function formatterList(list) {
  return list.reduce((pre, cur) => {
    pre[cur.value] = cur.label
    return pre
  }, {})
}

export default {
  components: { Pagination },
  filters: {
    statusFilter(state) {
      const statusMap = {
        0: '上传中',
        1: '上传成功',
        2: '上传失败'
      }
      return statusMap[state]
    },
    paramTypeFilter(key) {
      return paramTypeKeyValue[key]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        appId: this.$route.query.appId,
        versionName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      temp: {
        appId: this.$route.query.appId,
        versionName: '',
        versionDesc: '',
        filePath: '',
        paramList: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增版本'
      },
      rules: {
        versionName: [
          { required: true, message: '请输入版本名称', trigger: 'blur' }
        ],
        filePath: [{ required: true, message: '请选择上传文件' }],
        paramList: [
          {
            validator: (rule, value, callback) => {
              const paramList = this.temp.paramList
              if (paramList.length > 0) {
                for (var i = 0; i < paramList.length; i++) {
                  var param = paramList[i]
                  if (
                    !param.paramType ||
                    !param.paramName ||
                    !param.paramValue
                  ) {
                    callback('应用参数不完整!')
                  } else if (
                    param.paramType === 'PortBindings' &&
                    !/^[0-9]*$/.test(param.paramValue)
                  ) {
                    callback('参数默认值必须为1-65535！')
                  }
                }
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      action: process.env.VUE_APP_BASE_API + '/appVersion/uploadFile',
      paramTypeList: paramTypeList,
      egwList: [],
      installTemp: {
        versionId: '',
        egwList: [],
        paramList: [],
        egwListHidden: 'hidden'
      },
      dialogInstallFormVisible: false,
      installRules: {
        egwListHidden: [
          { required: true },
          {
            validator: (rule, value, callback) => {
              if (this.installTemp.egwList.length === 0) {
                callback('请选择网关!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        paramList: [
          {
            validator: (rule, value, callback) => {
              const paramList = this.installTemp.paramList
              if (paramList.length > 0) {
                for (var i = 0; i < paramList.length; i++) {
                  var param = paramList[i]
                  if (!param.paramValue) {
                    callback('请输入参数值!')
                  } else if (
                    param.paramType === 'PortBindings' &&
                    !/^[0-9]*$/.test(param.paramValue)
                  ) {
                    callback('参数值必须为1-65535！')
                  }
                }
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  watch: {
    dialogFormVisible(val) {
      if (!val && this.$refs['dataForm']) {
        this.$refs['upload'].clearFiles()
        this.$refs['dataForm'].resetFields()
      }
    },
    dialogInstallFormVisible(val) {
      if (!val && this.$refs['installDataForm']) {
        this.$refs['multipleTable'].clearSelection()
        this.$refs['installDataForm'].resetFields()
      }
    }
  },
  created() {
    this.initData()
    this.getList()
  },
  methods: {
    initData() {
      findEgwInfo().then(response => {
        if (response.success) {
          this.egwList = response.data
        } else {
          this.egwList = []
        }
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
    handleRemove(file, fileList) {
      this.temp.filePath = ''
    },
    handleSuccess(response, file, fileList) {
      if (response.success) {
        this.temp.filePath = response.data.path
      } else {
        this.$notify({
          message: response.message,
          type: 'error',
          duration: this.$store.state.settings.duration
        })
      }
    },
    handleError() {
      this.$notify({
        message: '上传失败！',
        type: 'error',
        duration: this.$store.state.settings.duration
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleExceed(files, fileList) {
      this.$notify({
        message: '上传文件数量超出限制',
        type: 'error',
        duration: this.$store.state.settings.duration
      })
    },
    addParam() {
      this.temp.paramList.push({
        paramType: '',
        paramName: '',
        paramValue: ''
      })
    },
    delParam(scope) {
      this.temp.paramList.splice(scope.$index, 1)
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
    handleDelete(row) {
      this.$confirm('请确认是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.versionId).then(response => {
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
    handleInstall(row) {
      this.dialogStatus = 'create'
      this.dialogInstallFormVisible = true
      this.$nextTick(() => {
        findByVersionId(row.versionId).then(response => {
          if (response.success) {
            this.installTemp.versionId = row.versionId
            this.installTemp.paramList = response.data
          }
        })
      })
    },
    showParamTypeName(value) {
      let name = ''
      // console.log(this.paramTypeList)
      this.paramTypeList.forEach(item => {
        if (item.value === value) {
          name = item.name
          return
        }
      })
      return name
    },
    egwSelectionChange(val) {
      this.installTemp.egwList = val
    },
    install() {
      this.$refs['installDataForm'].validate(valid => {
        if (valid) {
          install(this.installTemp).then(response => {
            this.dialogInstallFormVisible = false
            this.$notify({
              message: response.message,
              type: 'success',
              duration: this.$store.state.settings.duration
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.param-border {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

/deep/ .el-upload {
  width: 100%;
}

/deep/ .el-upload-dragger {
  width: 100%;
}
</style>
