<template>
    <div v-if="album" class="album-container">
        <div class="image-container">
            <img :src="album.image"/>
        </div>
        <div v-if="songs.length" class="songs-container">
            <song-line-item v-for="(song, i) in songs" :key="song._id" :song="song" :index="i"/>
        </div>
        <div v-else>
            <p>There are currently no songs in this album</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import SongLineItem from '../components/SongLineItem.vue';

export default {
    name: "AlbumView",
    components: { 
        SongLineItem 
    },
    data() {
        return {
            album: null,
            songs: []
        }
    },
    async created() {
        await this.getAlbum();
    },
    methods: {
        async getAlbum() {
            try {
                const response = await axios.get('/api/albums?album='+this.$route.params.album);
                const response2 = await axios.get('/api/songs?album='+this.$route.params.album);

                this.album = response.data[0];
                this.songs = response2.data
            } catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped>
.image-container {
    width: 200px;
    margin: auto;
    margin-bottom: 10px;
}

img {
    width: 100%;
}

@media only screen and (min-width: 960px) {
    .image-container {
        width: 400px;
    }
}
</style>