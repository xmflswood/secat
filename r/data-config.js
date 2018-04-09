const path = require('path')
// 如果修改id 对应的搜索引擎，请按顺序放（或者外面做判断）
module.exports = [
  {
    // 此处故意留空占位置= =!
  },
  {
    latformId: 1,
    data: path.join(__dirname, './src/baidu/data.json'),
    result: path.join(__dirname, './src/baidu/result.json')
  },
  {
    platformId: 2,
    data: path.join(__dirname, './src/360/data.json'),
    result: path.join(__dirname, './src/360/result.json')
  },
  {
    platformId: 3,
    data: path.join(__dirname, './src/sougou/data.json'),
    result: path.join(__dirname, './src/sougou/result.json')
  },
  {
    platformId: 4,
    data: path.join(__dirname, './src/msougou/data.json'),
    result: path.join(__dirname, './src/msougou/result.json')
  },
  {
    platformId: 5,
    data: path.join(__dirname, './src/mbaidu/data.json'),
    result: path.join(__dirname, './src/mbaidu/result.json')
  },
  {
    platformId: 6,
    data: path.join(__dirname, './src/sm/data.json'),
    result: path.join(__dirname, './src/sm/result.json')
  },
  {
    platformId: 7,
    data: path.join(__dirname, './src/m360/data.json'),
    result: path.join(__dirname, './src/m360/result.json')
  }
]