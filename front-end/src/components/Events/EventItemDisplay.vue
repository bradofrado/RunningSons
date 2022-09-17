<template>
    <div class="event-container">
        <h1>{{event.title}}</h1>
        <div class="image-container">
            <img :src="event.image"/>
        </div>
        <div class="d-flex justify-content-center no_hover">
            <span>{{event.startDate}}</span> - <span>{{event.endDate}}</span>
        </div>
        <p class="event-description">{{event.description}}</p>
    </div>
</template>

<script>
export default {
    name: "EventItemDisplay",
    props: {
        event: Object
    },

}
</script>

<style scoped>
.event-container {
    border-width: 3px;
    height: 100%;
    width: 300px;
    margin: auto;
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
    padding: 20px;
}
</style>
