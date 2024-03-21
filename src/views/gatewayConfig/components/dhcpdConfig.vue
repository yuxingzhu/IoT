<template>
  <div style="padding-top: 4%; min-height:680px">
    <el-form ref="dhcpForm" :model="dhcpForm" :rules="schpRules" label-width="120px" @submit.native.prevent>
      <el-row type="flex" justify="center">
        <el-form-item label="DHCP服务器：" style="margin-right:328px">
          <el-radio v-model.trim="dhcpForm.state" label="1">启用</el-radio>
          <el-radio v-model.trim="dhcpForm.state" label="0">不启用</el-radio>
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center">
        <el-form-item label="客户端域：" prop="clientDomain">
          <el-input v-model.trim="dhcpForm.clientDomain" style="width:180px;" />
        </el-form-item>
        <el-form-item label="DNS地址：" prop="dnsAddr">
          <el-input v-model.trim="dhcpForm.dnsAddr" style="width:180px;" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center">
        <el-form-item label="续租时间：" prop="renewalTime">
          <el-input v-model.trim="dhcpForm.renewalTime" style="width:180px;" />
        </el-form-item>
        <el-form-item label="最大租约时间：" prop="maxnewalTime">
          <el-input v-model.trim="dhcpForm.maxnewalTime" style="width:180px;" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center">
        <el-form-item label="地址段：" prop="addrSegment">
          <el-input v-model.trim="dhcpForm.addrSegment" style="width:180px;" />
        </el-form-item>
        <el-form-item label="子网掩码：" prop="subnetMask">
          <el-input v-model.trim="dhcpForm.subnetMask" style="width:180px;" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center">
        <el-form-item label="地址池开始地址：">
          <el-input v-model.trim="addressPool1" style="width:180px;" />
        </el-form-item>
        <el-form-item label="地址池结束地址：">
          <el-input v-model.trim="addressPool2" style="width:180px;" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center" style="margin-right:300px">
        <el-form-item label="默认网关：" prop="defaultGateway">
          <el-input v-model.trim="dhcpForm.defaultGateway" style="width:180px;" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center" style="margin-left:10px;margin-top:20px">
        <el-button  type="primary" icon="fa-save" :loading="submiting" @click="deleteOrSave">保存</el-button>
        <!-- <el-button v-if="operationPermission==0" type="primary" icon="fa-save" :loading="submiting" @click="deleteData">删除</el-button> -->
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getList, updateData, deleteData } from '@/api/dhcpConfig'

export default {
  data() {
    return {
      submiting: false,
      list: [],
      listQuery: {
        agwId: this.$route.query.edgeDeviceId,
        currentPage: 1,
        pageSize: 10,
        orderby: '',
        order: 'desc'
      },
      dhcpForm: {
        id: '',
        agwId: this.$route.query.edgeDeviceId,
        clientDomain: '',
        dnsAddr: '',
        renewalTime: '',
        maxnewalTime: '',
        addrSegment: '',
        subnetMask: '',
        defaultGateway: '',
        addressPool: '',
        state: ''
      },
      addressPool1: '',
      addressPool2: '',
      schpRules: {
        clientDomain: [
          {
            required: true,
            message: '请输入客户端域',
            trigger: 'blur'
          }
        ],
        dnsAddr: [
          {
            required: true,
            message: '请输入DNS地址',
            trigger: 'blur'
          }
        ],
        renewalTime: [
          {
            required: true,
            message: '请输入续租时间',
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d*$/,
            message: '续租时间必须是大于0的整数'
          }
        ],
        maxnewalTime: [
          {
            required: true,
            message: '请输入最大租约时间',
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d*$/,
            message: '最大租约时间必须是大于0的整数'
          },
          {
            validator: (rule, value, callback) => {
              if (parseInt(value) < parseInt(this.dhcpForm.renewalTime)) {
                callback('续租时间必须小于最大租约时间!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        addrSegment: [
          {
            required: true,
            message: '请输入地址段',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
              var valuedata = value
              if (reg.test(valuedata) === false) {
                callback('输入的ip地址段格式不正确!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        subnetMask: [
          {
            required: true,
            message: '请输入子网掩码',
            trigger: 'blur'
          },
          {
            pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/,
            message: '子网掩码格式不正确'
          }
        ],
        defaultGateway: [
          {
            required: true,
            message: '请输入默认网关',
            trigger: 'blur'
          },
          {
            pattern: /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/,
            message: '默认网关格式不正确'
          }
        ],
        addressPool: [
          {
            validator: (rule, value, callback) => {
              this.dhcpForm.addressPool = this.addressPool1 + ',' + this.addressPool2
              var valueTwo = value.split(',')
              var valueFirst = valueTwo[0]
              var valueSecond = valueTwo[1]
              if (valueFirst === '' || valueSecond === '') {
                callback('请输入地址池!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
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
      getList(this.listQuery).then(response => {
        if (response.success) {
          if (response.data.length !== 0) {
            var address = response.data[0].addressPool.split(',')
            this.dhcpForm.id = response.data[0].id
            this.dhcpForm.clientDomain = response.data[0].clientDomain
            this.dhcpForm.dnsAddr = response.data[0].dnsAddr
            this.dhcpForm.renewalTime = response.data[0].renewalTime
            this.dhcpForm.maxnewalTime = response.data[0].maxnewalTime
            this.dhcpForm.addrSegment = response.data[0].addrSegment
            this.dhcpForm.subnetMask = response.data[0].subnetMask
            this.dhcpForm.defaultGateway = response.data[0].defaultGateway
            this.addressPool1 = address[0]
            this.addressPool2 = address[1]
            this.dhcpForm.addressPool = this.addressPool1 + ',' + this.addressPool2
            this.dhcpForm.state = response.data[0].state
          } else {
            this.dhcpForm.id = ''
            this.dhcpForm.clientDomain = ''
            this.dhcpForm.dnsAddr = ''
            this.dhcpForm.renewalTime = ''
            this.dhcpForm.maxnewalTime = ''
            this.dhcpForm.addrSegment = ''
            this.dhcpForm.subnetMask = ''
            this.dhcpForm.defaultGateway = ''
            this.addressPool1 = ''
            this.addressPool2 = ''
            this.dhcpForm.addressPool = ''
            this.dhcpForm.state = '0'
          }
        } else {
          this.dhcpForm.id = ''
          this.dhcpForm.clientDomain = ''
          this.dhcpForm.dnsAddr = ''
          this.dhcpForm.renewalTime = ''
          this.dhcpForm.maxnewalTime = ''
          this.dhcpForm.addrSegment = ''
          this.dhcpForm.subnetMask = ''
          this.dhcpForm.defaultGateway = ''
          this.addressPool1 = ''
          this.addressPool2 = ''
          this.dhcpForm.addressPool = ''
          this.dhcpForm.state = '0'
        }
      })
    },
    deleteOrSave() {
      if (this.dhcpForm.state === '0') {
        this.deleteData()
      } else if (this.dhcpForm.state === '1') {
        this.saveCache()
      }
    },
    saveCache() {
      this.$refs['dhcpForm'].validate(valid => {
        if (valid && !this.submiting) {
          this.submiting = true
          this.dhcpForm.addressPool = this.addressPool1 + ',' + this.addressPool2
          updateData(this.dhcpForm)
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
    deleteData() {
      this.$refs['dhcpForm'].validate(valid => {
        if (valid && !this.submiting) {
          deleteData(this.dhcpForm)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: response.message,
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.getList()
                this.connectionType = ''
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '请求出错！'
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
