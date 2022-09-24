<template>
    <h1 v-if="!event">
        Loading...
    </h1>
    <merch-item v-else :item="event" :edit="edit" type="Event">
        <template #default>
            <div class="close">{{event.location}}</div>
            <div class="close">{{date(event.date)}} - {{event.time}}</div>
            <p>{{event.description}}</p>
        </template>
        <template #venmo>
            <p>If you are ordering on venmo, pay ${{event.price.toFixed(2)}} for each ticket with names
                and we will put you on our list!
            </p>
        </template>
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
