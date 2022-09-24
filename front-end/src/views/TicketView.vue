<template>
    <h1 v-if="!event">
        Loading...
    </h1>
    <merch-item v-else :item="event" :edit="edit" type="Event">
        <div class="close">{{event.location}}</div>
        <div class="close">{{date(event.date)}} - {{event.time}}</div>
        <p>{{event.description}}</p>
        <p>If you are ordering on venmo, pay ${{event.price.toFixed(2)}} with names for each ticket you want to buy
            and we will put you on our list!
        </p>
    </merch-item>
</template>

<script>
//import ImageView from '../components/ImageView.vue'
import axios from 'axios';
import MerchItem from '../components/MerchItem.vue';
import {date} from '@/util.js';

export default {
    name: "TicketView",
    components: { 
        MerchItem,
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
        },
        date
    }
}
</script>
