<template>
    <div v-if="album && url">
        <iframe class="frame" :src="url" frameborder="0"></iframe>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "PreSave",
    data() {
        return {
            album: null
        }
    },
    async created() {
        await this.getAlbum();
    },
    computed: {
        url() {
            return this.album && this.album.presave;
        }
    },
    methods: {
        async getAlbum() {
            try {
                const response = await axios.get('/api/albums');
                this.album = response.data.length > 0 ? response.data[0] : null;
            } catch {
                //
            }
        }
    }
}
</script>

<style scoped>
.frame {
    width: 300px;
    height: 300px;
}

@media only screen and (min-width: 960px) {
    .frame {
        width: 500px;
        height: 500px;
    }
}
</style>