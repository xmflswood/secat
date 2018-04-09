let reg = /^www\./
const urlParse = require('url').parse
function urlReplace(url) {
  url = urlParse(url).hostname || url
  if (!url) {
    return ''
  }
  return url.replace(reg, '')
}
module.exports = urlReplace
