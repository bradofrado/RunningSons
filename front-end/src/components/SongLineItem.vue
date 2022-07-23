<template>
    <a class="song-container" :href="`/music/${song.album}/${song.title}`">
        <div class="number-container">
            <div>{{index + 1}}</div>
        </div>
        <div class="image-container">
            <img :src="song.albumCover"/>
        </div>
        <div class="info-container">
            <h4>{{song.title}}</h4>
            <p class="text-secondary text-band">{{song.band}}</p>
        </div>
    </a>
</template>

<script>
export default {
    name: "SongLineItem",
    props: {
        song: Object,
        index: Number
    },
    
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
    background-color: #505050;
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