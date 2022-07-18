<template>
    <div class="merch-container">
        <div class="image-container">
            <img :src="theItem.image"/>
        </div>
        <div class="info-container">
            <h1>{{theItem.name}}</h1>
            <span>${{theItem.price}}</span>
            <p>{{theItem.description}}</p>
            <div>
                <span>Quantity:</span>
                <number-picker v-model="numItems" class="date-picker"/>
            </div>
            <button class="button button-primary" @click="addToCart" :disabled="loading" v-spinner="loading">
                {{addToCartText}}
            </button>
        </div>
    </div>
</template>

<script>
import NumberPicker from '../components/NumberPicker.vue';
import axios from 'axios';

export default {
    name: "MerchItem",
    components: {
        NumberPicker,
    },
    props: {
        item: Object,
        edit: Boolean,
    },
    data() {
        return {
            added: false,
            numItems: 1,
            isEdit: false,
            theItem: null,
            loading: false
        }
    },
    created() {
        this.numItems = this.edit ? this.item.quantity : 1;
        this.isEdit = this.edit;
        this.theItem = this.item;
    },
    computed: {
        addToCartText() {
            if (this.isEdit) {
                return this.added ? 'Edit' : 'Edit';
            }
            return this.added ? 'Add to Cart' : 'Add to Cart';
        }
    },
    watch: {
        numItems() {
            // if (this.added) {
            //     this.isEdit = true;
            // }

            this.added = false;
        }
    },
    methods: {
        async addToCart() {
            try {
                this.loading = true;
                //If we are editing this item, then put it
                if (this.isEdit) {
                    await axios.put('/api/cart/' + this.theItem._id, {
                        quantity: this.numItems
                    });
                //Otherwise make a new one
                } else {
                    await axios.post('/api/cart', {
                        item: this.theItem,
                        quantity: this.numItems
                    });

                    //this.theItem = response.data;
                }
                this.added = true;
                this.loading = false;
            } catch(error) {
                console.log(error);
                this.loading = false;
            }
            
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