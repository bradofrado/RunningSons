<template>
<div>
    <h1 class="title">Running Sons</h1>
    <div class="banner-container">
        <img src="/images/banner.png"/>
    </div>
    <div class="image-buttons-container">
        <image-button class="imadge-item" to="/music" img="/images/MusicLogo.png"/>
        <image-button class="imadge-item" to="/merchandise" img="/images/MerchLogo.png"/>
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
