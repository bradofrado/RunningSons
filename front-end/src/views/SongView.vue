<template>
    <image-view :image="song.image">
        <h1>{{song.title}}</h1>
        <h4 class="text-secondary">{{song.album}}</h4>
        <p>{{song.description}}</p>
        <button class="button-none" @click="onPlay">
            <icon :icon="playIcon"/>
        </button>
        <audio ref="audio" src="https://content.cdbaby.com/audio/samples/f1ff9773/hnalb02264125-01.mp3"/>
    </image-view>
</template>

<script>
import axios from 'axios';
import ImageView from '../components/ImageView.vue';
import Icon from '../../../global/components/Icon.vue';

export default {
  components: { ImageView, Icon },
    name: "SongView",
    data() {
        return {
            song: {},
            playIcon: 'play',
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
        },
        onPlay() {
            if (this.$refs.audio.paused) {
                this.$refs.audio.play();
                this.playIcon = 'pause';
            } else {
                this.$refs.audio.pause();
                this.playIcon = 'play';
            }
            
        }
    }
}
</script>

<style scoped>
.a {
    
}
</style>