import {
  login, logout
} from '@/api/user'
import {
  Base64
} from 'js-base64'
import Cookies from 'js-cookie'
import {
  resetRouter
} from '@/router'

const state = {
  realName: Cookies.get('EcoRealName'),
  // operationPermission: Cookies.get('EcoOperationPermission'),
  titleName: Cookies.get('EcoTitleName'),
  showIcon: Cookies.get('EcoShowIcon'),
  isTagview: Cookies.get('EcoIsTagview')
}
const mutations = {
//   NUM_LIST_ADD_DATA(state,token){
//     state.num=token
//     Cookies.set('EcoRealtoken',token, {
//       expires: 365
//     })
// },
  SET_REAL_NAME: (state, realName) => {
    state.realName = realName
    Cookies.set('EcoRealName', realName, {
      expires: 365
    })
  },
  // SET_OPERATION_PERMISSION: (state, operationPermission) => {
  //   state.operationPermission = operationPermission
  //   Cookies.set('EcoOperationPermission', operationPermission, {
  //     expires: 365
  //   })
  // },
  SET_TITLE_NAME: (state, titleName) => {
    state.titleName = titleName
    Cookies.set('EcoTitleName', titleName, {
      expires: 365
    })
  },
  SET_SHOW_ICON: (state, showIcon) => {
    state.showIcon = showIcon
    Cookies.set('EcoShowIcon', showIcon, {
      expires: 365
    })
  },
  SET_IS_TAGVUEW: (state, isTagview) => {
    state.isTagview = isTagview
    Cookies.set('EcoIsTagview', isTagview, {
      expires: 365
    })
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: Base64.encode(password)
      }).then(response => {
        commit('SET_REAL_NAME', response.data.realName)
        // commit('SET_OPERATION_PERMISSION', response.data.operationPermission)
        commit('SET_TITLE_NAME', response.data.titleName)
        commit('SET_SHOW_ICON', response.data.showIcon)
        commit('SET_IS_TAGVUEW', response.data.isTagview)
        resolve()
      }, 10).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit
  }, titleName) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_REAL_NAME', '')
        commit('SET_OPERATION_PERMISSION', '')
        commit('SET_SHOW_ICON', '')
        commit('SET_IS_TAGVUEW', '')
        commit('SET_TITLE_NAME', titleName.titleName)
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
