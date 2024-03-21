<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="应用名称" prop="appName" align="center"></el-table-column>
      <el-table-column label="版本名称" prop="versionName" align="center"></el-table-column>
      <el-table-column label="安装时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.status === 1 ? 'online' : 'offline'" />
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-tooltip content="卸载">
            <el-button icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList, deleteData } from '@/api/appInstallRecord'
import Pagination from '@/components/Pagination'

const statusList = [
  {
    value: 0,
    label: '安装中'
  },
  {
    value: 1,
    label: '安装成功'
  },
  {
    value: 2,
    label: '安装失败'
  }
]

const statusKeyValue = formatterList(statusList)

function formatterList(list) {
  return list.reduce((pre, cur) => {
    pre[cur.value] = cur.label
    return pre
  }, {})
}

export default {
  components: { Pagination },
  filters: {
    statusFilter(key) {
      return statusKeyValue[key]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        egwId: this.$route.query.edgeDeviceId,
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
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
          this.total = []
        }
        this.listLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm('请确认是否删除该应用？', '提示', {
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
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }
        })
      })
    }
  }
}
</script>
