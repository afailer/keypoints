<template>
  <div>
    <top-bar></top-bar>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import TopBar from './TopBar'
  export default {
    name: 'layout',
    components: {
      TopBar
    },
    data(){
      return{

      }
    }
  }
</script>
