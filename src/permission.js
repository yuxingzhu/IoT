// import router from './router'  //引入路由
// import NProgress from 'nprogress' // progress bar 
// import 'nprogress/nprogress.css' // progress bar style
// import getPageTitle from '@/utils/get-page-title'
// import { tokento } from '@/api/token.js'
// import { Message } from 'element-ui'
// NProgress.configure({ showSpinner: false }) // NProgress Configuratio
// router.beforeEach((to, from, next) => {
//     setTimeout(() => {
//         // var url = window.location.hash
//         // console.log(to, "to")
//         // console.log(url, "url")
//         // console.log(from, "from")
//         let token1 = to.query.token
//         // console.log(to.query.token, "token")
//         if (token1) {
//             localStorage.setItem('token', token1);
//             // next()
//         }
//         if (localStorage.getItem('token')) {
//             tokento({ token: localStorage.getItem('token') }).then((response) => {
//                 if (response.success == true) {
//                     NProgress.done()
//                     next()
//                     return
//                 } else if (response.success == false) {
//                     let messagetop = response.message
//                     NProgress.done()
//                     Message({ message: messagetop, type: 'error' });
//                     window.top.postMessage({ messagetop }, '*');
//                 }
//                 next()
//             })
//         }
//         else {
//             Message({
//                 message: '请携带token后进入',
//                 type: 'warning'
//             })
//         }
//     }, 500)
//     // let index=url.lastIndexOf("?");
//     // let urldata = url.substring(index,url.length);
//     // var theRequest = new Object()
//     // if (urldata.indexOf('?') != -1) {
//     //  var str = urldata.substr(1)
//     //  let strs = str.split('&')
//     //  for (var i = 0; i < strs.length; i++) {
//     //   theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
//     //  }
//     // }

// })
