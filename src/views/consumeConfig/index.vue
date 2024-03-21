<template>
  <div>
    <div class="app-container" v-if="!isChildren">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip content="添加" >
                  <el-button icon="el-icon-plus" @click="handleCreate" />
                </el-tooltip>
              </el-form-item>
              <el-form-item prop="consumeName">
                <el-input v-model.trim="listQuery.consumeName" placeholder="配置名称" />
              </el-form-item>
              <el-form-item>
                <el-tooltip content="重置">
                  <el-button icon="el-icon-refresh" @click="resetQuery" />
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
        <el-table-column label="配置名称" prop="consumeName" align="center"></el-table-column>
        <el-table-column label="数据存储表名" prop="dataTableName" align="center"></el-table-column>
        <el-table-column label="数据存储天数" prop="dataRetentionTime" align="center" v-if="false"></el-table-column>
        <el-table-column label="数据主键" prop="dataPrimaryKey" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-tooltip content="修改">
              <el-button icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
            </el-tooltip> -->
            <el-tooltip content="删除" >
              <el-button icon="el-icon-delete" @click="handleDelete(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip content="查看">
              <el-button icon="el-icon-view" @click="handleView(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini" @submit.native.prevent>
          <el-row v-show="false">
            <el-col>
              <el-form-item prop="consumeId">
                <input type="hidden" v-model.trim="temp.consumeId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="配置名称" prop="consumeName">
                <el-input v-model.trim="temp.consumeName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="数据存储表名" prop="dataTableName">
                <el-input v-model.trim="temp.dataTableName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="false">
            <el-col>
              <el-form-item label="数据存储天数" prop="dataRetentionTime">
                <el-input v-model.trim="temp.dataRetentionTime"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="数据主键" prop="dataPrimaryKey">
                <el-input v-model.trim="temp.dataPrimaryKey"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import {
  getList,
  createData,
  updateData,
  deleteData
} from '@/api/consumeConfig'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  components: { Pagination },
  filters: {
    dataRetentionTimeFilter(key) {
      return key.match(/[1-9][0-9]*/g)[0]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        consumeName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      temp: {
        consumeId: '',
        consumeName: '',
        dataTableName: '',
        dataPrimaryKey: '',
        dataRetentionTime: '90'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增消费配置',
        update: '修改消费配置'
      },
      rules: {
        consumeName: [
          { required: true, message: '请输入配置名称', trigger: 'blur' }
        ],
        dataTableName: [
          { required: true, message: '请输入数据存储表名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
            message: '必须由字母开头，字母、数字及下划线组成'
          }
        ],
        dataRetentionTime: [
          { required: true, message: '请输入数据存储天数', trigger: 'blur' },
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
    this.isChildren = this.$route.meta.isChildren
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
      this.$confirm('请确认是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.consumeId).then(response => {
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
    handleView(row) {
      this.$router.push(`/consumeConfigView?collectionName=${row.dataTableName}`)
    }
  }
}
</script>
