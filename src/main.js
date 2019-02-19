// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './assets/reset.css'
import './assets/iconfont.css'
import router from './router'
import ElementUI from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";
import store from './store'
import {getToken} from "./Utils/auth";

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: "medium"
});
const eventBus = {
  install(Vue, options) {
    Vue.prototype.$bus = new Vue();
  }
};

Vue.use(eventBus);
router.beforeEach((to, from, next) => {
  if(to.path === '/login'){
    if(getToken()){
      next('/main')
    }else{
      next()
    }
  }else{
    if(!getToken()){
      next('/main')
    }else{
      next()
    }
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
