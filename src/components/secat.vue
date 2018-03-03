<template>
  <div class="hello">
    <div>
      <h1>Welcome to secat</h1>
      <el-button @click="showLogin = true">验证身份</el-button>
      <el-dialog
        title="身份验证"
        :visible.sync="showLogin">
        <p style="color: red;">周末开放公测（届时输入管理员英文名即可进入）</p>
        <p style="color: red;">非周末时间请联系管理员获取验证码</p>
        <el-input v-model="user"></el-input>
        <span slot="footer">
          <el-button @click="showLogin = false">取消</el-button>
          <el-button @click="verify" :disabled="disabled">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showLogin: false,
      user: '',
      disabled: false
    }
  },
  created () {
    if (window.localStorage.getItem('token')) {
      this.$router.push('/preview')
    }
  },
  methods: {
    verify () {
      this.disabled = true
      let query = {
        user: this.user
      }
      this.$http.get('/api/login', {params: query}).then(
        (res) => {
          this.disabled = false
          if (res.data.status === 1) {
            window.localStorage.setItem('token', res.data.token)
            this.$router.push('/preview')
          }
        }
      )
    }
  }
}
</script>

<style scoped>
</style>
