<template>
  <div>
    <slot :name="cellTypeName"></slot>
  </div>
</template>

<script>
export default {
  name: 'TableCell',
  props: {
    cellTypeName: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style scoped>

</style>
