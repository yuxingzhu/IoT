<template>
   <div>
    
        <a href="http://192.168.4.1">123</a>
            <button @click="openWindow">
            点击打开窗口                  
      </button>
      <!-- <el-button type="text" @click="open">点击打开 Message Box</el-button> -->
   </div>

   
 </template>
 
 <script>
   export default {
     methods: {
     openWindow() {
  // 创建一个新的窗口并设置其属性
   window.open("http://124.70.165.99:92/", "myWindow", "width=500,height=500")

   }  
}
}
 </script>