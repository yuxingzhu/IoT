<template>
  <div class="app-container">
    <el-row style="margin-left:15%;margin-top:20px">
      <el-col :span="20" class="el-col-span">
        <div class="drawer-item" v-if="true">
          <el-row>
            <el-col :span="3" style="width:13%"><span>侧边栏Logo</span></el-col>
            <el-col :span="6">
              <el-switch v-model.trim="sidebarLogo" @change="updateLogo(sidebarLogo)" class="drawer-switch" />
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="2" class="el-col-span">
        <div style="text-align:center">
          <el-button type="primary" @click="goout()">
            应用配置
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-left:15%;margin-top:20px">
      <el-col :span="20" class="el-col-span">
        <div class="drawer-item" v-if="true">
          <el-row>
            <el-col :span="3" style="width:13%"><span>开启Tags-View</span></el-col>
            <el-col :span="6">
              <el-switch v-model.trim="tagsView" @change="updateTags(tagsView)" class="drawer-switch" />
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-left:15%;margin-top:20px" class="titles">
      <el-col :span="20" class="el-col-span">
        <div class="drawer-item" v-if="true">
          <el-row>
            <el-col :span="3" style="width:13%"><span>标题名称 </span></el-col>
            <el-col :span="5"><span>{{titleName}}</span></el-col>
            <el-col :span="10">
              <el-button type="primary" @click="handleUpdate">更换标题</el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-left:15%;margin-top:30px" class="picture">
      <el-col :span="20" class="el-col-span">
        <div class="drawer-item" v-if="true">
          <el-col :span="14" class="el-col-span">
            <span>Logo图片</span>
          </el-col>
          <el-col :span="10">
            <el-upload class="upload-demo demo" :action="actions" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-preview="handlePreview" :on-error="handleError" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-success="handleSuccess1" :on-progress="onProgress1" :file-list="fileList1" list-type="picture">
              <el-button size="small" type="primary">更换Logo图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传后缀为png，且不超过10MB的图片</div>
            </el-upload>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-left:15%;margin-top:3%" class="picture">
      <el-col :span="20" class="el-col-span">
        <div class="drawer-item" v-if="true">
          <el-col :span="14" class="el-col-span">
            <span>标题图片</span>
          </el-col>
          <el-col :span="10">
            <el-upload class="upload-demo" :action="action" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-preview="handlePreview" :on-error="handleError" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-success="handleSuccess" :on-progress="onProgress" :file-list="fileList" list-type="picture">
              <el-button size="small" type="primary">更换标题图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传后缀为png，且不超过10MB的图片</div>
            </el-upload>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-left:15%;margin-top:3%" class="picture">
      <el-col :span="20" class="el-col-span">

      </el-col>
    </el-row>
    <el-dialog title="更换标题名称" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" size="mini">
        <el-row>
          <el-col>
            <el-form-item label="标题名称" prop="titleName">
              <el-input v-model.trim="temp.titleName"></el-input>
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
import { getList, updateData, updateIcon, updateTagview } from '@/api/overall'
import Cookies from 'js-cookie'
export default {
  components: {},
  data() {
    return {
      fileList: [
        {
          name: '',
          url: '/eco_ftp/' + 'login_title.png'
        }
      ],
      fileList1: [
        {
          name: 'logo.png',
          url: '/eco_ftp/' + 'logo.png'
        }
      ],
      action: process.env.VUE_APP_BASE_API + '/titleConfig/uploadFile',
      actions: process.env.VUE_APP_BASE_API + '/titleConfig/uploadFiles',
      dialogFormVisible: false,
      temp: {
        id: '',
        titleName: ''
      },
      rules: {
        titleName: [
          { required: true, message: '请输入标题名称', trigger: 'blur' }
        ]
      },
      titleConfig: {},
      form: {
        name: ''
      },
      titleName: '',
      sidebarLogo: '',
      tagsView: '',
      logoChange: '',
      tagsChange: ''
    }
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    }
    /**
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },*/
    /**
    sidebarLogo: {
      get() {
        return this.$store.state.settings.setLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'setLogo',
          value: val
        })
      }
    },
    titleName() {
      return this.$store.state.user.titleName
    } */
  },
  created() {
    //this.getList()
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    beforeUpload(file) {
      var isLt5M = file.size / 1024 / 1024 < 10
      if (!isLt5M) {
        this.submiting = false
        this.$notify({
          title: '警告',
          message: '上传图片大小不能超过10MB!',
          type: 'warning'
        })
      }
    },

    handleRemove(file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview(file) {
      // console.log(file)
    },
    handleSuccess(response, file, fileList) {
      if (response.success) {
        this.$notify({
          message: '上传成功',
          type: 'success',
          duration: this.$store.state.settings.duration
        })
      } else {
        fileList.shift()
        this.$notify.error({
          title: '错误',
          message: response.message
        })
      }
    },
    handleError(file, fileList) {
      this.$notify.error({
        title: '错误',
        message: '上传失败！'
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`请确定是否移除该图片？`)
    },
    handleExceed(files, fileList) {
      this.$notify({
        title: '警告',
        message: '上传文件数量超出限制!',
        type: 'warning'
      })
    },
    onProgress(event, file, fileList) {
      const fileName = file.name
      if (fileName.substring(fileName.lastIndexOf('.') + 1) !== 'png') {
        fileList.shift()
        this.$notify({
          title: '警告',
          message: '上传图片后缀须是png!',
          type: 'warning'
        })
      }
    },
    onProgress1(event, file, fileList) {
      const fileName = file.name
      if (fileName.substring(fileName.lastIndexOf('.') + 1) !== 'png') {
        fileList.shift()
        this.$notify({
          title: '警告',
          message: '上传图片后缀须是png!',
          type: 'warning'
        })
      }
    },
    handleSuccess1(response, file, fileList) {
      if (response.success) {
        this.$notify({
          message: '上传成功',
          type: 'success',
          duration: this.$store.state.settings.duration
        })
      } else {
        fileList.shift()
        this.$notify.error({
          title: '错误',
          message: response.message
        })
      }
    },
    getList() {
      getList().then((response) => {
        if (response.success) {
          this.titleConfig = response.data
          this.titleName = this.titleConfig.titleName
          this.sidebarLogo = this.titleConfig.showIcon
          this.tagsView = this.titleConfig.isTagview
          this.tagsChange = this.titleConfig.isTagview
          this.logoChange = this.titleConfig.showIcon
        } else {
          this.titleConfig = {}
          this.sidebarLogo = ''
          this.tagsView = ''
          this.titleName = ''
        }
      })
    },
    handleUpdate(row) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.temp.id = this.titleConfig.id
        this.temp.titleName = this.titleConfig.titleName
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.titleName = this.temp.titleName
          this.dialogFormVisible = false
        }
      })
      /**
      this.$confirm('请确认是否修改该标题？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateData(this.temp).then((response) => {
              this.getList()
              this.dialogFormVisible = false
              this.$store.dispatch('user/logout')
              // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              Cookies.set('EcoTitleName', this.temp.titleName)
              this.$router.push('/login')
            })
          }
        })
      }) */
    },
    updateLogo(logo) {
      this.temp.id = this.titleConfig.id
      this.logoChange = logo
      /**
      updateIcon(this.temp).then((response) => {
        this.getList()
      }) */
    },
    updateTags(tag) {
      this.temp.id = this.titleConfig.id
      this.tagsChange = tag
      /**
      updateTagview(this.temp).then((response) => {
        this.getList()
      }) */
    },
    goout() {
      this.temp.titleName = this.titleName
      this.temp.showIcon = this.logoChange
      this.temp.isTagview = this.tagsChange

      // this.login()

      this.$confirm('请确认是否修改该配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.update(this.temp)
      })
    },
    update(temp) {
      updateData(temp).then(async (response) => {
        await this.$store.dispatch('user/logout', {
          titleName: temp.titleName
        })
        this.$router.push('/login')
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout', {
        titleName: this.temp.titleName
      })
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      // this.$router.push('/login')
    },
    login() {
      // this.$router.push('/login')
    }
  }
}
</script>

