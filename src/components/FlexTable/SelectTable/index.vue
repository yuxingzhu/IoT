<template>
  <el-table
    ref="multipleTable"
    :data="tableData"
    size="mini"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="selection"
      width="55"
    />
    <table-column v-for="data in columnData" :key="data.name" :column="data" />
  </el-table>
</template>

<script>
import TableColumn from '@/components/FlexTable/modules/TableColumn/index'

export default {
  name: 'FlexTable',
  components: { TableColumn },
  props: {
    tableData: {
      type: Array,
      require: true
    },
    columnData: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      multipleSelection: []
    }
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.info(val)
    }
  }
}
</script>

<style scoped>

</style>
