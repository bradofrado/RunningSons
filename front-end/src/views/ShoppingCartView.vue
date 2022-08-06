<template>
    <div>
        <h1>Shopping Cart</h1>
        <p v-if="!items.length">No items</p>
        <div v-else class="shopping-container">
            <cart-items :items="items" @remove="getItems"/>
            <div class="sub-totals">
                <totals-field :items="items" subtotal/> 
                <button class="button button-primary checkout-button" @click="checkout">Checkout</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import CartItems from '../components/CartItems.vue';
import TotalsField from '../components/TotalsField.vue';

export default {
    name: "ShoppingCartView",
    components: {
        CartItems,
        TotalsField
    },
    data() {
        return {
            items: [],
            loading: false,
        }
    },
    async created() {
        await this.getItems();
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
                const response = await axios.get('/api/codes/apply');

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
    width: 300px;
    margin: auto;
    text-align: left;
}

.checkout-button {
    display: block;
    margin: 10px 0;
}

.total-lineitem {
    display: flex;
    margin: 5px 0;
}

.total-lineitem span {
    flex: 1
}

.total-lineitem span:first-child {
    text-align: left;
}

.total-lineitem span:last-child {
    text-align: right;
}

@media only screen and (min-width: 600px) {
    .sub-totals {
        float: right;
    }
}
</style>