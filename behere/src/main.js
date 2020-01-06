import Vue from 'vue'
import App from './App.vue'

// import {Row,Col,Button,Form,Input,Divider,Modal} from 'ant-design-vue'
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css'

import vueaxios from 'vue-axios'
import axios from 'axios'
Vue.use(vueaxios,axios);

import router from './router'
import store from './store/store'

import VueAwesomeSwiper  from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper);

import AudioVisual  from 'vue-audio-visual'//声波图
Vue.use(AudioVisual);


Vue.config.productionTip = false

import 'animate.css'
import './util/string'
import './util/date'
import './directive'

export default new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
