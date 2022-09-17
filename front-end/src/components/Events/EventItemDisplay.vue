<template>
    <div class="event-container">
        <h2>{{event.title}}</h2>
        <div class="image-container">
            <img :src="event.image"/>
        </div>
        <div class="d-flex justify-content-center no_hover">
            <span>{{date(event.date)}}</span> - <span>{{event.location}}</span>
        </div>
        <p class="event-description">{{event.description}}</p>
        <div class="buttons-container">
            <router-link class="button button-primary m-r" :to="to">Info</router-link>
            <a class="button button-primary" href="/">Tickets</a>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
    name: "EventItemDisplay",
    props: {
        event: Object
    },
    computed: {
        to() {
            return '/events/' + this.event._id;
        }
    },
    methods: {
        date(date) {
            return dayjs(date).format('MM/DD/YYYY')
        }
    }
}
</script>

<style scoped>
.event-container {
    border: 3px solid;
    height: 100%;
    width: 300px;
    margin: auto;
    padding: 10px;
}

.image-container {
    width: 200px;
    height: 200px;
    padding-bottom: 10px;
    margin: 10px auto;
}
img {
    width: 100%;
    max-height: 100%;
}
.event-description {
    text-align: left;
    padding: 0 10px;
}

.buttons-container {
    display: flex;
    justify-content: center;
}

.m-r {
    margin-right: 10px;
}
</style>
