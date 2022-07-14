<template>
    <div class="cart-item-container">
        <div class="image-container">
            <img :src="item.image"/>
        </div>
        <div class="data-container">
            <p>{{item.name}}</p>
            <p>{{item.price}}</p>
            <number-picker v-model="numItems" class="date-picker"/>
            <div class="button-container">
                <button class='button button-secondary mr-1' @click='edit'>Edit</button>
                <button class='button button-secondary' @click='remove'>Remove</button>
            </div>
        </div>
    </div>
</template>

<script>
import NumberPicker from './NumberPicker.vue'
import axios from 'axios';

export default {
    name: "CartItem",
    props: {
        item: Object
    },
    components: {
        NumberPicker
    },
    data() {
        return {
            numItems: 0
        }
    },
    created() {
        this.numItems = this.item.quantity;
    },
    watch: {
        numItems(item, oldItem) {
            var self = this;
            if (oldItem > 0) {
                setTimeout(async function() {
                    await axios.put('/api/cart/' + self.item._id, {
                        quantity: item
                    });
                }, 100)
            }
        }
    },
    methods: {
        edit() {
            window.location = '/merchandise/' + this.item.name + '/' + this.item._id;
        },
        async remove() {
            try {
                await axios.delete('/api/cart/' + this.item._id);
                this.$emit('remove', this.item._id);
            } catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped>
.cart-item-container {
    display: flex;
    max-width: 600px;
}

/* .cart-item-container div {
    width: 50%;
} */

.image-container {
    width: 50%;
}

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