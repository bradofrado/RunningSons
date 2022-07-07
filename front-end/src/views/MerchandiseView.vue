<template>
    <h1 v-if="!items">Loading...</h1>
    <h1 v-else-if="!items.length" class="title-container">Merchandise coming soon...</h1>
    <div v-else class="items-container">
        <merch-item-button v-for="item in items" :key="item._id" :item="item"/>
    </div>
</template>

<script>
import MerchItemButton from '@/components/MerchItemButton.vue'
import axios from 'axios';

export default {
    name: "MerchandiseView",
    components: {
        MerchItemButton
    },
    data() {
        return {
            items: null
        }
    },
    async created() {
        await this.getMerchandiseItems();
    },
    methods: {
        async getMerchandiseItems() {
            try {
                const response = await axios.get('/api/merchandise');

                this.items = response.data;
            } catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped lang="scss">
.items-container {
    display: grid;
    grid-template-columns: auto;
}

@media only screen and (min-width: 960px) {
    .items-container {
        display: grid;
        grid-template-columns: auto auto auto;
    }
}

</style>