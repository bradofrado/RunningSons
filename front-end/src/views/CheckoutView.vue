<template>
    <div class="bubble-container card-container">
        <form-section class="mb-5" name="Contact Information">
            <contact-field v-model="contact"/>
        </form-section>
        <form-section class="mb-5" name="Address Information">
            <address-field v-model="address"/>
        </form-section>
        <form-section class="mb-5" name="Card Information">
            <card-element ref="card" />
        </form-section>
        <form-section class="mb-5" name="Totals">
            <totals-field class="totals-field" :items="items" coupon/>
        </form-section>
        <p v-if="error" class="danger">{{error}}</p>
        <button class="button button-primary" @click="purchase" v-spinner="loading">Purchase</button>
    </div>
</template>

<script>
import CardElement from '../components/CardElement.vue'
import FormSection from '../components/FormSection.vue'
import ContactField from '../components/ContactField.vue'
import AddressField from '../components/AddressField.vue'
import TotalsField from '../components/TotalsField.vue'
import axios from 'axios';

export default {
    name: "CheckoutView",
    components: {
        CardElement,
        FormSection,
        ContactField,
        AddressField,
        TotalsField
    },
    data() {
        return {
            loading: false,
            error: null,
            address: {
                street: null,
                apartment: null,
                city: null,
                state: null,
                zipcode: null
            },
            contact: {
                email: null,
                firstname: null,
                lastname: null
            },
            items: []
        }
    },
    async created() {
        await this.getItems();
    },
    methods: {
        async getItems() {
            try {
                const response = await axios.get('/api/cart');

                this.items = response.data;
                this.$root.$data.numCartItems = this.items.length;
            } catch {
                //
            }
        },
        async purchase() {
            if (!this.validate(this.address, ['line2']) || !this.validate(this.contact)) {
                this.error = "Please fill out all fields";
                return;
            }
            this.loading = true;

            const error = await this.$refs.card.purchase(this.address, this.contact);
            if (error) {
                this.error = error;
            }

            this.loading = false;
        },
        validate(obj, notInclude) {
            if (!obj) return false;

            for (let name in obj) {
                if (!obj[name] && !notInclude.includes(name)) return false;
            }

            return true;
        }
    }
}
</script>

<style scoped>
.card-container {
   
}

.totals-field {
    width: 400px;
}

@media only screen and (min-width: 960px) {
    .card-container {
        margin: 0 100px;
    }
}
</style>