<template>
    <a class="button-venmo button button-secondary" :href="url" target="_blank">
        <img src="/images/VenmoLogo.png"/>
    </a>
</template>

<script>
export default {
    name: "VenmoButton",
    computed: {
        url() {
            console.log(process.env);
            return process.env.VUE_APP_VENMO_URL;
        }
    }
}
</script>

<style scoped>
.button-venmo img {
    width: 50%;
}
</style>