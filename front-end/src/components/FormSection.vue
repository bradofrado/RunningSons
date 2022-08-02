<template>
    <div class="section-container">
        <h5>{{name}}</h5>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "FormSection",
    props: {
        name: String
    }
}
</script>

<style scoped>
.section-container {
    color: #000;
}

h5 {
    text-align: left;
}
</style>