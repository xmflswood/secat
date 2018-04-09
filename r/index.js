const path = require('path')
const fs = require('fs')
const request = require('request')
const axios = require('axios')
const schedule = require('node-schedule')
const _ = require('lodash')

const log = require('./src/log')
const dataConfig = require('./data-config')
const clear = require('./src/common').clear
const baidu = require('./src/baidu/baidu')
const mbaidu = require('./src/mbaidu/mbaidu')
const sougou = require('./src/sougou/sougou')
const msougou = require('./src/msougou/msougou')
const s360 = require('./src/360/360')
const m360 = require('./src/m360/m360')
const sm = require('./src/sm/sm')
async function main() {
  log('开始爬取')
  await getAll()
  log('抓取数据成功')
  let baiduData = JSON.parse(fs.readFileSync(dataConfig[1].data)).info
  let data360 = JSON.parse(fs.readFileSync(dataConfig[2].data)).info
  let sougouData = JSON.parse(fs.readFileSync(dataConfig[3].data)).info
  let msougouData = JSON.parse(fs.readFileSync(dataConfig[4].data)).info
  let mbaiduData = JSON.parse(fs.readFileSync(dataConfig[5].data)).info
  let smData = JSON.parse(fs.readFileSync(dataConfig[6].data)).info
  let datam360 = JSON.parse(fs.readFileSync(dataConfig[7].data)).info
  await baidu.go(2, baiduData)
  log('已完成baidu')
  await mbaidu.go(2, mbaiduData)
  log('已完成mbaidu')
  await sougou.go(1, sougouData)
  log('已完成sougou')
  await msougou.go(1, msougouData)
  log('已完成msougou')
  await s360.go(1, data360)
  log('已完成360')
  await m360.go(1, datam360)
  log('已完成m360')
  await sm.go(1, smData)
  log('已完成shenma')
  log('完成爬取')
  postAll()
  log('发送数据成功，结束')
  clear()
}
// 定时任务
let rule = new schedule.RecurrenceRule()
rule.hour = 1
rule.minute = 0
rule.second = 0
schedule.scheduleJob(rule, () => {
  main()
  console.log('time' + new Date())
})

function getData(i) {
  let url = `https://www.qunzhikeji.com/keyword/keywordList.do?platformId=${i}`
  return axios.get(url).then(
    (res) => {
      log('platformId = ' + i +'列表长度为'+res.data.info.length)
      fs.writeFileSync(dataConfig[i].data, JSON.stringify(res.data))
    },
    (e) => {
      log('抓取原始数据失败,url:' + url)
    }
  )
}
async function getAll() {
  for (let i = 1; i <= 7; i++) {
    await getData(i)
  }
  return true
}

function postData(data) {
  var options = {
    method: 'POST',
    url: 'https://www.qunzhikeji.com/keyword/addCostDetail.do',
    headers: {
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: {
      cmd: JSON.stringify(data)
    }
  }
  return request(options, function (error, response, body) {
    if (error) throw new Error(error)
    log(JSON.stringify(body))
  });
}
async function postAll() {
  let result = []
  for (let i = 1; i <= 7; i++) {
    result = result.concat(JSON.parse(fs.readFileSync(dataConfig[i].result)))
  }
  log('result = ' + result.length)
  let push = _.chunk(result, 100)
  for (let i = 0; i < push.length; i++) {
    await postData(push[i])
  }
}
