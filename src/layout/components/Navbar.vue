<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click" placement="bottom">
        <div class="avatar-wrapper">
          <i class="el-icon-s-custom"><span>{{realName}}</span></i>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="openChangePwdDialog">修改密码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
        <i class="el-icon-switch-button" @click="logout" id="logout" style="cursor: pointer"><span style="font-size: 13px;margin-left: 8px"></span></i>
      </el-tooltip>
    </div>

    <el-dialog :title="editDialogTitle" :visible.sync="changePwdDialogVisible" :modal="true" :close-on-click-modal="false" :modal-append-to-body="false" @close="closeChangePwdDialog">
      <div>
        <el-form ref="changePwdForm" :model="changePwdForm" :rules="changePwdRules" label-width="100px" size="mini">
          <el-row>
            <el-col :span="20">
              <el-form-item label="原密码" prop="prepassword">
                <el-col :span="22">
                  <el-input v-model.trim="changePwdForm.prepassword" type="password" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="新密码" prop="password">
                <el-col :span="22">
                  <el-input v-model.trim="changePwdForm.password" type="password" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="确认新密码" prop="repassword">
                <el-col :span="22">
                  <el-input v-model.trim="changePwdForm.repassword" type="password" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeChangePwdDialog">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="changePasswd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { editPassword } from '@/api/sys/user'
import { getList } from '@/api/overall'
import Cookies from 'js-cookie'
export default {
  components: {
    Hamburger,
    Breadcrumb
  },
  data() {
    return {
      submiting: false,
      editDialogTitle: '',
      changePwdDialogVisible: false,
      changePwdForm: {
        id: '',
        prepassword: '',
        password: '',
        repassword: ''
      },
      changePwdRules: {
        prepassword: [
          {
            required: true,
            message: '请输入原密码!',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入新密码!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\sA-Za-z0-9])\S{8,}$/.test(
                  value
                )
              ) {
                callback('密码由至少8位大小写字母、数字和特殊符号组成!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        repassword: [
          {
            required: true,
            message: '请重新输入新密码!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\sA-Za-z0-9])\S{8,}$/.test(
                  value
                )
              ) {
                callback('密码由至少8位大小写字母、数字和特殊符号组成!')
              } else if (value !== this.changePwdForm.password) {
                callback('两次输入密码不一致!')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        showIcon: '',
        name: '',
        isTagview: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'realName',
      // 'operationPermission',
      'titleName'
    ])
  },
  created() {
    // this.getList()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout', { titleName: this.name })
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push('/login')
    },
    changePasswd() {
      this.$refs['changePwdForm'].validate((valid) => {
        if (valid) {
          editPassword(this.changePwdForm)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: '保存成功',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.closeChangePwdDialog()
                this.$store.dispatch('user/logout', { titleName: this.name })
                this.$router.push('/login')
              } else {
                this.$notify.error({
                  title: '错误',
                  message: response.message
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
    },
    openChangePwdDialog() {
      this.editDialogTitle = '修改密码'
      this.changePwdDialogVisible = true
      this.changePwdForm.prepassword = ''
    },
    closeChangePwdDialog() {
      this.changePwdDialogVisible = false
      this.$refs.changePwdForm.resetFields()
    },
    getList() {
      getList().then((response) => {
        if (response.success) {
          this.titleConfig = response.data
          this.showIcon = this.titleConfig.showIcon
          this.name = this.titleConfig.titleName
        } else {
          this.titleConfig = {}
          this.showIcon = ''
          this.name = ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #0623c987;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 0px solid $navbar-border-color;
  #logout {
    color: $greenText;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #ffffff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      i {
        span {
          margin-left: 8px;
          font-size: 13px;
        }
      }
      .avatar-wrapper {
        position: relative;
        font-size: 18px;
        color: $greenText;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-switch-button {
          color: #ffffff;
          cursor: pointer;
          span {
          }
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          top: 20px;
          right: -20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
