import axios from 'axios'
if (process.env.NODE_ENV !== 'production') {
  axios.defaults.baseURL = 'http://localhost:3000'
} else {
  axios.defaults.baseURL = '/'
}

axios.interceptors.response.use(
  (res) => {
    if (!res.data.status || res.data.status !== 1) {
      window.$app.$message(res.data.errorMsg || '返回异常')
    }
    return res
  },
  error => {
    window.$app.$message.error('未知错误')
    return Promise.reject(error)
  }
)
export default axios
