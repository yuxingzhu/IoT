<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
 created(){
//   this.getList()
//   this.loading = true
//   this.$store.dispatch('user/login', {password: "abc123@CTS",username: "admin"})
//  .then(() => {
//   this.$router.go(-1)
//   this.loading = false
//   })
//  .catch(() => {
//   this.loading = false
// })
// location. reload()
// this.$router.go(0)
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  },
  components: {}
}
</script>
