<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
              <el-tooltip content="添加" >
                <el-button icon="el-icon-plus" @click="handleCreate"></el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="topicName">
              <el-input v-model.trim="listQuery.topicName" placeholder="主题名称" />
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQuery"></el-button>
              </el-tooltip>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="handleFilter"></el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="主题名称" prop="topicName" align="center"></el-table-column>
      <el-table-column label="消费配置" prop="consumeId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.consumeId | consumeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据存储表名" prop="consumeId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.consumeId | dataTableFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-tooltip content="修改">
            <el-button icon="el-icon-edit" @click="handleUpdate(scope.row)" class="elbuttondefault">修改</el-button>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button icon="el-icon-delete" @click="handleDelete(scope.row)" class="elbuttondefault">删除</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini">
        <el-row>
          <el-col>
            <el-form-item label="主题名称" prop="topicName">
              <el-input v-model.trim="temp.topicName" :disabled="dialogStatus !='create'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="消费配置" prop="consumeId">
              <el-select v-model.trim="temp.consumeId">
                <el-option v-for="item in consumeList" :key="item.consumeId" :label="item.consumeName" :value="item.consumeId">
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
import {
  getList,
  createData,
  updateData,
  deleteData,
  getConsumeList
} from '@/api/topic'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

let consumeKeyValue = []
let dataTableKeyValue = []

export default {
  components: { Pagination },
  filters: {
    consumeFilter(key) {
      return consumeKeyValue[key]
    },
    dataTableFilter(key) {
      return dataTableKeyValue[key]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        topicName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      temp: {
        topicName: '',
        consumeId: '',
        topicPerms: 'publish,subscribe'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增主题',
        update: '修改主题'
      },
      rules: {
        topicName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ],
        consumeId: [
          { required: true, message: '请选择消费配置', trigger: 'change' }
        ]
      },
      consumeList: []
    }
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
  computed: {
    ...mapGetters(['operationPermission'])
  },
  methods: {
    initData() {
      getConsumeList().then(response => {
        if (response.success) {
          this.consumeList = response.data
          consumeKeyValue = this.consumeList.reduce((pre, cur) => {
            pre[cur.consumeId] = cur.consumeName
            return pre
          }, {})
          dataTableKeyValue = this.consumeList.reduce((pre, cur) => {
            pre[cur.consumeId] = cur.dataTableName
            return pre
          }, {})
          this.getList()
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
        deleteData(row.topicName).then(response => {
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
    }
  }
}
</script>
