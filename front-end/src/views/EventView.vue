<template>
    <h1 v-if="!event">
        Loading...
    </h1>
    <image-view v-else :image="event.image">
        <h1>{{event.name}}</h1>
        <p>{{event.description}}</p>
    </image-view>
</template>

<script>
//import ImageView from '../components/ImageView.vue'
import axios from 'axios';
import ImageView from '../components/ImageView.vue';

export default {
    name: "EventView",
    components: { 
        ImageView 
    },
    data() {
        return {
            event: null,
            edit: false
        }
    },
    async created() {
        await this.getEvent();
    },
    methods: {
        async getEvent() {
            try {
                const response = await axios.get('/api/events/' + this.$route.params.id);

                this.event = response.data;
            } catch {
                //
            }
        }
    }
}
</script>
