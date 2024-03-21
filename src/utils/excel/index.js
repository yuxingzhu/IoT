import { jsonToExcel } from './vendor/Export2Excel'

// 行转列
function formatJson(filterVal, jsonData) {
	return jsonData.map(v =>
		filterVal.map(j => {
			return v[j]
		})
	)
}

let CURRENT_CELL_INDEX = 0
// https://segmentfault.com/q/1010000023268006?utm_source=tag-newest
// 转换数字到EXCEL单元格编号
function numberToCellCode(number) {
	let s = ''
	while (number > 0) {
		let m = number % 26
		if (m === 0) m = 26
		s = String.fromCharCode(m + 64) + s
		number = (number - m) / 26
	}
	return s
}

// 获取跨列
function getColspan(column) {
	var colspan = 0
	var children = column.children || []
	for (var i = 0; i < children.length; i++) {
		var item = children[i]
		if (item.children && item.children.length > 0) {
			colspan += getColspan(item)
		} else {
			colspan += 1
		}
	}
	if (colspan == 0) {
		colspan = 1
	}
	return colspan
}

// 获取跨列
function getRowspan(column, maxLevel) {
	let rowspan = 1
	if (!column.children || column.children.length == 0) {
		rowspan = maxLevel - column.level + 1
	}
	return rowspan
}

// 获取最大层级
function setCellCode(columns, parentNode) {
	columns.forEach((li, index) => {
		if (!CURRENT_CELL_INDEX) {
			CURRENT_CELL_INDEX = 1
		} else {
			CURRENT_CELL_INDEX++
		}
		if (parentNode && index == 0) {
			CURRENT_CELL_INDEX = parentNode.CellIndex
		}
		li.CellIndex = CURRENT_CELL_INDEX
		li.CellCode = numberToCellCode(CURRENT_CELL_INDEX)
		const children = li.children
		if (children && children.length > 0) {
			setCellCode(children, li)
		}
	})
}

// 获取最大层级
function getLevels(columns, parentNode) {
	const levels = []
	columns.forEach((li, index) => {
		li.level = parentNode ? parentNode.level + 1 : 0
		levels.push(li.level)
		const children = li.children
		if (children && children.length > 0) {
			const result = getLevels(children, li)
			levels.push(...result)
		}
	})
	return levels
}

// 设置合并
function setMerges(columns = [], maxLevel, multiHeader = [], merges = []) {
	const cols = []
	columns.forEach((li, index) => {
		const level = li.level + 1
		const cellIndex = li.CellIndex - 1
		const CellCode = li.CellCode
		const cellTitle = li.label
		const colSpan = getColspan(li)
		const rowSpan = getRowspan(li, maxLevel)

		li.colSpan = colSpan
		li.rowSpan = rowSpan
		li.isLeaf = !(li.children != undefined && li.children.length > 0)
		if (!multiHeader[level - 1]) {
			multiHeader[level - 1] = []
		}

		if (rowSpan > 1) {
			merges.push(`${CellCode}${level}:${CellCode}${level + rowSpan - 1}`)
			multiHeader[level - 1][cellIndex] = cellTitle
			for (let i = 1; i < rowSpan; i++) {
				if (!multiHeader[level - 1 + i]) {
					multiHeader[level - 1 + i] = []
				}
				multiHeader[level - 1 + i][cellIndex] = ''
			}
		} else {
			multiHeader[level - 1][cellIndex] = cellTitle
		}
		if (colSpan > 1) {
			let endCellIndex = cellIndex + 1
			const emptyCell = []
			for (let i = 1; i < colSpan; i++) {
				endCellIndex++
				emptyCell.push('')
			}
			const endCellCode = numberToCellCode(endCellIndex)
			multiHeader[level - 1].splice(cellIndex + 1, 0, ...emptyCell)
			merges.push(`${CellCode}${level}:${endCellCode}${level}`)
		}
		const children = li.children
		if (children && children.length > 0) {
			const ret = setMerges(children, maxLevel, multiHeader, merges)
			if (ret) {
				cols.push(...ret)
			}
		} else {
			cols.push(li)
		}
	})
	return cols
}

function getFields(columns, maxLevel) {
	const fields = []
	columns.forEach(li => {
		if (li.isLeaf) {
			fields.push(li.prop)
		}
		const children = li.children
		if (children && children.length > 0) {
			const depResult = getFields(children, maxLevel)
			fields.push(...depResult)
		}
	})
	return fields
}

/**
 * 文件导出
 * @param tableData {Array} 数据源
 * @param columns {Array} 列
 * @param config {Object} 配置项
 */
export function exportToExcel(tableData, columns2, config) {
	const option = {
		filename: '数据导出',
		autoWidth: true,
		bookType: 'xlsx',
		width: [],
		height: []
	}
	if (config) {
		Object.assign(option, config)
	}
	// debugger
	const columns = [...columns2]
	let multiHeader = []
	const header = []
	const merges = []
	CURRENT_CELL_INDEX = 0
	setCellCode(columns, null, null)
	// console.log('setCellCode', columns)
	// 最大层级集合
	const allLevels = getLevels(columns, null)
	// 获取最大层级
	const maxLevel = Math.max(...allLevels)
	// console.log(maxLevel)

	const cols = setMerges(columns, maxLevel, multiHeader, merges)
	// console.log('multiHeader', JSON.stringify(multiHeader, null, 4))
	// console.log('setMerges', merges)
	header.push(...multiHeader[maxLevel])
	if (maxLevel > 0) {
		multiHeader.splice(maxLevel, 1)
	} else {
		multiHeader = []
	}
	// 行转列
	// const filterVal = []
	// columns.forEach(row => {
	//   filterVal.push(row.dataIndex)
	// })
	const filterVal = getFields(columns, maxLevel)
	const data = formatJson(filterVal, tableData)
	jsonToExcel({
		cellCodeList: columns,
		multiHeader,
		header,
		merges,
		data,
		maxLevel,
		filename: option.filename,
		autoWidth: option.width.length == 0,
		wch: option.width,
		hpx: option.height,
		bookType: option.bookType
	})
}
