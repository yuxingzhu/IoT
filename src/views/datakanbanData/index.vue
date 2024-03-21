<template>
  <div>
    <div class="app-container datakanbanData-container" v-if="!isChildren">
      <el-row class="datakanbanData" v-loading="listLoading">
        <el-col :span="5" style="margin-top:20px;margin-left: 3%;" v-for="item in list" :key="item.displayBoardId" class="board">
          <div class="platform">
            <font style="font-size: 15px;margin-left: 30px;color: #ffffff;">{{item.displayBoardName}}</font>
            <!-- <div class="image-type">
              <img :src="item.imagePath" alt="" :onerror="defaultImg">
            </div> -->
            <div>
              <p class="article" :title="item.displayBoardDesc">{{item.displayBoardDesc}}</p>
            </div>
            <div class="details">
              <el-link type="warning" style="float: right;text-decoration:underline;" @click="details(item)">详情</el-link>
            </div>
          </div>
        </el-col>
      </el-row>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" :page-sizes="[12, 24, 50, 100, 500]" @pagination="getList" />
    </div>
    <router-view />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getList } from '@/api/datakanbanData'
export default {
  name: 'datakanbanData',
  components: { Pagination },
  data() {
    return {
      defaultImg: 'this.src="' + require('@/assets/noPicture.jpeg') + '"',
      isChildren: '',
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        displayBoardType: 2,
        currentPage: 1,
        pageSize: 12,
        orderby: 'createTime',
        order: 'desc'
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
    details(row) {
      this.$router.push(`/dataDetails?displayBoardId=${row.displayBoardId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container.datakanbanData-container {
  min-height: calc(100vh - 80px);
  background-color: rgba(7, 21, 43, 0.58);
  padding: 0;
  .pagination-container {
    background: transparent;
    padding: 20px 0 0 16px;
  }
}
.datakanbanData {
  margin-left: 10px;
  margin-right: 10px;
}
.datakanbanData h4 {
  padding: 0;
  margin: 0;
  margin-top: 4px;
}
.datakanbanData .platform {
  border-radius: 15px;
  padding: 10px !important;
  overflow-y: hidden;
}

.datakanbanData .platform .image-type>img {
    width: 75%;
    height: 110px;
    margin-left: 10px;
    margin-top: 20px;
}
.details{
    position: absolute;
    bottom: 40px;
    margin-left: 17%;
}
.datakanbanData .platform p {
  color: #ffffff;
  margin-left: 45px;
  margin-right: 30px;
  // overflow : hidden;
// text-overflow: ellipsis;
// display: -webkit-box;
// -webkit-line-clamp: 3;
// -webkit-box-orient: vertical;
// word-break: break-all;
}
.datakanbanData .platform p.article {
  height: 80px;
  // overflow: hidden;
  font-size: 13px;
  line-height: 22px;
  margin-top: 30px;
}
.buttonCircle {
  border-radius: 8px !important;
}
.board {
  background-image: url('../../assets/board.png');
  background-size: 100% 100%;
  height: 260px;
}
.datakanbanData .platform .image-type{
  text-align: center;
}
</style>
<style>
.app-container.datakanbanData-container .el-loading-mask {
  background-color: transparent !important;
}
.app-container.datakanbanData-container .pagination-container .el-pagination__total{
    color: #ffffff;
  }
  .app-container.datakanbanData-container .pagination-container .el-pagination__jump{
    color: #ffffff;
  }
</style>
