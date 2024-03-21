<template>
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
            <el-form-item>
              <el-input v-model.trim="listQuery.dataGroupName" :maxlength="20" placeholder="数据组名称" />
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQuery" />
              </el-tooltip>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="getList" />
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="数据组名称" prop="dataGroupName" align="center"></el-table-column>
      <el-table-column label="数据组描述" prop="dataGroupDesc" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip content="修改">
            <el-button icon="el-icon-edit" @click="handleUpdate(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button icon="el-icon-delete" @click="handleDelete(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
          <el-tooltip content="配置">
            <el-button icon="el-icon-setting" @click="jump(scope.row)" class="elbuttondefault"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini">
        <el-row v-show="false">
          <el-col>
            <el-form-item prop="dataGroupId">
              <input type="hidden" v-model.trim="temp.dataGroupId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="数据组名称" prop="dataGroupName">
              <el-col :span="22">
                <el-input v-model.trim="temp.dataGroupName" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="数据组描述" prop="dataGroupDesc">
              <el-col :span="22">
                <el-input v-model.trim="temp.dataGroupDesc" />
              </el-col>
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
import { getList, createData, updateData, deleteData } from '@/api/dataGroup'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        dataGroupName: '',
        displayBoardId: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'dataGroupId',
        order: 'desc'
      },
      temp: {
        dataGroupId: '',
        dataGroupName: '',
        dataGroupDesc: '',
        displayBoardId: this.$route.query.displayBoardId
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增数据组',
        update: '修改数据组'
      },
      rules: {
        dataGroupName: [
          { required: true, message: '请输入数据组名称', trigger: 'blur' }
        ],
        dataGroupDesc: [
          { required: true, message: '请输入数据组描述', trigger: 'blur' }
        ]
      },
      dialogPlayVisible: false,
      displayBoardId: this.$route.query.displayBoardId,
      length: 0
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val && this.$refs['dataForm']) {
        this.fileList = []
        this.$refs['dataForm'].resetFields()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.displayBoardId = this.$route.query.displayBoardId
      getList(this.listQuery).then((response) => {
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
      this.listQuery = {
        dataGroupName: '',
        displayBoardId: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'dataGroupId',
        order: 'desc'
      }
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData(this.temp).then((response) => {
            this.dialogFormVisible = false
            this.$notify({
              message: '保存成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.temp.dataGroupName = row.dataGroupName
        this.temp.dataGroupDesc = row.dataGroupDesc
        this.temp.displayBoardId = row.displayBoardId
        this.temp.dataGroupId = row.dataGroupId
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateData(this.temp).then((response) => {
            this.dialogFormVisible = false
            this.$notify({
              message: '保存成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.fileList = []
            this.getList()
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
        deleteData(row.dataGroupId).then((response) => {
          if (response.success) {
            this.$notify({
              message: '删除成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.getList()
          }
        })
      })
    },
    jump(row) {
      this.$router.push(`/dataDevice?relationId=${row.dataGroupId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.play-img {
  width: 640px;
  height: 360px;
  clear: both;
  display: block;
  margin: auto;
}
</style>
