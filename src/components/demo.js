let curMonth = new Date().getMonth() + 1
const curYear = new Date().getFullYear()
const getMonthHasDay = (year, month) => {
  return new Date(year, month, 0).getDate()
}
let Datearr = []
let curDay = new Date().getDate()
for (let i = 0; i < 7; i++) {
  if (curDay > 1) {
    curDay--
    Datearr.unshift(`${curYear}/${curMonth}/${curDay}`)
  } else {
    curDay = getMonthHasDay(curYear, curMonth - 1)
    curMonth--
    Datearr.unshift(`${curYear}/${curMonth}/${curDay}`)
  }
}
export default Datearr
