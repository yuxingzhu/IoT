import { saveAs } from 'file-saver'
// import XLSX from 'xlsx-style'
const XLSX = window.XLSX
// 设置表格中cell默认的字体，居中，颜色等
const defaultCellStyle = {
	font: {
		name: 'Arial Unicode MS',
		sz: 10,
		color: { rgb: '000000' }
	},
	border: {
		color: { rgb: '000000' },
		top: { style: 'thin' },
		bottom: { style: 'thin' },
		left: { style: 'thin' },
		right: { style: 'thin' }
	},
	alignment: {
		/// 自动换行
		wrapText: 1,
		// 居中
		horizontal: 'center',
		vertical: 'center',
		indent: 0
	}
}
const headerStyle = {
	font: {
		name: 'Arial Unicode MS',
		sz: 12,
		// bold: true,
		color: { rgb: '000000' }
	},
	border: {
		color: { rgb: '000000' },
		top: { style: 'thin' },
		bottom: { style: 'thin' },
		left: { style: 'thin' },
		right: { style: 'thin' }
	},
	alignment: {
		horizontal: 'center',
		vertical: 'center',
		wrapText: true
	}
	// fill: { bgColor: { indexed: 64 }, fgColor: { rgb: '000000' } }
}

function generateArray(table) {
	var out = []
	var rows = table.querySelectorAll('tr')
	var ranges = []
	for (var R = 0; R < rows.length; ++R) {
		var outRow = []
		var row = rows[R]
		var columns = row.querySelectorAll('td')
		for (var C = 0; C < columns.length; ++C) {
			var cell = columns[C]
			var colspan = cell.getAttribute('colspan')
			var rowspan = cell.getAttribute('rowspan')
			var cellValue = cell.innerText
			if (cellValue !== '' && cellValue == +cellValue)
				cellValue = +cellValue

			// Skip ranges
			ranges.forEach(function (range) {
				if (
					R >= range.s.r &&
					R <= range.e.r &&
					outRow.length >= range.s.c &&
					outRow.length <= range.e.c
				) {
					for (var i = 0; i <= range.e.c - range.s.c; ++i)
						outRow.push(null)
				}
			})

			// Handle Row Span
			if (rowspan || colspan) {
				rowspan = rowspan || 1
				colspan = colspan || 1
				ranges.push({
					s: {
						r: R,
						c: outRow.length
					},
					e: {
						r: R + rowspan - 1,
						c: outRow.length + colspan - 1
					}
				})
			}
			outRow.push(cellValue !== '' ? cellValue : null)
			if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null)
		}
		out.push(outRow)
	}
	return [out, ranges]
}

