<template>
  <div class="app-container dataDetails-container">
    <el-row class="dataDetails">
      <div v-loading="listLoading" style="height: 500px;" >
        <el-col :span="5" style="margin-top:20px;margin-left: 3%;" v-for="item in list" :key="item.index" class="board">
        <div class="platform">
          <font style="font-size: 15px;margin-left: 30px;color: #ffffff;">{{item.groupName}}({{item.deviceNum}})</font>
          <el-scrollbar style="height: 200px;margin-left: 25px;margin-top: 10px;">
            <div v-for="items in item.valueList" :key="items.labelName">
              <el-col :span="9">
                <p class="article">{{items.deviceName}}</p>
              </el-col>
              <el-col :span="3">
                <p class="article">|</p>
              </el-col>
              <el-col :span="6">
                <p class="article">{{items.labelName}}</p>
              </el-col>
              <el-col :span="5">
                <p class="article">{{items.value}}</p>
              </el-col>
              <!-- <p class="article">{{items.deviceName}}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;{{items.labelName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{items.value}}</p> -->
            </div>
          </el-scrollbar>
        </div>
        </el-col>
      </div>
    </el-row>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" :page-sizes="[12, 24, 50, 100, 500]" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getDetailsList } from '@/api/datakanbanData'
export default {
  name: 'dataDetails',
  components: { Pagination },
  data() {
  return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        displayBoardId: this.$route.query.displayBoardId,
        currentPage: 1,
        pageSize: 12,
        orderby: 'createTime',
        order: 'desc'
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDetailsList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.data
          this.total = response.totalRowCount
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container.dataDetails-container {
  min-height: calc(100vh - 80px);
  background-color: rgba(7, 21, 43, 0.58);
  padding: 0;
  .pagination-container {
    background: transparent;
    padding: 20px 0 0 16px;
  }
  .dataDetails {
    .platform {
      /deep/ .el-scrollbar {
        .el-scrollbar__thumb {
          background-color: transparent;
        }
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
    }
  }
}
.dataDetails .platform {
  border-radius: 15px;
  padding: 10px !important;
  overflow-y: hidden;
}
.dataDetails .platform p {
  color: #ffffff;
}
.dataDetails .platform p.article {
  height: 1px;
  font-size: 12px;
}
.board {
  background-image: url('../../assets/board.png');
  background-size: 100% 100%;
  height: 260px;
}
</style>
<style>
.app-container.dataDetails-container .el-loading-mask {
  background-color: transparent !important;
}
.app-container.dataDetails-container .pagination-container .el-pagination__total{
    color: #ffffff;
  }
  .app-container.dataDetails-container .pagination-container .el-pagination__jump{
    color: #ffffff;
  }
</style>
