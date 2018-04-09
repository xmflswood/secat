const fs = require('fs')
const superagent = require('superagent')
require('superagent-proxy')(superagent)
const cheerio = require('cheerio')
const axios = require('axios')
const config = require('./config')
const replace = require('./url-regx')
const log = require('./log')
// proxy 相关
let proxy = ''
let proxyList = []
let lastGetProxyTime = ''
let getProxyTime = 0
let errorTimes = 0
// 清空数据
function clear() {
  proxy = ''
  proxyList = []
  lastGetProxyTime = ''
  getProxyTime = 0
  errorTimes = 0
}
// 公用，换代理ip，控制8秒内只能执行一次
// 执行过程：
// 若代理列表内有剩余，则从列表内splice一个出来，若没剩余，则重新抓取一次ip列表（总计抓取次数限制由config控制）
function changeProxy() {
  let now = new Date()
  if (!lastGetProxyTime || ((now - lastGetProxyTime) > 8000)) {
    lastGetProxyTime = now
    // 节约代理，先尝试不使用代理
    if (proxy) {
      proxy = ''
      return new Promise((resolve, reject) => {
        resolve(true)
      }) 
    }
    if (proxyList && proxyList.length && proxyList.length > 0 && (typeof(proxyList) !== 'string')) {
      let i = proxyList.splice(0, 1)[0]
      proxy = `http://${i.ip}:${i.port}`
      log('从池中取了一次proxy ip')
      return new Promise((resolve, reject) => {
        resolve(true)
      })
    } else {
      if (getProxyTime >= config.getProxyLimit) {
        return false
      }
      getProxyTime++;
      return axios.get(config.proxyUri).then(
        (res) => {
          proxyList = res.data.msg
          if (proxyList && proxyList.length && proxyList.length > 0 && (typeof(proxyList) !== 'string')) {
            log('第' + getProxyTime + '次抓取了新的proxy ip,数量=' + proxyList.length)
            let i = proxyList.splice(0, 1)[0]
            proxy = `http://${i.ip}:${i.port}`
          } else {
            log('抓取proxy ip 失败,msg: ' + proxyList)
          }
        },
        (e) => {
          log('获取proxy ip 失败(接口访问失败)')
        }
      )
    }
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(false)
      }, 6000);
    })
  }
}
function freezeTime(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, delay)
  })
}
async function scrap(keyword, page) {
  keyword = encodeURI(keyword)
  let url = eval(this.url)
  const request = superagent.get(url)
  if (proxy) {
    request.proxy(proxy)
  }
  return request.set({
    "User-Agent": this.ua
  })
  .timeout(proxy ? 20000 : 5000)
  .then(
    async (res) => {
      let $ = cheerio.load(res.text)
      let shows = $(this.reg)
      if (!shows || shows.length === 0) {
        if (this.useProxy && res.text.indexOf(this.verifyText) !== -1) {
          await changeProxy()
        }
        return 'wrong'
      }
      let links = []
      for (let i = 0; i < shows.length; i ++) {
        if ($(shows[i]).text()) {
          links.push($(shows[i]).text())
        }
      }
      return links
    }
  ).catch(
    (err) => {
      errorTimes++;
      if (errorTimes > 3) {
        log('网络超时或者代理失效')
        proxy = ''
        errorTimes = 0
      }
      return 'wrong'
    }
  )
}
async function getRank(obj) {
  let rank = 100
  let sum = 0;
  for (let i = 0; i < 5; i++) {
    let links = await this.scrap(obj.keywordname, i)
    await freezeTime(this.delay)
    if (links === 'wrong') {
      return 'wrong'
    }
    if (links && links.length && links.length > 0) {
      for (let o = 0; o < links.length; o++) {
        if ((links[o].indexOf(replace(obj.websiteurl)) !== -1) && rank === 100) {
          rank = sum + o + 1;
          break
        }
      }
      if (rank !== 100) {
        break;
      }
      sum = sum + links.length;
    }
  }
  return rank
}

async function main(thread, data) {
  let info = data
  this.wrong = []
  for(let i = 0; i < data.length; i += thread) {
    let reqList = []
    for (let r = 0; r < thread; r++) {
      if (info[i+r]) {
        reqList.push(this.getRank(info[i+r]))
      }
    }
    let rList = await Promise.all(reqList)
    if (rList && rList.length > 0) {
      rList.forEach((r, index) => {
        if (info[i + index]) {
          console.log('完成: ' + (i + index) + 'rank=' + r)
          // if ((i + index) % 50 === 0 ) {
          //   console.log('完成: ' + (i + index))
          // }
          if (r === 'wrong') {
            console.log('index=' + (i + index) + ' is wrong!!!')
            info[i + index].rank = -1
            this.wrong.push(info[i + index])
            if (this.wrongTimes === 4) {
              this.result.push(info[i + index])
            }
           // this.result.push(
           //   info[i + index]
           // )
          } else {
            info[i + index].rank = r
            this.result.push(
              info[i + index]
            )
          }
        }
      })
    }
  }
}

async function go(thread, data) {
  await this.main(thread, data)
  // 错误重处理
  while (this.wrong.length > 0 && this.wrongTimes < 5) {
    // console.log('doing wrong list')
    await this.main(Math.ceil(thread/2), this.wrong);
    this.wrongTimes++;
  }
  log('爬取失败列表长度为：' + this.wrong.length)
  fs.writeFileSync(this.rfile, JSON.stringify(this.result, null, 2))
  fs.writeFileSync(this.wfile, JSON.stringify(this.wrong))
  this.result = []
  this.wrong = []
  this.wrongTimes = 0
}

exports.scrap = scrap
exports.getRank = getRank
exports.main = main
exports.go = go
exports.clear = clear
