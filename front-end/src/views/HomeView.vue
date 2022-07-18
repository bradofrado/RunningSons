<template>
<div>
    <h1 class="title">Running Sons</h1>
    <div class="banner-container">
        <img src="/images/banner.png"/>
    </div>
    <div class="image-buttons-container">
        <image-button class="imadge-item" to="/music" name="Music" img="https://cdn.shopify.com/s/files/1/0011/4651/9637/products/ImagefromiOS_ac5f3ced-96a2-44fa-b404-7f045a649d44_600x.png?v=1656031036"/>
        <image-button class="imadge-item" to="/merchandise" name="Merchandise" img="https://cdn.shopify.com/s/files/1/0011/4651/9637/files/redrf2_1500x_8f95a411-4b69-4006-8e9b-387ba5cfa445_750x960_crop_center.png?v=1643835192"/>
    </div>
    <merch-collection :items="items" label="Featured Items"/>
</div>
</template>

<script>
import MerchCollection from '@/components/MerchCollection.vue';
import axios from 'axios';
import ImageButton from '../components/ImageButton.vue';
//import MerchItem from '../components/MerchItem.vue';

export default {
    name: 'HomeView',
    components: {
        MerchCollection,
        ImageButton,
        //MerchItem
    },
    data() {
        return {
            items: []
        }
    },
    async created() {
        await this.getMerchandise();
    },
    methods: {
        async getMerchandise() {
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

<style scoped>
.banner-container {
    position:absolute;
    left: 0;
}
.banner-container img {
    width: 100%;
}

.tidtle {
    padding-bottom: 150px;
}

.image-buttons-container {
    display: flex;
    justify-content:center;
    margin-bottom: 100px;
    padding-top: 35%;
}

.image-item {
    margin: auto;
}
</style>
