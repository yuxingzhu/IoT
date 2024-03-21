<template>
  <div style="padding-top: 4%; min-height:680px">
    <el-form ref="tapEditForm" :model="tapEditForm" :rules="tapEditRules" label-width="100px" @submit.native.prevent>
      <el-row type="flex" justify="center">
        <el-form-item label="tab接口桥接：" prop="state" style="margin-bottom: 35px; margin-left: -170px">
          <el-radio v-model.trim="tapEditForm.state" label="1">启用</el-radio>
          <el-radio v-model.trim="tapEditForm.state" label="0">不启用</el-radio>
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center">
        <el-form-item label="IP地址：" prop="ipAddr" style="margin-bottom: 35px; margin-left: -120px">
          <el-input v-model.trim="tapEditForm.ipAddr" placeholder="请输入内容" style="width:200px;" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center">
        <el-form-item label="子网掩码：" prop="netmask" style="margin-bottom: 35px; margin-left: -120px">
          <el-input v-model.trim="tapEditForm.netmask" placeholder="请输入内容" style="width:200px;" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center">
        <el-form-item label="网卡：" prop="netCard" style="margin-bottom: 35px; margin-left: -120px">
          <el-select v-model.trim="tapEditForm.netCard" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in netCardOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center">
        <!-- <el-button v-if="operationPermission==0" type="primary" icon="fa-delete" :loading="submiting" style="margin-bottom: 35px; margin-left: -120px" @click="deleteCache">删除</el-button> -->
        <el-button  type="primary" icon="fa-save" :loading="submiting" style="margin-bottom: 35px; margin-left: -120px" @click="saveCache">保存</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getList,
  updateData,
  getNetCard
  // getBridge
} from '@/api/tapInterConfig'

export default {
  data() {
    return {
      submiting: false,
      tapEditForm: {
        agwId: this.$route.query.edgeDeviceId,
        id: '',
        ipAddr: '',
        netmask: '',
        netCard: '',
        state: '0'
      },
      tapEditRules: {
        ipAddr: [
          {
            required: true,
            message: '请输入ip地址!',
            trigger: 'change'
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: '请输入正确的IP地址'
          }
        ],
        netmask: [
          {
            required: true,
            message: '请输入子网掩码',
            trigger: 'blur'
          },
          {
            pattern: /^(?:[1-9]|[12][0-9]|3[012])$/,
            message: '子网掩码填写区间为1-32之间'
          }
        ],
        netCard: [
          {
            required: true,
            message: '请选择网卡!',
            trigger: 'change'
          }
        ]
      },
      // bridgeNameOptions: [],
      netCardOptions: [],
      radio: ''
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.getList()
    this.getNetCard()
    // this.getBridge()
  },
  methods: {
    // getBridge() {
    //   const id = {
    //     agwId: this.$route.query.edgeDeviceId
    //   }
    //   getBridge(id).then(res => {
    //     if (res.success) {
    //       this.bridgeNameOptions = res.data
    //     }
    //   })
    // },
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
      // bridgeNameOptions
    },
    getList() {
      getList(this.tapEditForm).then(response => {
        if (response.success) {
          if (response.data) {
            this.tapEditForm = {
              agwId: this.$route.query.edgeDeviceId,
              id: response.data.id,
              ipAddr: response.data.ipAddr,
              netmask: response.data.netmask,
              netCard: response.data.netCard,
              state: response.data.state
            }
          } else {
            this.tapEditForm = {
              agwId: this.$route.query.edgeDeviceId,
              id: '',
              ipAddr: '',
              netmask: '',
              netCard: '',
              state: '0'
            }
          }
        } else {
          // this.cacheEditForm.day = 90
        }
      })
    },
    saveCache() {
      this.$refs['tapEditForm'].validate(valid => {
        if (valid && !this.submiting) {
          this.submiting = true
          updateData(this.tapEditForm)
            .then(response => {
              this.submiting = false
              if (response.success) {
                this.$notify({
                  message: response.message,
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.getList()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '请求出错！'
                })
              }
            })
            .catch(error => {
              this.submiting = false
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
    clear() {
      this.$refs.tapEditForm.resetFields()
      this.tapEditForm.agwId = this.$route.query.edgeDeviceId
      this.tapEditForm.id = ''
    }
  }
}
</script>
