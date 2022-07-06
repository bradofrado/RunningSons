<template>
    <h1 class="title-container">Falling Sand out soon...</h1>
</template>

<script>
import axios from 'axios'

export default {
    name: "MusicView",
    data() {
        return {
            music: []
        }
    },
    components: {

    },
    async created() {
        await this.getMusic();
    },
    methods: {
        async getMusic() {
            try {
                const response = await axios.get('/api/music');

                this.music = response.data; 
            } catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped lang="scss">
//@import '@/scss/custom.scss';

</style>