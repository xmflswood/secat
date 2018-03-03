<template>
  <div class="admin">
    <span>key:</span>
    <el-input v-model="verifyText" type="password"></el-input>
    <span>pages:</span>
    <el-input v-model="pages"></el-input>
    <el-button @click="spide">更新服务器新资源</el-button>
    <div>
      验证码:{{newCode}}
      有效期至:{{limitTime}}
    </div>
    <el-button @click="createVerifyText">设定新验证码</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      verifyText: '',
      pages: 1,
      newCode: 8888,
      limitTime: ''
    }
  },
  methods: {
    spide () {
      let body = {
        verifyText: this.verifyText,
        pages: this.pages
      }
      this.$http.post('/api/update', body).then(
        (res) => {
          if (res.data.status === 1) {
            this.$message.success('更新成功')
          }
        }
      )
    },
    createVerifyText () {
      let body = {
        verifyText: this.verifyText
      }
      this.$http.post('/api/createVerifyText', body).then(
        (res) => {
          if (res.data.status === 1) {
            this.newCode = res.data.code
            this.limitTime = (new Date(res.data.time)).toLocaleString()
          }
        }
      )
    }
  }
}
</script>

<style scoped>
</style>
