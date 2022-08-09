<template>
<div class="terms-section">
    <h1><span v-if="index">{{index}}.</span> {{title}}</h1>
    <slot></slot>
</div>
</template>

<script>
export default {
    name: "TermsSection",
    props: {
        index: Number,
        title: String
    }
}
</script>

<style scoped>
.terms-section {
    text-align: left;
}

a {
    color: inherit;
}

li {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>