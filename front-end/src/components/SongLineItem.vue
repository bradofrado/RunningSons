<template>
    <router-link class="song-container transition-background" :to="`/music/${song.album}/${song.title}`">
        <!-- <div class="number-container">
            <div>{{index + 1}}</div>
        </div> -->
        <button class="number-container button-none" @click="onPlay">
            <icon icon="play"/>
        </button>
        <div class="image-container">
            <img :src="song.albumCover"/>
        </div>
        <div class="info-container">
            <h4>{{song.title}}</h4>
            <p class="text-secondary text-band">{{song.band}}</p>
        </div>
    </router-link>
</template>

<script>
import Icon from '../../../global/components/Icon.vue'
export default {
  components: { Icon },
    name: "SongLineItem",
    props: {
        song: Object,
        index: Number
    },
    methods: {
        onPlay() {
            this.$refs.audio.play();
        }
    }
    
}
</script>

<style scoped lang="scss">
.song-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    color: $white;
    text-decoration: none;
    border-radius: 10px;
    padding: 10px 0;
}

.song-container:hover {
    background-color: $background-hover;
    color: $white;
}

.number-container {
    padding: 20px;
    font-size: 1.25rem;
}

.number-container div {
    width: 16px;
}

.image-container {
    width: 100px;
    padding-right: 20px;
}

.image-container img {
    width: 100%;
}

.info-container {

}

.text-band {
    text-align: left;
}
</style>