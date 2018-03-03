<template>
  <div class="list">
    <div v-if="loading">
      <img src="../assets/logo.jpg">
      <h1 v-loading.fullscreen.lock="loading">身份验证成功，正在获取毛片!</h1>
    </div>
    <div v-else>
      <el-row>
        <el-col class="pointer" :span="8" v-for="(o, index) in showList" :key="index" :offset="2" style="margin-bottom: 20px;">
          <el-card :body-style="{ padding: '10px'}">
            <div @click="openPlayer(o.url)">
              <div style="width: 90%;">
                <img :src="o.img" style="width: 100%;" :onerror="logo">
              </div>
              <div style="padding: 14px;">
                <span class="mp-title">{{o.title}}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="10"
        :layout="paginationSetting"
        :total="list.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      loading: true,
      currentPage: 1,
      pageSizes: 10,
      paginationSetting: 'total, sizes, prev, pager, jumper',
      logo: 'this.src="' + require('../assets/logo.jpg') + '"'
    }
  },
  created () {
    this.loading = true
    if (window.$ua === 'mobile') {
      this.paginationSetting = 'prev, pager'
    }
    this.getData()
  },
  computed: {
    showList () {
      let start = (this.currentPage - 1) * this.pageSizes
      let end = start + this.pageSizes
      return this.list.slice(start, end)
    }
  },
  methods: {
    openPlayer (src) {
      if (!src) {
        this.$message.error('无法获取该视频链接，请观看其他视频')
        return
      }
      window.open(src)
    },
    handleSizeChange (val) {
      this.pageSizes = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    getData () {
      let token = window.localStorage.getItem('token')
      let query = {
        token: token
      }
      this.$http.get('/api/getMaoPian', {params: query}).then(
        (res) => {
          this.loading = false
          if (res.data.status) {
            this.list = res.data.list
          } else {
            this.$message('token失效，回到登录页')
            this.$router.push('/')
            window.localStorage.clear()
          }
        }
      )
    }
  }
}
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
  .mp-title {
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 48px;
  }
</style>
