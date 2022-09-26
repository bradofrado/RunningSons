<template>
    <image-view :image="song.image">
        <h1>{{song.title}}</h1>
        <h4 class="text-secondary">{{song.album}}</h4>
        <p>{{song.description}}</p>
    </image-view>
</template>

<script>
import axios from 'axios';
import ImageView from '../components/ImageView.vue';

export default {
  components: { ImageView },
    name: "SongView",
    data() {
        return {
            song: {}
        }
    },
    async created() {
        await this.getSong();
    },
    methods: {
        async getSong() {
            try {
                const response = await axios.get('/api/songs?song=' + this.$route.params.title + '&album=' + this.$route.params.album);
                this.song = response.data[0];
            } catch {
                //
            }
        }
    }
}
</script>

<style scoped>
.a {
    
}
</style>