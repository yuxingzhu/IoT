<template>
  <el-card :shadow="shadow" class="flex__card">
    <div v-if="showHeader" slot="header" class="clearfix">
      <span>{{ title }}</span>
    </div>
    <div>
      <slot />
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'FlexCard',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    shadow: {
      type: String,
      default: 'never'
    }
  }
}
</script>

<style scoped>

</style>
