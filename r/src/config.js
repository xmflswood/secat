// 爬虫配置
let ua = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36'
let mua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'

module.exports = {
  // 一整轮（7个搜索引擎共计的）获取代理ip的次数限制
  getProxyLimit: 20,
  // 代理池地址
  proxyUri: 'http://mvip.piping.mogumiao.com/proxy/api/get_ip_al?appKey=9228ced320f2443e9abc116496647c01&count=1&expiryDate=0&format=1',
  baidu: {
    url: '`https://www.baidu.com/s?wd=${keyword}&pn=${(page)*10}&rn=10`',
    reg: '#content_left .FGYCbQ, #content_left .c-showurl, .c-span18.c-span-last .g',
    ua: ua,
    useProxy: false
  },
  mbaidu: {
    url: '`https://m.baidu.com/s?pn=${(page)*10}&word=${keyword}`',
    reg: '#results span.c-showurl',
    ua: mua,
    useProxy: false
  },
  pc360: {
    url: '`https://www.so.com/s?q=${keyword}&pn=${page+1}`',
    reg: '#main cite',
    ua: ua + Math.random().toString().substring(2, 4),
    useProxy: false,
    verifyText: '验证码',
    delay: 2000
  },
  m360: {
    url: '`https://m.so.com/s?q=${keyword}&pn=${page+1}&pid=${Math.random().toString().substring(2, 4)}&psid=4a10s585db2dd9d8ef903de${Math.random().toString().substring(2, 4)}5edeccf&ajax=1&abv=110:smzdm_haojia=no_smzdm_haojia`',
    reg: '.res-site-url, .res-site-name',
    ua: mua + Math.random().toString().substring(2, 4),
    useProxy: true,
    verifyText: '验证码',
    delay: 2000
  },
  sougou: {
    url: '`https://www.sogou.com/web?page=${(page + 1)}&query=${keyword}`',
    reg: '#main cite',
    ua: ua + Math.random().toString().substring(2, 4),
    useProxy: true,
    // 验证页的关键词
    verifyText: 'verify_page',
    delay: 2000
  },
  msougou: {
    url: '`https://m.sogou.com/web/searchList.jsp?p=${(page + 1)}&keyword=${keyword}`',
    reg: '.results .citeurl',
    ua: mua + Math.random().toString().substring(2, 4),
    useProxy: true,
    // 验证页的关键词
    verifyText: '验证',
    delay: 2000
  },
  shenma: {
    url: '`https://yz.m.sm.cn/s?q=${keyword}&num=10&page=${page+1}`',
    reg: '.web-link, .host, .show-url, .c-e-source--v1_0_0.c-e-source',
    ua: mua + Math.random().toString().substring(2, 4),
    useProxy: false,
    // 验证页的关键词
    verifyText: 'verify_page',
    delay: 1000
  }
}
