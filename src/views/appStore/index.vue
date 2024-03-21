<template>
  <div>
    <div class="app-container" v-if="!isChildren">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip  content="添加">
                  <el-button icon="el-icon-plus" @click="handleCreate" />
                </el-tooltip>
              </el-form-item>
              <el-form-item prop="appName">
                <el-input v-model.trim="listQuery.appName" placeholder="应用名称" />
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
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="应用名称" prop="appName" align="center"></el-table-column>
        <el-table-column label="应用描述" prop="appDesc" align="center"></el-table-column>
        <el-table-column label="应用提供商" prop="appProvider" align="center"></el-table-column>
        <el-table-column label="应用地址" prop="appUrl" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip  content="删除">
              <el-button icon="el-icon-delete" @click="handleDelete(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip content="查看版本">
              <el-button icon="el-icon-view" @click="handleView(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini" @submit.native.prevent>
          <el-row>
            <el-col>
              <el-form-item label="应用名称" prop="appName">
                <el-input v-model.trim="temp.appName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="应用描述" prop="appDesc">
                <el-input type="textarea" :rows="2" v-model.trim="temp.appDesc"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="应用提供商" prop="appProvider">
                <el-input v-model.trim="temp.appProvider"></el-input>
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
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList, createData, deleteData } from '@/api/appStore'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      isChildren: '',
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        appName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      temp: {
        appName: '',
        appDesc: '',
        appProvider: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增应用'
      },
      rules: {
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ]
      }
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
    handleDelete(row) {
      this.$confirm('请确认是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.appId).then(response => {
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
      this.$router.push(`/appversion?appId=${row.appId}`)
    }
  }
}
</script>
