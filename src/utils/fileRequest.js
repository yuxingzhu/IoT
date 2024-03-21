import axios from 'axios'
import {Message} from 'element-ui'
import route from '@/router'


const duration = 2 * 1000
let preDate = 0

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // // if the custom code is not 20000, it is judged as an error.
    if (!res) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: duration
      })
      return Promise.reject(new Error("file error"))
    } else {
      return response
    }
  },
  error => {
    const date = new Date().getTime()
    if ((date - preDate) > 2000) {
      preDate = date
      console.log('err' + error) // for debug
      if (error.response.status === 401) {
        // route.push('/login')
      } else {
        Message({
          message: error.response.data.message,
          type: 'error',
          duration: duration
        })
      }
    }

  }
)

export default service
