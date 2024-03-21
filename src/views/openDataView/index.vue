<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="返回" placement="bottom">
                <el-button @click="$router.back(-1)">
                  <svg-icon icon-class="back" />返回
                </el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="datetime">
              <el-date-picker v-model.trim="listQuery.datetime" :editable="false" :clearable="false" type="datetimerange" start-placeholder="采集开始时间" end-placeholder="采集开始时间" value-format="yyyy-MM-dd HH:mm:ss" />
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
    <el-table v-loading="dataViewLoading" :data="headerList.slice((currentPage-1)*PageSize,currentPage*PageSize)" stripe size="mini">
      <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column
          label="设备状态信息"
          prop="deviceStatus"
          align="center"
        >
          <!-- <template scope="scope">
            <span>{{ scope.row.edgeDeviceName }}</span>
          </template> -->
        </el-table-column>
        <!-- <el-table-column label="历史总生产床网张数L" prop="bedTotal" align="center" /> -->
        <!-- <el-table-column label="历史总开机时间L"   prop="productionTotalTime" align="center" /> -->
        <!-- <el-table-column
          label="当前班次已经完成的床张数"
          prop="completedQuantity"
          align="center"
  
        /> -->
        <el-table-column
          label="当前班次计划生产的床张数"
          prop="plannedQuantity"
          align="center"
        />
        <!-- <el-table-column
          label="当前班次设备开电时间"
          prop="time"
     
          align="center"
        /> -->
        <!-- <el-table-column
          label="当前班次设备运行时间"
          prop="runTime"
        
          align="center"
        /> -->
        <el-table-column
          label="当前班次设备报警时间"
          prop="alarmTime"
      
          align="center"
        />
        <el-table-column
          label="当前生产节拍时间"
          prop="productionTime"

          align="center"
        />
        <el-table-column
          label="当前床规格_排数"
          prop="CurrentBedRule"
      
          align="center"
        />
        <el-table-column
          label="当前床规格_每一排弹簧数"
          prop="CurrentBedCounts"
    
          align="center"
        />
        <el-table-column
          label="当前床规格_床的宽度"
          prop="currentBedWidth"
      
          align="center"
        />
        <el-table-column
          label="当前床规格_床的长度"
          prop="currentBedLength"
    
          align="center"
        />
        <el-table-column
          label="当前床规格_弹簧高度"
          prop="currentBedHeight"

          align="center"
        />
                <el-table-column
          label="采集时间"
          prop="acquisitionTime"

          align="center"
        />
      
      <!-- <div v-if="headerList.length > 0">
        <el-table-column label="序号" type="index" width="80" align="center" fixed />
      </div>
      <div v-if="dataViewList.length > 7">
        <el-table-column v-for="item in headerList" :key="item.name" :prop="item.name" :label="item.labelName" align="center" :fixed="item.name === 'createTime'">
          <template slot-scope="scope">
            {{scope.row[item.name]}}
          </template>
        </el-table-column>
      </div>
      <div v-if="dataViewList.length < 8">
        <el-table-column v-for="item in headerList" :key="item.name" :prop="item.name" :label="item.labelName" align="center" :fixed="item.name === 'createTime'">
          <template slot-scope="scope">
            {{scope.row[item.name]}}
          </template>
        </el-table-column>
      </div> -->

    </el-table>
    <el-pagination @size-change="handleSizeChange" 
                          @current-change="handleCurrentChange" 
                          :current-page="currentPage" 
                          :page-sizes="pageSizes" 
                          :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" 
                          :total="totalCount">
             </el-pagination>


    <!-- <pagination v-show="dataViewTotal>0" :total="dataViewTotal" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
  </div>
</template>

<script>
import moment from 'moment'
import { getDataViewList } from '@/api/device'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      
        tableData:[],
       
           currentPage:10,
                totalCount:4,
  
           pageSizes:[10,20,30,40],
      
           PageSize:10,
      headerList: [],
      dataViewList: [],
      dataViewTotal: 0,
      dataViewLoading: true,
      listQuery: {
        // deviceId:"",
        // agwId: '',
        deviceName: '',
        // profileNid: '',
        // datetime: '',
        // startTime: '',
        // endTime: '',
        // currentPage: 1,
        // pageSize: 10
      }
    }
  },
  watch: {
    'listQuery.datetime'(val) {
      if (val) {
        this.listQuery.startTime = val[0]
        this.listQuery.endTime = val[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
    }
  },
  created() {
    // this.listQuery.deviceId = this.$route.query.deviceName
    // this.listQuery.agwId = this.$route.query.agwId
    this.listQuery.deviceName = this.$route.query.deviceName
    // this.listQuery.profileNid = this.$route.query.profileNid
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
           // 改变每页显示的条数 
           this.PageSize=val
           // 注意：在改变每页显示的条数时，要将页码显示到第一页
           this.currentPage=1
       },
         // 显示第几页
       handleCurrentChange(val) {
           // 改变默认的页数
           this.currentPage=val
       },

    getList() {
      this.dataViewLoading = true
      // console.log(this.listQuery,"sdasdsadasdasdss")
      getDataViewList(this.listQuery).then((response) => {
        // console.log(response.data,"response2321312312")
        // if(!response.data) return
        if (response.data.length > 0) {
          this.headerList = response.data
          this.totalCount=response.data.length
          let add =response.data
          this.dataViewList = response.dataList
    
          const convertedArray = add.map( obj => {
            const objdata =JSON.parse(obj)
                //  console.log(objdata,"convertedArrayconvertedArray")
        //     if (obj._id && obj._id["$oid"]) {
        //      obj._id = obj._id["$oid"];
        //  }
                // return obj;  
                 return objdata;
            // console.log(convertedArray,"convertedArrayconvertedArray")
          })
          this.headerList = convertedArray
          console.log( this.headerList," this.headerList第三方")
          this.headerList.map((el,index)=>{
             if(el.deviceStatus==0){
              el.deviceStatus="控制器错误"
             }else if(el.deviceStatus==1){
              el.deviceStatus="自动运行"
             }else if(el.deviceStatus==11){
              el.deviceStatus="手动模式"
             }else{
              el.deviceStatus="报警"
             }
            //  el.dataViewList.productionTotalTime =  el.dataViewList.productionTotalTime/10+"H",
            //  el.dataViewList.time =  el.dataViewList.time/10+"H",
            //  el.dataViewList.runTime =  el.dataViewList.runTime/10+"H",
            //  el.dataViewList.downTime =  el.dataViewList.downTime/10+"H"
            //  el.dataViewList.alarmTime =  el.dataViewList.alarmTime/10+"H",
            //  el.dataViewList.productionTime =  el.dataViewList.productionTime/10+"H"
            //  el.dataViewList.CurrentBedWidth =  el.dataViewList.CurrentBedWidth/10+"H",
            //  el.dataViewList.CurrentBedLength =  el.dataViewList.CurrentBedLength/10+"H"
            //  el.dataViewList.CurrentBedHeight =  el.dataViewList.CurrentBedHeight/10+"H"
          }),
          this.dataViewTotal = response.totalRowCount
        } else {
          this.dataViewList = []
          this.dataViewTotal = 0
          this.headerList = []
        }
        this.dataViewLoading = false
      })
    },
    resetQuery() {
      this.$refs['filterForm'].resetFields()
    },
    handleFilter() {
      // this.listQuery.currentPage = 1
      this.getList()
    }
  }
}
</script>
