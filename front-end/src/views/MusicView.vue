<template>
<div>
    <h1>This is Running Sons...</h1>
    <div class="songs-container">
        <song-line-item class="song-item" v-for="song in songs" :key="song._id" :song="song"/>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import SongLineItem from '../components/SongLineItem.vue';

export default {
  components: { SongLineItem },
    name: "MusicView",
    data() {
        return {
            songs: []
        }
    },
    async created() {
        await this.getMusic();
    },
    methods: {
        async getMusic() {
            try {
                const response = await axios.get('/api/songs');

                this.songs = response.data; 
            } catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped lang="scss">
//@import '@/scss/custom.scss';
.song-item {
    margin-top: 20px;
}
</style>