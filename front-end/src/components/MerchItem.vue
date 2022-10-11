<template>
    <div class="merch-container">
        <div class="image-container">
            <img :src="theItem.image"/>
        </div>
        <div class="info-container">
            <h1>{{theItem.name}}</h1>
            <span>${{theItem.price.toFixed(2)}}</span>
            <slot>
                <p>{{theItem.description}}</p>
            </slot>
            <div>
                <span>Quantity:</span>
                <number-picker v-model="numItems" class="date-picker" :max="max"/>
            </div>
            <div v-if="hasSize">
                <span>Sizes:</span>
                <select-size :sizes="theItem.sizes" v-model="theItem.size"/>
            </div>
            <slot name="venmo">
            </slot>
            <p v-if="error" class="danger">{{error}}</p>
            <div class="buttons-container">
                <button class="button button-primary" @click="addToCart" :disabled="loading" v-spinner="loading">
                    {{addToCartText}}
                </button>
                <venmo-button v-if="venmo" :amount="theItem.price" :note="theItem.name"/>
            </div>
        </div>
    </div>
</template>

<script>
import NumberPicker from '../components/NumberPicker.vue';
import axios from 'axios';
import SelectSize from './SelectSize.vue';
import VenmoButton from './VenmoButton.vue';

export default {
    name: "MerchItem",
    components: {
        NumberPicker,
        SelectSize,
        VenmoButton,
    },
    props: {
        item: Object,
        edit: Boolean,
        type: String,
        venmo: {
            default: true,
            type: Boolean
        }
    },
    data() {
        return {
            added: false,
            numItems: 1,
            isEdit: false,
            theItem: null,
            loading: false,
            error: null
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
        },
        max() {
            return this.theItem.size ? this.theItem.sizes[this.theItem.size] : null;
        },
        hasSize() {
            return this.item.sizes != null && this.item.sizes != undefined;
        }
    },
    watch: {
        numItems() {
            this.added = false;
        }
    },
    methods: {
        async addToCart() {
            if (this.hasSize && (!this.theItem.size || this.theItem.sizes[this.theItem.size] <= 0)) {
                this.error = 'Please select a size';
                return;
            }

            try {
                this.loading = true;
                //If we are editing this item, then put it
                if (this.isEdit) {
                    let url = '/api/cart/' + this.theItem._id;
                    if (this.type) {
                        url += '?type=' + this.type;
                    }

                    await axios.put(url, {
                        quantity: this.numItems,
                        size: this.theItem.size
                    });
                //Otherwise make a new one
                } else {
                    let url = '/api/cart';
                    if (this.type) {
                        url += '?type=' + this.type;
                    }

                    await axios.post(url, {
                        item: this.theItem,
                        quantity: this.numItems,
                        size: this.theItem.size
                    });

                    //Get the number of cart items
                    const response = await axios.get('/api/cart');
                    this.$root.$data.numCartItems = response.data.length;

                    //this.theItem = response.data;
                }
                this.error = '';
                this.added = true;
                this.loading = false;
            } catch(error) {
                this.error = 'There was an error in saving your item';
                this.loading = false;
            }
            
        }
    }
}
</script>

<style scoped>
p {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

.merch-container {
    display: flex;
    flex-direction: column;
}

.image-container {

}
.info-container {
    text-align: center;
    padding: 0 10%;
}

.info-container > *:not(.close) {
    padding: 20px 0;
}

.info-container > *:first-child {
    padding-top: 0;
}

h1 {
    margin: 0;
    padding: 0;
}

.date-picker {
    margin: auto;
}
img {
    width: 100%;
}

.buttons-container {
    padding: 0;
    display: flex;
}

.buttons-container > :first-child {
    margin-right: 10px;
}

.buttons-container > .button {
    flex: 1;
}

p.danger {
    padding: 0;
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