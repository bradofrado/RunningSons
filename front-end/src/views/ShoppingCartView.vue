<template>
    <div>
        <h1>Shopping Cart</h1>
        <p v-if="!items.length">No items</p>
        <div v-else class="shopping-container">
            <cart-items :items="items" @remove="getItems"/>
            <div class="sub-totals">
                <p>Subtotal: ${{subtotals.toFixed(2)}}</p>
                <p>Shipping: ${{shipping.toFixed(2)}}</p>
                <p v-for="code in codes" :key="code._id">{{code.code}}: -${{code.value}}</p>
                <hr>
                <input class="input input-code" v-model="code"/> 
                <button class="button button-primary" @click="applyCode" v-spinner="applyLoading">Apply</button>
                <span v-if="error" class="danger">{{error}}</span>
                <p><em>Total: ${{total.toFixed(2)}}</em></p>
                <button class="button button-primary checkout-button" @click="checkout">Checkout</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import CartItems from '../components/CartItems.vue';

export default {
    name: "ShoppingCartView",
    components: {
        CartItems
    },
    data() {
        return {
            items: [],
            loading: false,
            code: null,
            error: null,
            applyLoading: false,
            codes: []
        }
    },
    async created() {
        await this.getItems();
        await this.getCodes();
    },
    computed: {
        subtotals() {
            return this.items.reduce((prev, curr) => prev + CartItems.totals(curr), 0);
        },
        shipping() {
            return 5;
        },
        codeAmount() {
            return this.codes.reduce((prev, curr) => {
                prev += curr.value;

                return prev;
            }, 0)
        },
        total() {
            return this.subtotals + this.shipping - this.codeAmount;
        }
    },
    methods: {
        async getItems() {
            try {
                this.loading = true;
                const response = await axios.get('/api/cart');

                this.items = response.data;
                this.$root.$data.numCartItems = this.items.length;
            } catch {
                //
            }
        },
        async getCodes() {
            try {
                const response = await axios.get('/api/codes/applied');

                this.codes = response.data;
            } catch {
                //
            }
        },
        checkout() {
            window.location = '/checkout';
        },
        async applyCode() {
            if (!this.code) return;
            this.applyLoading = true;
            this.error = null;
            try { 
                await axios.post('/api/codes/apply', {
                    code: this.code
                });
            } catch(error) {
                this.error = "Cannot apply code";
            } finally {
                await this.getCodes();
                this.applyLoading = false;
            }
        }
        
    }
}
</script>

<style scoped>

.shopping-container {
    padding-top: 0.75rem;
}

.sub-totals {
    width: 200px;
    margin: auto;
    text-align: left;
}

.input-code {
    max-width: 100px;
    margin-right: 10px;
    height: inherit;
}

.checkout-button {
    display: block;
    margin: auto;
}

@media only screen and (min-width: 600px) {
    .sub-totals {
        float: right;
    }
}
</style>