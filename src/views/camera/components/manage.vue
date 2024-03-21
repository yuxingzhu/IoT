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
            <el-form-item prop="name">
              <el-input v-model.trim="listQuery.name" placeholder="摄像机名称" />
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
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="摄像机名称" prop="name" align="center"></el-table-column>
      <el-table-column label="RTSP地址" prop="path" align="center"></el-table-column>
      <el-table-column label="视频宽度" prop="width" align="center"></el-table-column>
      <el-table-column label="视频高度" prop="height" align="center"></el-table-column>
      <el-table-column label="录像存储策略" prop="function" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.function | functionFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip content="播放">
            <el-button icon="el-icon-video-play" class="elbuttondefault"
 @click="handlePlay(scope.row)"/>
          </el-tooltip>
          <el-tooltip content="修改">
            <el-button icon="el-icon-edit" class="elbuttondefault"
 @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button icon="el-icon-delete" class="elbuttondefault"
 @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini">
        <el-row v-show="false">
          <el-col>
            <el-form-item prop="id">
              <input type="hidden" v-model.trim="temp.id" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="摄像机名称" prop="name">
              <el-input v-model.trim="temp.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="RTSP地址" prop="path">
              <el-input v-model.trim="temp.path"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="视频宽度" prop="width">
              <el-input v-model.trim="temp.width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="视频高度" prop="height">
              <el-input v-model.trim="temp.height"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="录像存储策略" prop="function">
              <el-select v-model.trim="temp.function">
                <el-option v-for="item in functionList" :key="item.value" :label="item.label" :value="item.value">
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
    <el-dialog title="直播" :visible.sync="dialogPlayVisible" width="55%" :close-on-click-modal="false">
      <img :src="playUrl" class="play-img" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  createData,
  updateData,
  deleteData,
  getPlayUrl
} from '@/api/manage'
import Pagination from '@/components/Pagination'

const functionList = [
  {
    value: 'Modect',
    label: '检测到运动时记录视频'
  },
  {
    value: 'Record',
    label: '7*24h记录视频'
  },
  {
    value: 'Monitor',
    label: '7*24h记录和检测运动'
  },
  {
    value: 'Nodect',
    label: '仅当通过zmtrigger触发时记录'
  },
  {
    value: 'None',
    label: '空'
  }
]

const functionKeyValue = formatterList(functionList)

function formatterList(list) {
  return list.reduce((pre, cur) => {
    pre[cur.value] = cur.label
    return pre
  }, {})
}

export default {
  components: { Pagination },
  filters: {
    functionFilter(key) {
      return functionKeyValue[key]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        edgeDeviceId: this.$route.query.edgeDeviceId,
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      temp: {
        id: '',
        name: '',
        path: '',
        width: '',
        height: '',
        function: '',
        edgeDeviceId: this.$route.query.edgeDeviceId
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增摄像机',
        update: '修改摄像机'
      },
      rules: {
        name: [
          { required: true, message: '请输入摄像机名称', trigger: 'blur' }
        ],
        path: [{ required: true, message: '请输入RTSP地址', trigger: 'blur' }],
        width: [
          { required: true, message: '请输入视频宽度', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: '视频宽度必须是正整数',
            trigger: 'blur'
          }
        ],
        height: [
          { required: true, message: '请输入视频高度', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: '视频高度必须是正整数',
            trigger: 'blur'
          }
        ],
        function: [
          { required: true, message: '请选择录像存储策略', trigger: 'change' }
        ]
      },
      functionList: functionList,
      dialogPlayVisible: false,
      playUrl: ''
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val && this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
    },
    dialogPlayVisible(val) {
      if (!val) {
        this.playUrl = ''
      }
    }
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
        deleteData(row.id, row.edgeDeviceId).then(response => {
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
    },
    handlePlay(row) {
      this.dialogPlayVisible = true
      this.$nextTick(() => {
        getPlayUrl(row.id, row.edgeDeviceId).then(response => {
          if (response.success) {
            this.playUrl = response.data
          }
        })
      })
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