function datenum(v, date1904) {
	if (date1904) v += 1462
	var epoch = Date.parse(v)
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function sheetFromArrayOfArrays(data, opts) {
	var ws = {}
	var range = {
		s: {
			c: 10000000,
			r: 10000000
		},
		e: {
			c: 0,
			r: 0
		}
	}
	for (var R = 0; R != data.length; ++R) {
		for (var C = 0; C != data[R].length; ++C) {
			if (range.s.r > R) range.s.r = R
			if (range.s.c > C) range.s.c = C
			if (range.e.r < R) range.e.r = R
			if (range.e.c < C) range.e.c = C
			const cell = {
				v: data[R][C],
				s: defaultCellStyle
			}
			// if (cell.v == null) continue
			const cellRef = XLSX.utils.encode_cell({
				c: C,
				r: R
			})

			if (typeof cell.v === 'number') {
				cell.t = 'n'
			} else if (typeof cell.v === 'boolean') {
				cell.t = 'b'
			} else if (cell.v instanceof Date) {
				cell.t = 'n'
				cell.z = XLSX.SSF._table[14]
				cell.v = datenum(cell.v)
			} else if (
				Object.prototype.toString.call(cell.v) == '[object Null]' ||
				typeof cell.v === 'undefined'
			) {
				cell.t = 's'
				cell.v = ''
			} else {
				cell.t = 's'
			}

			ws[cellRef] = cell
		}
	}
	if (range.s.c < 10000000) {
		ws['!ref'] = XLSX.utils.encode_range(range)
	}
	return ws
}

function Workbook() {
	if (!(this instanceof Workbook)) return new Workbook()
	this.SheetNames = []
	this.Sheets = {}
}

function s2ab(s) {
	var buf = new ArrayBuffer(s.length)
	var view = new Uint8Array(buf)
	for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
	return buf
}

export function tableToExcel(id) {
	var theTable = document.getElementById(id)
	var oo = generateArray(theTable)
	var ranges = oo[1]

	/* original data */
	var data = oo[0]
	var wsName = 'SheetJS'

	var wb = new Workbook()
	var ws = sheetFromArrayOfArrays(data)

	/* add ranges to worksheet */
	// ws['!cols'] = ['apple', 'banan'];
	ws['!merges'] = ranges

	/* add worksheet to workbook */
	wb.SheetNames.push(wsName)
	wb.Sheets[wsName] = ws

	var wbout = XLSX.write(wb, {
		bookType: 'xlsx',
		bookSST: false,
		type: 'binary',
		cellStyles: true
	})

	saveAs(
		new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
		'test.xlsx'
	)
}

export function jsonToExcel({
	cellCodeList = [],
	multiHeader = [],
	header,
	data,
	maxLevel,
	filename,
	merges = [],
	autoWidth = true,
	wch = [],
	hpx = [],
	bookType = 'xlsx'
} = {}) {
	filename = filename || 'excel-list'
	data = [...data]
	data.unshift(header)
	for (let i = multiHeader.length - 1; i > -1; i--) {
		data.unshift(multiHeader[i])
	}

	const sheetName = 'sheet1'
	const workbook = new Workbook()
	const ws = sheetFromArrayOfArrays(data)
	if (merges.length > 0) {
		if (!ws['!merges']) {
			ws['!merges'] = []
		}
		merges.forEach(item => {
			ws['!merges'].push(XLSX.utils.decode_range(item))
		})
	}

	if (autoWidth) {
		/* 设置worksheet每列的最大宽度 */
		const colWidth = data.map(row => {
			return row.map(val => {
				/* 先判断是否为null/undefined */
				if (val == null) {
					return {
						wch: 10
					}
				} else if (val.toString().charCodeAt(0) > 255) {
					/* 再判断是否为中文 */
					return {
						wch: val.toString().length
					}
				} else {
					return {
						wch: val.toString().length + 6
					}
				}
			})
		})
		/* 以第一行为初始值 */
		const result = colWidth[0]
		for (let i = 1; i < colWidth.length; i++) {
			for (let j = 0; j < colWidth[i].length; j++) {
				if (result[j].wch < colWidth[i][j].wch) {
					result[j].wch = colWidth[i][j].wch
				}
			}
		}
		ws['!cols'] = result
	} else {
		ws['!cols'] = wch
	}
	// debugger
	/* 设置worksheet每列的最大宽度 */
	const allRows = data.length + maxLevel + 1
	const colHeight = []
	for (let i = 0; i < allRows; i++) {
		if (hpx[i]) {
			colHeight.push(hpx[i])
		} else {
			colHeight.push({
				hch: 25
			})
		}
	}
	ws['!rows'] = colHeight
	workbook.SheetNames.push(sheetName)
	workbook.Sheets[sheetName] = ws

	const setHeaderStyle = cols => {
		//
		cols.forEach(col => {
			if (col.style) {
				workbook.Sheets[sheetName][
					`${col.CellCode.toUpperCase()}${col.level + 1}`
				].s = col.style
			} else {
				workbook.Sheets[sheetName][
					`${col.CellCode.toUpperCase()}${col.level + 1}`
				].s = headerStyle
			}
			if (col.children && col.children.length > 0) {
				setHeaderStyle(col.children)
			}
		})
	}
	setHeaderStyle(cellCodeList)
	const wopts = {
		bookType: bookType,
		bookSST: false,
		type: 'binary',
		cellStyles: true
	}
	const wbout = XLSX.write(workbook, wopts, { defaultCellStyle })
	saveAs(
		new Blob([s2ab(wbout)], {
			type: 'application/octet-stream'
		}),
		`${filename}.${bookType}`
	)
}
