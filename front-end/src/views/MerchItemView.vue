<template>
    <h1 v-if="!item">
        Loading...
    </h1>
    <merch-item v-else :item="item" :edit="edit">
        <template #venmo>
            <p>If using venmo, pay ${{item.price.toFixed(2)}} with your name and address 
                and we will ship this item to you!
            </p>
        </template>
    </merch-item>
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
            item: null,
            edit: false
        }
    },
    async created() {
        await this.getItem();
    },
    computed: {
        name() {
            return this.$route.params.name; 
        },
        id() {
            return this.$route.params.id;
        }
    },
    methods: {
        async getItem() {
            try {
                let response;
                if (this.id) {
                    this.edit = true;
                    response = await axios.get(`/api/cart/${this.id}`);
                } else {
                    response = await axios.get(`/api/merchandise/${this.name}`);
                }

                this.item = response.data;
            } catch {
                //
            }
        },
    }
}
</script>