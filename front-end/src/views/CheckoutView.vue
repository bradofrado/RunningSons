<template>
    <div class="card-container">
        <card-element/>
    </div>
</template>

<script>
import CardElement from '../components/CardElement.vue'
export default {
    name: "CheckoutView",
    components: {
        CardElement
    }
}
</script>

<style scoped>
.card-container {
    margin: 0 50px;
}

@media only screen and (min-width: 960px) {
    .card-container {
        margin: 0 300px;
    }
}
</style>