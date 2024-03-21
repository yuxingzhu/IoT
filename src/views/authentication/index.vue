<template>
  <div class="app-container auth">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" style="text-align: center;" @submit.native.prevent>
        <el-row>
          <el-col :span="8" class="el-col-span"><span class="font">数据中心认证密钥</span></el-col>
          <el-col :span="8">
            <el-form-item prop="secretKey">
              <el-input v-model.trim="listQuery.secretKey" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button icon="el-icon-s-ticket" @click="randomSecretKey" >生成随机密钥</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="el-col-button">
            <el-button icon="el-icon-s-ticket" @click="saveSecretKey" :loading="submiting" >保存密钥</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getList, getRandomSecretKey, createData } from '@/api/authentication'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      submiting: false,
      listQuery: {
        secretKey: ''
      },
      rules: {
        secretKey: [
          {
            required: true,
            message: '请输入数据中心认证秘钥',
            trigger: 'blur'
          },
          {
            pattern: /^[A-Za-z0-9]{32,32}$/,
            message: '必须长度为32位并由字母、数字组成'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  methods: {
    getList() {
      getList().then(response => {
        if (response.success) {
          this.listQuery.secretKey = response.data.secretKey
        } else {
          this.listQuery.secretKey = ''
        }
      })
    },
    saveSecretKey() {
      this.$refs['listQuery'].validate(valid => {
        if (valid && !this.submiting) {
          this.submiting = true
          createData(this.listQuery.secretKey)
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
    randomSecretKey() {
      getRandomSecretKey().then(response => {
        if (response.success) {
          this.listQuery.secretKey = response.secretKey
        } else {
          this.listQuery.secretKey = ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container.auth {
  height: 80vh;
  .el-col-span {
    text-align: end;
    padding: 8px;
    padding-right: 1%;
  }
  .el-col-button {
    padding: 5%;
  }
  .font {
    font-size: 15px;
  }
}
</style>
