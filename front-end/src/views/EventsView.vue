<template>
<div>
    <h1>Events</h1>
    <div v-if="events.length == 0">
        <p>Sorry, there are no events. Check back later!</p>
    </div>
    <div v-else class="events-container">
        <event-item-display v-for="event in events" :key="event._id" :event="event" />
    </div>
</div>
</template>

<script>
import axios from 'axios';
import EventItemDisplay from '@/components/Events/EventItemDisplay.vue';

export default {
    name: "EventsView",
    components: {
        EventItemDisplay
    },
    data() {
        return {
            events: []
        }
    },
    async created() {
        await this.getEvents();
    },
    methods: {
        async getEvents() {
            try {
                const response = await axios.get('/api/events');

                this.events = response.data;
            } catch {
                //
            }
        }
    }
}
</script>

<style scoped>
.events-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    grid-auto-rows: minmax(100px, auto);
    margin-top: 20px;
}

@media only screen and (min-width: 960px) {
    .events-container {
        grid-template-columns: repeat(3, 1fr);
        /* gap: 20px;
        grid-auto-rows: minmax(100px, auto);
        margin-top: 20px; */
    }
}
</style>
