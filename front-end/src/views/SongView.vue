<template>
    <div class="song-view">
        <div class="image-container">
            <img :src="song.image"/>
        </div>
        <div class="info-container">
            <h1>{{song.title}}</h1>
            <h4 class="text-secondary">{{song.album}}</h4>
            <p>{{song.description}}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
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
.song-view {
    display: flex;
    flex-direction: column;
}

.image-container {
    padding: 0 60px;
}

.info-container {
    display: flex;
    flex-direction: column;
}

.info-container p {
    padding-top: 1rem;
    text-align: left;
}

img {
    width: 100%;
}

@media only screen and (min-width: 960px) {
    .song-view {
        flex-direction: row;
        padding: 20px 40px;
    }

        .song-view div {
        width: 50%;
    }

}
</style>