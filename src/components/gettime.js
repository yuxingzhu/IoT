let currentDate = new Date();
let oneHourLater = new Date(currentDate.getTime() - 60 * 60 * 1000);
let year = oneHourLater.getFullYear();
let month = ("0" + (oneHourLater.getMonth() + 1)).slice(-2);
let day = ("0" + oneHourLater.getDate()).slice(-2);
let hours = ("0" + oneHourLater.getHours()).slice(-2);
let minutes = ("0" + oneHourLater.getMinutes()).slice(-2);
let seconds = ("0" + oneHourLater.getSeconds()).slice(-2);
let beginDate= year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
export default beginDate 
