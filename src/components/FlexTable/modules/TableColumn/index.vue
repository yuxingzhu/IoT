<template>
  <el-table-column
    align="center"
    :label="column.label"
    :width="column.width"
  >
    <template slot-scope="scope">
      <table-cell :cell-type-name="column.type">
        <template>
          {{ scope.row[column.name] }}
        </template>
        <template #status>
          <status-cell :cell-value="scope.row[column.name]" />
          {{ scope.row[column.name] }}
        </template>
        <template #format>
          {{ findItemName(column.items, scope.row[column.name]) }}
        </template>
      </table-cell>
    </template>
  </el-table-column>
</template>

<script>
import Vue from 'vue'
import TableCell from '@/components/FlexTable/modules/TableCell/index'

const _ = require('lodash')

Vue.component('status-cell',
  {
    props: {
      cellValue: {
        type: String,
        default: ''
      }
    },
    render: function(createElement) {
      return createElement(
        'i',
        {
          'class': {
            'el-icon-video-play status-success': this.cellValue === '运行中'
          }
        }
      )
    }
  },
)

export default {
  name: 'TableColumn',
  components: { TableCell },
  props: {
    column: {
      type: Object,
      default: () => {
        return {
          label: 'COLUMN_LABEL',
          name: 'COLUMN_NAME',
          width: 'auto',
          type: 'default'
        }
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    findItemName: function(items, value) {
      let itemName = ''
      _.each(items, function(item) {
        if (item.key === value) {
          itemName = item.value
        }
      })
      return itemName === '' ? value : itemName
    }
  }
}
</script>

<style scoped>
  .cell i.status-success{
    font-size: 14px;
    color: #00aa72;
  }
</style>
