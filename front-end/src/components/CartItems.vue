<template>
<div>
    <table class="items-container">
        <tr class="header-container">
            <th class='float-left'>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Size</th>
            <th>Total</th>
        </tr>
        <cart-item v-for="item in items" :key="item._id" :item="item" @remove="$emit('remove')"/>
    </table>
    <div class="cart-items-container">
        <cart-item v-for="item in items" :key="item._id" :item="item" @remove="$emit('remove')" mobile/>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import NumberPicker from '@/components/NumberPicker.vue'
import CartItem from './CartItem.vue';

const CartItems = {
    name: "CartItems",
    components: {
        NumberPicker,
        CartItem
    },
    props: {
        items: Array
    },
    methods: {
        edit(item) {
            window.location = '/merchandise/' + item.name + '/' + item._id;
        },
        async remove(item) {
            try {
                await axios.delete('/api/cart/' + item._id);
                
                this.$emit('remove', item);
            } catch {
                //
            }
        },
    }
}
export default CartItems;
</script>

<style scoped>

.cart-items-container {
    display: grid;
    grid-template-columns: auto;
}

.items-container {
    width: 100%;
    display: none;
}

.header-container {
    border-bottom: 1px solid;
}


@media only screen and (min-width: 600px) {
    .cart-items-container {
        display: none;
    }

    .items-container {
        display: table;
    }
}
</style>