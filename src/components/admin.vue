<template>
  <div class="admin">
    <span>key:</span>
    <el-input v-model="verifyText" type="password"></el-input>
    <span>pages:</span>
    <el-input v-model="pages"></el-input>
    <el-button @click="spide">更新服务器新资源</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      verifyText: '',
      pages: 1
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
          }
        }
      )
    }
  }
}
</script>

<style scoped>
</style>
