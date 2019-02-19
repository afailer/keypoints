<template>
  <div class="login-con">
    <h1 class="title">关键点标注系统</h1>
    <el-form class="form-con">
      <div class="form-item">
        <i class="iconfont icon-user_name label-icon"></i>
        <el-input class="form-input" v-model="username"></el-input>
      </div>
      <div  class="form-item">
        <i class="iconfont icon-password label-icon"></i>
        <el-input class="form-input" v-model="password"></el-input>
      </div>

      <el-button class="login-btn" type="primary" @click="goLogin">立即登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/Utils/auth'
export default {
  name: 'login',
  mounted() {
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      username: '',
      password: ''
    };
  },
  methods: {
    goLogin() {
      login(this.username, this.password).then(res => {
        localStorage.setItem('token', res.data.token)
        this.$router.push({
          path: '/main'
        })
      }).catch(err => {
        if(err.code === 400){
          this.$message.error('账号或密码错误')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  @import "index.less";
</style>
