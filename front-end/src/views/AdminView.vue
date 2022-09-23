<template>
    <div v-if="isAdmin" class="products-container">
        <admin-products class="item" name="Merchandise Types" :items="types" :inputs="inputs.types" url="/api/types" @upload="getMerchandiseTypes" @delete="getMerchandiseTypes"/>
        <admin-products class="item" name="Merchandise" :items="merchandise" :inputs="inputs.merchandise" url="/api/merchandise" @upload="getMerchandiseItems"  @delete="getMerchandiseItems"/>
        <admin-products class="item" name="Events" :items="events" :inputs="inputs.events" url="/api/events" @upload="getEvents"  @delete="getEvents"/>
        <admin-products class="item" name="Songs" :items="songs" :inputs="inputs.songs" url="/api/songs" @upload="getSongs"  @delete="getSongs"/>
        <admin-products class="item" name="Albums" :items="albums" :inputs="inputs.albums" url="/api/albums" @upload="getAlbums"  @delete="getAlbums"/>
        <admin-products class="item" name="Bands" :items="bands" :inputs="inputs.bands" url="/api/bands" @upload="getBands"  @delete="getBands"/>
        <admin-products class="item" name="Promo Codes" :items="codes" :inputs="inputs.codes" url="/api/codes" @upload="getCodes"  @delete="getCodes"/>
    </div>
</template>

<script>
import axios from 'axios';
import AddKeyValue from '@/components/AddKeyValue.vue';
import AdminProducts from '../components/AdminProducts.vue';

export default {
    name: "AdminView",
    components: {
        AdminProducts
    },
    data() {
        return {
            types: null,
            merchandise: null,
            songs: null,
            albums: null,
            bands: null,
            codes: null,
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
                    sizes: {
                        type: 'custom',
                        title: 'Sizes',
                        required: true,
                        component: AddKeyValue
                    },
                    image: {
                        type: 'file',
                        title: 'Choose an Image',
                        required: false
                    },
                },
                events: {
                    name: {
                        type: 'input',
                        title: 'Name',
                        required: true
                    },
                    description: {
                        type: 'textarea',
                        title: 'Description',
                        required: true,
                    },
                    location: {
                        type: 'input',
                        title: 'Location',
                        required: true,
                    },
                    price: {
                        type: 'input',
                        title: 'Price',
                        required: false
                    },
                    date: {
                        type: 'date',
                        title: 'Date',
                        required: true
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
                },
                codes: {
                    code: {
                        type: 'input',
                        title: 'Code',
                        required: true
                    },
                    dateExpiration: {
                        type: 'date',
                        title: 'Expiration Date',
                        required: true
                    },
                    type: {
                        type: 'input',
                        title: 'Code type (key:value)',
                        required: true
                    },
                    value: {
                        type: 'input',
                        title: 'Code Price Value (if it is percentage, then do a number between 0 and 1)',
                        required: true
                    },
                    limit: {
                        type: 'input',
                        title: 'Number of times a user can apply this code (0 means infinite)',
                        required: false
                    }
                }
            }
        }
    },
    async created() {
        await this.getEverything();
    },
    computed: {
        isAdmin() {
            return this.user.roles.includes('admin');
        },
        user() {
            return this.$root.$data.user;
        }
    },
    watch: {
        user(user) {
            if (user)
                this.getEverything();
        }
    },
    methods: {
        async getEverything() {
            await this.getMerchandiseTypes();
            await this.getMerchandiseItems();
            await this.getEvents();
            await this.getSongs();
            await this.getAlbums();
            await this.getBands();
            await this.getCodes();
        },
        async getMerchandiseTypes() {
            try {
                const response = await axios.get('/api/types');

                this.types = response.data;
            } catch {
                //
            }
        },
        async getMerchandiseItems() {
            try {
                const response = await axios.get('/api/merchandise');

                this.merchandise = response.data;
            } catch {
                //
            }
        },
        async getSongs() {
            try {
                const response = await axios.get('/api/songs');

                this.songs = response.data;
            } catch {
                //
            }
        },
        async getEvents() {
            try {
                const response = await axios.get('/api/events');

                this.events = response.data;
            } catch {
                //
            }
        },
        async getAlbums() {
            try {
                const response = await axios.get('/api/albums');

                this.albums = response.data;
            } catch {
                //
            }
        },
        async getBands() {
            try {
                const response = await axios.get('/api/bands');

                this.bands = response.data;
            } catch {
                //
            }
        },
        async getCodes() {
            try {
                const response = await axios.get('/api/codes');

                this.codes = response.data;
            } catch {
                //
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
    }
}
</script>