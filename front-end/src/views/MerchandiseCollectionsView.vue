<template>
    <merch-collection v-if="items && type" :items="items" :label="type.name"/>
    <p v-else-if="type">Sorry, there are currently no {{type.name}}</p>
</template>

<script>
import axios from 'axios';
import MerchCollection from '../components/MerchCollection.vue';

export default {
    name: "MerchandiseView",
    components: {
        MerchCollection
    },
    data() {
        return {
            items: null,
            type: null
        }
    },
    async created() {
        await this.getMerchandise();
        await this.getType();
    },
    methods: {
        async getMerchandise() {
            try {
                const response = await axios.get('/api/merchandise/type/'+this.$route.params.type);

                this.items = response.data;
            } catch {
                //
            }
        },
        async getType() {
            try {
                const response = await axios.get('/api/types/'+this.$route.params.type);

                this.type = response.data;
            } catch {
                //
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