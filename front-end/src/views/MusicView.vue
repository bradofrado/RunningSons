<template>
<div>
    <h1>This is Running Sons</h1>
    <div class="songs-container">
        <song-line-item class="song-item" v-for="(song, i) in songs" :key="song._id" :song="song" :index="i"/>
    </div>
    <image-list name="Albums" :items="albums" to="/music/" />
</div>
</template>

<script>
import axios from 'axios'
import SongLineItem from '../components/SongLineItem.vue';
import ImageList from '../components/ImageList.vue';

export default {
  components: { SongLineItem, ImageList },
    name: "MusicView",
    data() {
        return {
            songs: [],
            albums: []
        }
    },
    async created() {
        await this.getMusic();
        await this.getAlbums();
    },
    methods: {
        async getMusic() {
            try {
                const response = await axios.get('/api/songs');

                this.songs = response.data; 
            } catch {
                //
            }
        },
        async getAlbums() {
            try {
                const response = await axios.get('/api/albums');

                //The image list is expecting a name property
                this.albums = response.data.map(x => {
                    const name = x.title;
                    delete x.title;
                    return {...x, name: name};
                });
            } catch {
                //
            }
        },
    }
}
</script>

<style scoped lang="scss">
.songs-container {
    margin-bottom: 40px;
}
</style>