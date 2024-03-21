<template>
  <el-table
    ref="Table"
    :data="tableData"
    size="mini"
    stripe
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      label="序号"
      type="index"
      width="55"
      align="center"
    />
    <table-column v-for="data in columnData" :key="data.name" :column="data" />
    <el-table-column label="操作" width="300px" align="center" >
      <template slot-scope="scope">
        <slot name="configButton" :row="scope.row" />
      </template>
    </el-table-column>
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
      require: true,
      default: () => {
        return {}
      }
    },
    columnData: {
      type: Array,
      require: true,
      default: () => {
        return {}
      }
    },
    // operationHidden: {
    //   type: Boolean,
    //   default: false
    // }
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
