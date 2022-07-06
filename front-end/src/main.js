import Vue from 'vue'
import App from './App.vue'
import router from './router'
import components from '../../global'
import { BootstrapVue } from 'bootstrap-vue'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);

components.forEach(component => {
    Vue.component(component.name, component);
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
