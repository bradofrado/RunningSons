<template>
    <div class="image-button-container">        
        <router-link class="image-container image-button image-hover" :to="to">
            <div class="image">
                <img :src="item.image">
            </div>
            <div>{{item.name}}</div>
            <div v-if="item.price > 0">${{item.price}}</div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "MerchItemButton",
    props: {
        item: Object,
        type: {
            type: String,
            default: 'merchandise'
        }
    },
    computed: {
        hasClick() {
            return this.$listeners && this.$listeners.click;
        },
        to() {
            return '/' + this.type + '/' + this.endPoint;
        },
        endPoint() {
            return this.type === 'events' ? this.item._id : this.item.name;
        }
    },
    methods: {
        onClick() {
            this.$emit('click', this.id);
        }
    }
}
</script>

<style scoped lang="scss">

.image-container {
    height: 100%;
    border-radius: 8px;
    text-decoration: none;
    padding: 10px;
}

img {
    width: 100%;
    border-radius: 8px;
}

.image-button-container {
    max-width: 200px;
    margin: 20px auto;
}

.image-button {
    display: block;
    color: inherit;
    /* background-color: #999; */
    transition: background-color .3s ease-in-out;
    width: 100%;
    height: 100%;
    border-radius: 8px;
}

.image-hover:hover {
    background-color: $gray;
    color: inherit;
    cursor: pointer;
}

@media only screen and (min-width: 960px) {
    .image-button-container {
        max-width: 300px;
    }

    .image-button-container {
        margin: 10px;
    }
}
</style>