<style>
.el-col-span {
  /**text-align: center;*/
  padding: 8px;
  padding-right: 1%;
}

.el-col-button {
  padding: 5%;
}
.font {
  font-size: 15px;
}
.el-upload-list--picture .el-upload-list__item-thumbnail {
  vertical-align: middle;
  display: inline-block;
  width: 90%;
  height: 70px;
  float: left;
  position: relative;
  z-index: 1;
  margin-left: -80px;
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
.app-container {
  height: 550px;
  color: rgba(96, 92, 92, 0.71);
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  margin-top: 0px;
}

.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 3;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }
  .drawer-switch {
    float: right;
  }
}
</style>
<style lang="scss" >
.titles {
  .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: rgba(96, 92, 92, 0.71);
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 14px !important;
  }
}
.picture {
  .el-upload-list--picture .el-upload-list__item {
    overflow: hidden;
    z-index: 0;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: -17%;
    padding: 10px 10px 10px 90px;
    height: 92px;
    /* margin-right: ; */
    margin-left: -107%;
  }
}
.demo {
  .el-upload-list--picture .el-upload-list__item-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 25% !important;
    height: 70px;
    float: left;
    position: relative;
    z-index: 1;
    margin-left: -80px;
    background-color: #1b1a1a33;
  }
  .el-upload-list--picture
    .el-upload-list__item.is-success
    .el-upload-list__item-name {
    display: none;
  }
}
</style>
