<template>
    <a class="song-container" :href="'/music/songs/' + song._id">
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
        song: Object
    },
    
}
</script>

<style scoped lang="scss">
.song-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    color: $white;
    text-decoration: none;
    border-radius: 10px;
}

.song-container:hover {
    background-color: #505050;
    color: $white;
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