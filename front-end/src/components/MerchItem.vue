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
            <button class="button button-primary" @click="addToCart" :disabled="added">{{addToCartText}}</button>
        </div>
    </div>
</template>

<script>
import NumberPicker from '../components/NumberPicker.vue';

export default {
    name: "MerchItem",
    components: {
        NumberPicker
    },
    props: {
        item: Object
    },
    data() {
        return {
            added: false,
            numItems: 1
        }
    },
    computed: {
        addToCartText() {
            return this.added ? 'Added' : 'Add to Cart';
        }
    },
    methods: {
        addToCart() {
            console.log(this.numItems);
            this.added = true;
        }
    }
}
</script>

<style scoped>
.merch-container {
    display: flex;
    flex-direction: column;
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
@media only screen and (min-width: 960px) {
    .merch-container {
        flex-direction: row;
    }

    .merch-container > div {
        width: 50%;
    }
}
</style>