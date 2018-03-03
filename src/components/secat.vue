<template>
  <div class="hello">
    <div>
      <h1>Welcome to secat</h1>
      <el-button @click="showLogin = true">验证身份</el-button>
      <el-dialog
        title="身份验证"
        :visible.sync="showLogin">
        <p>请输入本站管理员英文名:</p>
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
