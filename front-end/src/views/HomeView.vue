<template>
<div class="home-container">
    <h1 class="title">Running Sons</h1>
    <div class="banner-container">
        <img src="/images/banner.png"/>
    </div>
    <div class="image-buttons-container">
        <image-button class="imadge-item" to="/music" img="/images/MusicLogo.png"/>
        <image-button class="imadge-item" to="/merchandise" img="/images/MerchLogo.png"/>
    </div>
    <pre-save />
    <merch-collection class="m-t-1" :items="items" label="Featured Items"/>
    <merch-collection class="m-t-1" :items="events" label="Upcoming Events" type="events"/>
</div>
</template>

<script>
import MerchCollection from '@/components/MerchCollection.vue';
import axios from 'axios';
import ImageButton from '../components/ImageButton.vue';
import PreSave from '../components/PreSave.vue';

export default {
    name: 'HomeView',
    components: {
        MerchCollection,
        ImageButton,
        PreSave
    },
    data() {
        return {
            releases: [],
            items: [],
            events: []
        }
    },
    async created() {
        await this.getMerchandise();
        await this.getEvents();
    },
    methods: {
        async getMerchandise() {
            try {
                const response = await axios.get('/api/merchandise/featured');
                this.items = response.data;
            } catch {
                //
            }
        },
        async getEvents() {
            try {
                const response = await axios.get('/api/events/featured');
                this.events = response.data;
            } catch {
                //
            }
        }
    }
}
</script>

<style scoped>
.home-container {
    
}

.banner-container {
    position:absolute;
    left: 0;
}
.banner-container img {
    width: 100%;
}


.image-buttons-container {
    display: flex;
    justify-content:center;
    margin-bottom: 100px;
    padding-top: 35%;
    flex-direction: column;
}

.image-item {
    margin: auto;
}

.m-t-1 {
    margin-top: 100px;
}

@media only screen and (min-width: 960px) {
    .image-buttons-container {
        flex-direction: row;
    }
}
</style>
