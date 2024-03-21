<template>
  <el-row :gutter="40" class="card__moudle">
    <template v-if=" tips == '' || typeof(tips) == undefined">
      <el-col :span="24">
        <fieldset>
          <legend>
            <span>{{ legend }}</span>
          </legend>
          <div>
            <slot />
          </div>
        </fieldset>
      </el-col>
    </template>
    <template v-else>
      <el-col :span="3" class="card__tips">
        {{ tips }}
      </el-col>
      <el-col :span="21">
        <fieldset>
          <legend>
            <span>{{ legend }}</span>
          </legend>
          <div>
            <slot />
          </div>
        </fieldset>
      </el-col>
    </template>
  </el-row>
</template>

<script>
export default {
  name: 'CardForm',
  props: {
    tips: {
      type: String,
      default: ''
    },
    legend: {
      type: String,
      default: '概述信息'
    }
  }
}
</script>

<style scoped>

</style>
