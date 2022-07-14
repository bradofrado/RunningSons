<template>
    <div>
        <h1>Shopping Cart</h1>
        <p v-if="!items.length">No items</p>
        <div v-else class="cart-items-container">
            <cart-item v-for="item in items" :key="item._id" :item="item" class="cart-item" @remove="getItems"/>
        </div>
    </div>
</template>

<script>
import CartItem from '../components/CartItem.vue';
import axios from 'axios';

export default {
    name: "ShoppingCartView",
    components: {
        CartItem
    },
    data() {
        return {
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
            } catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped>
.cart-items-container {
    display: grid;
    grid-template-columns: auto;
}

.cart-item {
    margin: 10px 0;
}

@media only screen and (min-width: 960px) {
    .cart-items-container {
        grid-template-columns: auto auto;
    }
}
</style>