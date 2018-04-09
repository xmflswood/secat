const path = require('path')
const config = require('../config').baidu
const scrap = require('../common').scrap
const getRank = require('../common').getRank
const main = require('../common').main
const go = require('../common').go
let proxy = ''
module.exports = {
  rfile: path.join(__dirname, './result.json'),
  wfile: path.join(__dirname, './wrong.json'),
  wrong: [],
  result: [],
  wrongTimes: 0,
  url: config.url,
  reg: config.reg,
  ua: config.ua,
  useProxy: config.useProxy,
  verifyText: config.verifyText,
  delay: config.delay || 0,
  scrap,
  getRank,
  main,
  go
}
