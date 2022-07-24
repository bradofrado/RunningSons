<template>
<div v-if="user">
    <h1>Welcome, {{user.firstname}}</h1>
    <a href="" @click="logout" class="a">Logout</a>
    <div v-if="isAdmin" class="products-container">
        <admin-products class="item" name="Merchandise Types" :items="types" :inputs="inputs.types" url="/api/types" @upload="getMerchandiseTypes" @delete="getMerchandiseTypes"/>
        <admin-products class="item" name="Merchandise" :items="merchandise" :inputs="inputs.merchandise" url="/api/merchandise" @upload="getMerchandiseItems"  @delete="getMerchandiseItems"/>
        <admin-products class="item" name="Songs" :items="songs" :inputs="inputs.songs" url="/api/songs" @upload="getSongs"  @delete="getSongs"/>
        <admin-products class="item" name="Albums" :items="albums" :inputs="inputs.albums" url="/api/albums" @upload="getAlbums"  @delete="getAlbums"/>
        <admin-products class="item" name="Bands" :items="bands" :inputs="inputs.bands" url="/api/bands" @upload="getBands"  @delete="getBands"/>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import AdminProducts from '../components/AdminProducts.vue';

export default {
    name: "AccountView",
    data() {
        return {
            types: null,
            merchandise: null,
            songs: null,
            albums: null,
            bands: null,
            inputs: {
                types: {
                    name: {
                        type: 'input',
                        title: 'Name',
                        required: true
                    },
                    type: {
                        type: 'input',
                        title: 'Type',
                        required: true
                    },
                    image: {
                        type: 'file',
                        title: 'Choose an Image',
                        required: true
                    },
                },
                merchandise: {
                    name: {
                        type: 'input',
                        title: 'Name',
                        required: true
                    },
                    price: {
                        type: 'input',
                        title: 'Price',
                        required: true
                    },
                    type: {
                        type: 'input',
                        title: 'Type',
                        required: true
                    },
                    description: {
                        type: 'textarea',
                        title: 'Description',
                        required: true,
                    },
                    image: {
                        type: 'file',
                        title: 'Choose an Image',
                        required: false
                    },
                },
                songs: {
                    title: {
                        type: 'input',
                        title: 'Title',
                        require: true
                    },
                    album: {
                        type: 'input',
                        title: 'Album',
                        require: true
                    },
                    description: {
                        type: 'textarea',
                        title: 'Description',
                        required: true,
                    },
                    image: {
                        type: 'file',
                        title: 'Choose an Image',
                        required: false
                    },
                },
                albums: {
                    title: {
                        type: 'input',
                        title: 'Title',
                        require: true
                    },
                    band: {
                        type: 'input',
                        title: 'Band',
                        require: true
                    },
                    description: {
                        type: 'textarea',
                        title: 'Description',
                        required: true,
                    },
                    releaseDate: {
                        type: 'date',
                        title: 'Release Date',
                        required: true
                    },
                    image: {
                        type: 'file',
                        title: 'Choose an image',
                        required: false
                    }
                },
                bands: {
                    name: {
                        type: 'input',
                        title: 'Name',
                        required: true
                    },
                    description: {
                        type: 'textarea',
                        title: 'Description',
                        required: true
                    },
                    image: {
                        type: 'file',
                        title: 'Choose an image',
                        required: false
                    }
                }
            }
        }
    },
    components: {
        AdminProducts
    },
    async created() {
        try {
            let response = await axios.get('/api/users');
                
            this.$root.$data.user = response.data.user;

            await this.getMerchandiseTypes();
            await this.getMerchandiseItems();
            await this.getSongs();
            await this.getAlbums();
            await this.getBands();
            
        } catch(error) {
            this.$root.$data.user = null;

            window.location = '/account/login';
        }
    },
    computed: {
        isAdmin() {
            return this.user.roles.includes('admin');
        },
        user() {
            return this.$root.$data.user;
        }
    },
    methods: {
        async getMerchandiseTypes() {
            try {
                const response = await axios.get('/api/types');

                this.types = response.data;
            } catch(error) {
                console.log(error);
            }
        },
        async getMerchandiseItems() {
            try {
                const response = await axios.get('/api/merchandise');

                this.merchandise = response.data;
            } catch(error) {
                console.log(error);
            }
        },
        async getSongs() {
            try {
                const response = await axios.get('/api/songs');

                this.songs = response.data;
            } catch(error) {
                console.log(error);
            }
        },
        async getAlbums() {
            try {
                const response = await axios.get('/api/albums');

                this.albums = response.data;
            } catch(error) {
                console.log(error);
            }
        },
        async getBands() {
            try {
                const response = await axios.get('/api/bands');

                this.bands = response.data;
            } catch(error) {
                console.log(error);
            }
        },
        getInputs(type, item) {
            const input = this.inputs[type];
            for (let key in input) {
                input[key].value = item && item[key];
            }

            return input;
        },
        async upload(formData, id, url) {
            try {
                if (id) {
                    await axios.put(url + '/' + id, formData);
                } else {
                    await axios.post(url, formData);
                }

                location.reload();
            } catch(error) {
                if (error.response && error.response.data.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = "Internal service error."
                }
            }
        },
        async logout () {
            try {
                await axios.delete('/api/users');
                this.$root.$data.user = null;
            } catch(error) {
                console.log(error);
            }
        },
    }
}
</script>

<style scoped>
.item {
    margin-top: 30px;
}
</style>