<template>
    <div v-if="mobile" class="cart-item-container mobile">
        <div class="image-container">
            <img :src="item.image"/>
        </div>
        <div class="data-container">
            <p>{{item.name}} - {{item.quantity}}</p>
            <p>${{item.total}}</p>
            <p>{{item.size}}</p>
            <div class="button-container">
                <button class='button button-secondary mr-1' @click='edit'>Edit</button>
                <button class='button button-secondary' @click='remove' v-spinner:dark="loading">Remove</button>
            </div>
        </div>
    </div>
    <tr v-else class="cart-item-container">
        <td class="item-product">
            <div class="image-container">
                <img :src="item.image"/>
            </div>
            <p>{{item.name}}</p>
        </td>
        <td>
            <p>${{item.price.toFixed(2)}}</p>
        </td>
        <td>
            <p><number-picker v-model="numItems" :max="max"/></p>
            <button class="button button-secondary mr-1" @click="edit(item)">Edit</button>
            <button class="button button-secondary" @click="remove(item)" v-spinner:dark="loading">Remove</button>
        </td>
        <td>
            <p>{{item.size}}</p>
        </td>
        <td><p v-spinner="loadingTotal" class="background-primary">${{item.total.toFixed(2)}}</p></td>
    </tr>
</template>

<script>
import NumberPicker from './NumberPicker.vue'
import axios from 'axios';

const CartItem = {
    name: "CartItem",
    props: {
        item: Object,
        mobile: Boolean
    },
    components: {
        NumberPicker
    },
    data() {
        return {
            numItems: 0,
            loading: false,
            loadingTotal: false
        }
    },
    async created() {
        //await this.getItem(this.id);
        this.numItems = this.item.quantity;
    },
    computed: {
        max() {
            return this.item.size ? this.item.sizes[this.item.size] : null;
        }
    },
    watch: {
        numItems(item, oldItem) {
            var self = this;
            if (oldItem > 0) {
                this.loadingTotal = true;
                setTimeout(async function() {
                    try {
                        const response = await axios.put('/api/cart/' + self.item._id, {
                            quantity: item,
                            size: this.item.size,
                        });
                        this.item.total = response.data.total;
                    } catch {
                        //
                    } finally {
                        this.loadingTotal = false;
                    }
                    
                }.bind(this), 100);
            }
        }
    },
    methods: {
        edit() {
            window.location = '/merchandise/' + this.item.name + '/' + this.item._id;
        },
        // async getItem(id) {
        //     try {
        //         const response = await axios.get('/api/cart/' + id);
        //         this.item = response.data;
        //     } catch {
        //         //
        //     }
        // },
        async remove() {
            try {
                this.loading = true;
                await axios.delete('/api/cart/' + this.item._id);
                await this.$emit('remove', this.item._id);
                this.loading = false;
            } catch {
                //
            }
        },
    }
}

export default CartItem;
</script>

<style scoped>
.item-product {
    display: flex;
    width: 100%;
}

.item-product > * {
    flex: 1;
}

.item-product > p {
    margin-left: 20px;
}

.image-container {
    max-width: 150px;
}

img {
    width: 100%;
}

td {
    vertical-align: top;
    width: 20%;
}

.float-left {
    float: left;
}

.cart-item-container {
    margin: 10px 0;
}

.cart-item-container.mobile {
    display: flex;
    max-width: 600px;
}

/* .cart-item-container div {
    width: 50%;
} */

/* .image-container {
    width: 50%;
} */

.data-container {
    width: 200px;
}

.data-container > div {
    margin-top: 20px;
}

img {
    width: 100%;
}

.date-picker {
    margin: auto;
}

.button-container {
    margin: auto;
}

/* .button-container button {
    width: 75
} */

.mr-1 {
    margin-right: 10px;
}
</style>