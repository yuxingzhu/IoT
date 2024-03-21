<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip content="添加">
                  <el-button icon="el-icon-plus" @click="handleCreate"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item prop="authorizationParty">
                <el-input v-model.trim="listQuery.authorizationParty" placeholder="授权对象" />
              </el-form-item>
              <el-form-item>
                <el-tooltip content="重置">
                  <el-button icon="el-icon-refresh" @click="resetQuery"/>
                </el-tooltip>
                <el-tooltip content="搜索">
                  <el-button icon="el-icon-search" @click="handleFilter"/>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="listLoading" :data="list" size="mini">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="授权码" prop="authorizationCode" align="center"></el-table-column>
        <el-table-column label="授权时间" prop="authorizationTime" align="center"></el-table-column>
        <el-table-column label="授权对象" prop="authorizationParty" align="center"></el-table-column>
        <el-table-column label="授权截止时间" prop="authorizationDeadline" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="删除">
              <el-button icon="el-icon-delete" class="elbuttondefault" @click="handleDelete(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini" @submit.native.prevent>
          <el-row>
            <el-col>
              <el-form-item label="授权码个数" prop="codeNumber">
                <el-input v-model.trim="temp.codeNumber" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="授权对象" prop="authorizationParty">
                <el-input v-model.trim="temp.authorizationParty" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="授权截止时间" prop="authorizationDeadline">
                <el-date-picker v-model.trim="temp.authorizationDeadline" :picker-options="pickerOptions" type="datetime" placeholder="选择授权截止时间" style="width:80%" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createData()">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getList, createData, deleteData } from '@/api/authorizationManage'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  components: { Pagination },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() <= Date.now() - 1 * 24 * 3600 * 1000 
        }
      },
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        authorizationParty: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'id',
        order: 'desc'
      },
      temp: {
        codeNumber: '',
        authorizationParty: '',
        authorizationDeadline: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增授权码'
      },
      rules: {
        authorizationDeadline: [
          { required: true, message: '请选择授权截止时间', trigger: 'change' }
        ],
        codeNumber: [
          { required: true, message: '请输入授权码个数', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: '必须是正整数'
          }
        ]
      }
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val && this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
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
    handleDelete(row) {
      this.$confirm('请确认是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.id).then(response => {
          if (response.success) {
            this.$notify({
              message: response.message,
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.getList()
          }
        })
      })
    }
  }
}
</script>
