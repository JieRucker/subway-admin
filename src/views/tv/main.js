// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from '@/vuex/index';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import wyboot from '@/libs/wyboot';
import api from '@/api/server';
import JSEncrypt from 'jsencrypt'

Vue.use(VueI18n);
Vue.use(iView);

// 将axios挂载到prototype上
Vue.prototype.$api = api;
Vue.prototype.$Global = wyboot;
Vue.prototype.$JSEncrypt = JSEncrypt;

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
});
