<template>
  <div class="top-con">
    <span class="font">关键点标注工具</span>
    <a class="setting" @click="goCategory">类别管理</a>
    <a class="setting" @click="goBatches">批次管理</a>
    <a class="setting" @click="goLogout">退出登录</a>
  </div>
</template>

<script>
  import {logout, removeToken} from "../../Utils/auth";

  export default {
    name: 'TopBar',
    data () {
      return {

      }
    },
    methods:{
      goCategory(){
        this.$router.push({
          path: '/category'
        })
      },
      goBatches(){
        this.$router.push({
          path: '/batches'
        })
      },
      goLogout(){
        logout().then(res => {

        });
        removeToken();
      }
    }
  }
</script>

<style scoped lang="less">
  .top-con{
    width: 100%;
    padding: 20px;
    background-color: #2d3a4b;
    .font{
      color: #ffffff;
      margin-right: 100px;
    }
    .setting{
      cursor: pointer;
    }
  }
</style>
