<template>
<div class="dashboard-container">
  <img src="/static/img/logo.png" class="frontpic"/>
  <div style="font-size:32px;color:#130B52;text-align:center;margin-top:1%">欢迎使用MegEngine Web Profile工具</div> 
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'userName',
      'userId'
    ])
  },
  data(){
      return {
      }
  },
  created () {
  },
  methods: {
  },
  watch: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-container {
    margin: 30px;
  }
}
.frontpic{
  width:50%;
  margin-top:5%;
  margin-left:25%
}
</style>
