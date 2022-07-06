<template>
    <div class="merch-container">
        <div class="image-container">
            <img :src="item.image"/>
        </div>
        <div class="info-container">
            <h1>{{item.name}}</h1>
            <span>${{item.price}}</span>
            <p>{{item.description}}</p>
            <div>
                <span>Quantity:</span>
                <number-picker v-model="numItems" class="date-picker"/>
            </div>
            <button class="button button-primary" @click="addToCart">Add to Cart</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import NumberPicker from '../components/NumberPicker.vue';

export default {
    name: "MerchItemView",
    components: {
        NumberPicker
    },
    data() {
        return {
            numItems: 1,
            item: {
                name: "Cool Shirt",
                price: "40",
                description: "This here is a way sweet shirt",
                image: "https://cdn.shopify.com/s/files/1/0011/4651/9637/products/Taylors-version-Purple_01-1_1000x.png?v=1652317513"
            }
        }
    },
    methods: {
        async getItem() {
            try {
                const response = await axios.get('/api/merchandise/' + this.$route.params.id);

                this.item = response.data;
            } catch(error) {
                console.log(error);
            }
        },
        addToCart() {
            console.log(this.numItems);
        }
    }
}
</script>

<style scoped>
.merch-container {
    display: flex;
}

.merch-container > div {
    width: 50%;
}
.image-container {

}
.info-container {
    text-align: center;
}

.info-container > * {
    padding: 20px;
}

.info-container > *:first-child {
    padding-top: 0;
}

h1 {
    margin: 0;
}

.date-picker {
    margin: auto;
}
img {
    width: 100%;
}

button {
    width: 80%;
}
</style>