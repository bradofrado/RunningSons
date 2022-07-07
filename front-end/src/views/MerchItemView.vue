<template>
    <h1 v-if="!item">
        Loading...
    </h1>
    <merch-item v-else :item="item"/>
</template>

<script>
import axios from 'axios';
import MerchItem from '../components/MerchItem.vue';

export default {
    name: "MerchItemView",
    components: {
         MerchItem
    },
    data() {
        return {
            item: null
        }
    },
    async created() {
        await this.getItem();
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
    }
}
</script>