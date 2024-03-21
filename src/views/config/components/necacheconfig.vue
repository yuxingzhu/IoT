<template>
  <div style="padding-top: 4%; min-height:300px">
      <el-form ref="cacheEditForm" :model="cacheEditForm" :rules="cacheEditRules" label-width="100px" @submit.native.prevent>
        <el-row type="flex" justify="center">
            <el-form-item label="缓存时间：" prop="day" style="margin-bottom: 35px;">
          <el-input  v-model.trim="cacheEditForm.day" style="width:130px;"></el-input>
            </el-form-item>
            <span style="font-size: 12px;padding: 12px;">天</span>
        </el-row>
        <el-row type="flex" justify="center">
            <el-button  type="primary" icon="fa-save" @click="saveCache" :loading="submiting">更新</el-button>
        </el-row>
      </el-form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getList, updateData } from '@/api/necacheconfig'

export default {
  data() {
    return {
      submiting: false,
      cacheEditForm: {
        agwId: this.$route.query.edgeDeviceId,
        day: '',
        nid: ''
      },
      cacheEditRules: {
        day: [
          {
            required: true,
            message: '请输入天数',
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d*$/,
            message: '天数必须是大于0的整数'
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
      getList(this.cacheEditForm).then(response => {
        if (response.success) {
          this.cacheEditForm.day = response.data.day
          this.cacheEditForm.nid = response.data.nid
        } else {
          this.cacheEditForm.day = 7
        }
      })
    },
    saveCache() {
      this.$refs['cacheEditForm'].validate(valid => {
        if (valid && !this.submiting) {
          this.submiting = true
          updateData(this.cacheEditForm)
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
    }
  }
}
</script>
<style lang="scss" >
@import '~@/styles/variables.scss';
.el-loading-spinner.el-loading-text  {
  color: $el-loading-spinner;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i  {
  color: $el-loading-spinner;
}
</style>
