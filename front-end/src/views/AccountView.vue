<template>
<div v-if="user">
    <h1>Welcome, {{user.firstname}}</h1>
    <a href="" @click="logout" class="a">Logout</a>
    <div v-if="isAdmin" class="products-container">
        <admin-products class="item" name="Merchandise Types" :items="types" :inputs="inputs.types" url="/api/types" @upload="getMerchandiseTypes" @delete="getMerchandiseTypes"/>
        <admin-products class="item" name="Merchandise" :items="merchandise" :inputs="inputs.merchandise" url="/api/merchandise" @upload="getMerchandiseItems"  @delete="getMerchandiseItems"/>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import AdminProducts from '../components/AdminProducts.vue';

export default {
    name: "AccountView",
    data() {
        return {
            types: null,
            merchandise: null,
            inputs: {
                types: {
                    name: {
                        type: 'input',
                        title: 'Name',
                        required: true
                    },
                    type: {
                        type: 'input',
                        title: 'Type',
                        required: true
                    },
                    image: {
                        type: 'file',
                        title: 'Choose an Image',
                        required: true
                    },
                },
                merchandise: {
                    name: {
                        type: 'input',
                        title: 'Name',
                        required: true
                    },
                    price: {
                        type: 'input',
                        title: 'Price',
                        required: true
                    },
                    type: {
                        type: 'input',
                        title: 'Type',
                        required: true
                    },
                    description: {
                        type: 'textarea',
                        title: 'Description',
                        required: true,
                    },
                    image: {
                        type: 'file',
                        title: 'Choose an Image',
                        required: false
                    },
                }
            }
        }
    },
    components: {
        AdminProducts
    },
    async created() {
        try {
            let response = await axios.get('/api/users');
                
            this.$root.$data.user = response.data.user;

            await this.getMerchandiseTypes();
            await this.getMerchandiseItems();
            
        } catch(error) {
            this.$root.$data.user = null;

            window.location = '/account/login';
        }
    },
    computed: {
        isAdmin() {
            return this.user.roles.includes('admin');
        },
        user() {
            return this.$root.$data.user;
        }
    },
    methods: {
        async getMerchandiseTypes() {
            try {
                const response = await axios.get('/api/types');

                this.types = response.data;
            } catch(error) {
                console.log(error);
            }
        },
        async getMerchandiseItems() {
            try {
                const response = await axios.get('/api/merchandise');

                this.merchandise = response.data;
            } catch(error) {
                console.log(error);
            }
        },
        getInputs(type, item) {
            const input = this.inputs[type];
            for (let key in input) {
                input[key].value = item && item[key];
            }

            return input;
        },
        async upload(formData, id, url) {
            try {
                if (id) {
                    await axios.put(url + '/' + id, formData);
                } else {
                    await axios.post(url, formData);
                }

                location.reload();
            } catch(error) {
                if (error.response && error.response.data.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = "Internal service error."
                }
            }
        },
        async logout () {
            try {
                await axios.delete('/api/users');
                this.$root.$data.user = null;
            } catch(error) {
                console.log(error);
            }
        },
    }
}
</script>

<style scoped>
.item {
    margin-top: 30px;
}
</style>