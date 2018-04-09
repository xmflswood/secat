// 日志记录模块
const fs = require('fs')
module.exports = function (msg) {
  let time = new Date()
  time = time.toLocaleString()
  msg = `${time}:${msg}\n`
  console.log(msg)
  fs.appendFileSync('./scrap.log', msg);
}