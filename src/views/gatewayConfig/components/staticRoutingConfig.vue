<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
              <el-tooltip  content="新增">
                <el-button class="filter-item" icon="el-icon-plus" @click="openEditDialog()" />
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="目标地址" prop="target" align="center" />
      <el-table-column label="子网掩码" prop="subnetMask" align="center" />
      <el-table-column label="下一跳地址" prop="nextAddr" align="center" />
      <el-table-column label="网卡" prop="netCard" align="center" />
      <el-table-column  label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-tooltip content="删除" placement="bottom" style="margin-left:1px">
            <el-button size="small" icon="el-icon-delete" @click="deleteStaticRouting(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="新增静态路由" :visible.sync="editDialogVisible" :close-on-click-modal="false" style="width:150%;margin-left: -19%;" @close="closeEditDialog">
      <div style="margin-top: 0px;">
        <el-form ref="staticRoutingEditForm" :model="staticRoutingEditForm" :rules="staticRoutingEditRules" label-width="100px" size="mini" @submit.native.prevent>
          <fieldset style="padding:10px;color: #00AA72;border-color: #ddd;margin-top:10px;border-width: 0px;-moz-border-radius: 5px; -webkit-border-radius: 5px; -khtml-border-radius: 5px; border-radius: 5px; ">
            <el-row>
              <el-col :span="20">
                <el-form-item label="目标地址" prop="target">
                  <el-input v-model.trim="staticRoutingEditForm.target" :maxlength="200" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="子网掩码" prop="subnetMask">
                  <el-input v-model.trim="staticRoutingEditForm.subnetMask" :maxlength="200" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="下一跳地址" prop="nextAddr">
                  <el-input v-model.trim="staticRoutingEditForm.nextAddr" :maxlength="200" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网卡" prop="valueDescriptorIdentifiers">
                  <el-select v-model.trim="staticRoutingEditForm.netCard" placeholder="请选择">
                    <el-option
                      v-for="item in netCardOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveStaticRouting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getList,
  save,
  del,
  getNetCard
} from '@/api/staticRoutingConfig'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Exportconfig',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        agwId: this.$route.query.edgeDeviceId,
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      editDialogVisible: false,
      staticRoutingEditForm: {
        agwId: this.$route.query.edgeDeviceId,
        target: '',
        nextAddr: '',
        netCard: '',
        subnetMask: ''
      },
      staticRoutingEditRules: {
        target: [
          {
            required: true,
            message: '请输入目标地址!',
            trigger: 'change'
          }
          // { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/[0-9]{2})$/, message: '格式错误，例：10.0.0.0/24' }
        ],
        nextAddr: [
          {
            required: true,
            message: '请输入下一跳地址!',
            trigger: 'change'
          },
          { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '格式错误，例：172.168.0.253' }
        ],
        netCard: [
          {
            required: true,
            message: '请选择网卡!',
            trigger: 'change'
          }
        ],
        subnetMask: [
          {
            required: true,
            message: '请输入子网掩码!',
            trigger: 'change'
          },
          { pattern: /^(?:[1-9]|[12][0-9]|3[012])$/, message: '请输入1-32' }
        ]
      },
      netCardOptions: [
      ]
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.getList()
  },
  methods: {
    getNetCard() {
      const id = {
        agwId: this.$route.query.edgeDeviceId
      }
      getNetCard(id).then(res => {
        if (res.success) {
          this.netCardOptions = []
          if (res.data) {
            res.data.data.forEach(netCard => {
              this.netCardOptions.push(netCard)
            })
          }
        }
      })
    },
    getList() {
      getList(this.listQuery).then(res => {
        if (res.success) {
          this.list = res.data.content
          this.total = res.data.totalElements
        }
      })
    },
    openEditDialog() {
      this.getNetCard()
      this.editDialogVisible = true
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.staticRoutingEditForm.resetFields()
      this.staticRoutingEditForm.id = ''
    },
    saveStaticRouting() {
      this.$refs['staticRoutingEditForm'].validate((valid) => {
        if (valid) {
          save(this.staticRoutingEditForm).then(res => {
            if (res.success) {
              this.$notify({
                message: '保存成功',
                type: 'success',
                duration: this.$store.state.settings.duration
              })
              this.getList()
              this.editDialogVisible = false
            }
          })
        }
      })
    },
    deleteStaticRouting(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row).then(res => {
          if (res.success) {
            this.$notify({
              message: '删除成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.getList()
          }
        })
      })
    }
  }
}
</script>
<style>
.el-divider__text {
  position: absolute;
  background-color: #fff;
  padding: 0 20px;
  color: #30313347;
}
.el-divider--horizontal {
  display: block;
  height: 2px;
  width: 100%;
  margin: 24px 0;
}
</style>
