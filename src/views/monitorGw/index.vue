  <template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="24" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item prop="alarmLevel">
              <el-select v-model.trim="listQuery.alarmLevel" placeholder="告警级别">
                <el-option v-for="item in monitorList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="datetime">
              <el-date-picker v-model.trim="listQuery.datetime" :editable="false" :clearable="false" type="datetimerange" start-placeholder="告警开始时间" end-placeholder="告警开始时间" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
            <el-form-item prop="edgeDeviceName">
                <el-input v-model.trim="listQuery.edgeDeviceName" placeholder="告警网关名称"></el-input>
            </el-form-item>
            <el-form-item prop="alarmInfo">
                <el-input  v-model.trim="listQuery.alarmInfo" placeholder="告警信息关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQuery"/>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="handleFilter"/>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-tooltip content="导出">
                <el-button   icon="el-icon-download" @click="onload"/>
              </el-tooltip>
            </el-form-item>
            
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="告警项名称" prop="edgeDeviceName" align="center"></el-table-column>
      <el-table-column label="告警网关" prop="agwName" align="center"></el-table-column>
      <el-table-column label="告警名称" prop="alarmName" align="center"></el-table-column>
      <el-table-column label="告警信息" prop="alarmInfo" align="center"></el-table-column>
      <el-table-column label="告警级别" prop="alarmLevel" align="center"></el-table-column>
      <el-table-column label="告警时间" prop="alarmStartTime" align="center"></el-table-column>
      <el-table-column label="处理状态" prop="dealStatusName" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.dealStatusName === '未处理' ? 'offline' : 'online'" />
          <span>{{ scope.row.dealStatusName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理描述" prop="dealDesc" align="center"></el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-tooltip content="处理">
            <el-button class="elbuttondefault" :disabled="scope.row.dealStatusName != '未处理'" icon="el-icon-edit" @click="handleUpdate(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="temp" label-width="100px" size="mini" @submit.native.prevent>
        <el-row>
          <el-col>
            <el-form-item label="处理描述" prop="dealDesc">
              <el-input type="textarea" :rows="2" v-model.trim="temp.dealDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList, updateData } from '@/api/monitorGw'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        alarmLevel: '',
        datetime: '',
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'alarmStartTime',
        order: 'desc',
        edgeDeviceName:'',
        alarmInfo:''
      },
      temp: {
        gwAlarmId: '',
        dealStatus: true,
        dealDesc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '处理告警信息'
      },
      monitorList: [
        {
          value: 1,
          label: '严重'
        },
        {
          value:2,
          label: '紧急'
        },
        {
          value: 3,
          label: '一般'
        }

      ]
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
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
    },
    dialogFormVisible(val) {
      if (!val && this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
    }
  },
  created() {
    this.getList()
    // console.log(this.$route.query.edgeDeviceName)
    this.listQuery.edgeDeviceName = this.$route.query.edgeDeviceName;
    // console.log(this.listQuery.edgeDeviceName,"4322")
  },
  methods: {
    onload() {
      let size = this.listQuery.pageSize;
      this.listQuery.pageSize = 1000000;
      getList(this.listQuery).then((response) => {
        console.log(response)
        this.listQuery.pageSize = 10;
        if (response.success) {
          let arrs = [];
          arrs = response.data;
          arrs.map((el,index) => {
            if (el.status == true) {
              el.status = "正常"
            } else {
              el.status = "告警"
            }
            el.index = index / 1 + 1;
          })
          this.$nextTick(() => {
            this.exportExcel(arrs);
          });
        }
      });
    },
    exportExcel(arr) {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../Excel/Export2Excel"); //注意这个Export2Excel路径
        const tHeader = [
          "序号",
          "告警项名称",
          "告警网关",
          "告警名称",
          "告警信息",
          "告警级别",
          "告警时间",
          "处理状态",
          "处理描述"
        ]; // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "index",
          "edgeDeviceName",
          "agwName",
          "alarmName",
          "alarmInfo",
         "alarmLevel",
          "alarmStartTime",
          "dealStatusName",
          "dealDesc"
        ]; // 上面的index、nickName、name是tableData里对象的属性key值
        const list1 = arr; //把要导出的数据tableData存到list
        const data = this.formatJson(filterVal, list1);
        export_json_to_excel(tHeader, data, "网关告警"); //最后一个是表名字
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
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
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.temp.gwAlarmId = row.gwAlarmId
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
    }
  }
}
</script>
<style>

.el-button--default{
  border-radius: 5px !important;
}
.elbuttondefault{
  background: #ffffff !important;
  color: #000000 !important;
}
</style>
