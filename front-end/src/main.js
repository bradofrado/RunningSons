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

Vue.directive('spinner', function(el, binding) {
    if (binding.value) {
        el.style.width = `${el.clientWidth}px`;
        el.style.height = `${el.clientHeight}px`;

        //Create the spinner element
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.classList.add(binding.arg === 'dark' ? 'spinner-dark' : 'spinner-light');
        spinner.setAttribute('name', 'spinner');

        //Put all of the children in a temp div with no display
        const children = document.createElement('div');
        children.replaceChildren(...el.childNodes);
        children.style.visibility = 'hidden';
        children.setAttribute('name', 'children');

        el.appendChild(children);
        el.appendChild(spinner);
    } else {
        const children = el.querySelector('[name="children"]');
        children && el.replaceChildren(...children.childNodes);

        el.style.width = '';
        el.style.height = '';
    }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
