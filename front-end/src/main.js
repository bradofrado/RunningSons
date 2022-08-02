import Vue from 'vue'
import App from './App.vue'
import router from './router'
import components from '../../global'
import { BootstrapVue } from 'bootstrap-vue'
import axios from 'axios'

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
});

Vue.directive('invalid', function(el, binding) {
    const invalid = binding.value;

    if (invalid) {
        el.classList.add('invalid');
    } else {
        el.classList.remove('invalid');
    }
});

Vue.directive('active', function(el, binding) {
    if (binding.value) {
        el.classList.add('active');
    } else {
        el.classList.remove('active');
    }
});

Vue.directive('num-icon', function(el, binding) {
    const remove = () => {
        el.classList.remove('position-relative');
        const icon = el.querySelector('span.num-icon');
        icon && icon.remove();
    }

    const add = (num) => {
        el.classList.add('position-relative');
        const icon = document.createElement('span');
        icon.classList.add('num-icon');
        icon.innerHTML = num;
        el.appendChild(icon);
    }
    if (binding.value > 0) {
        if (el.querySelector('span.num-icon')) {
            remove();
        }

        add(binding.value);
    } else {
        remove();
    }
});

const data = {
    user: null,
    numCartItems: 0
}

new Vue({
    router,
    data,
    async created() {
        await this.getCartAmount();
    },
    render: h => h(App, {ref: 'app'}),
    methods: {
        async getCartAmount() {
            try {
                const response = await axios.get('/api/cart/amount');
                this.numCartItems = response.data.amount;
            } catch {
                this.numCartItems = 0;
            }
            
        }
    }
}).$mount('#app')
