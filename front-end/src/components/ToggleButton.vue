<template>
    <button :class="activeClass"><slot></slot></button>
</template>

<script>
export default {
    name: "ToggleButton",
    props: {
        active: Boolean
    },
    computed: {
        activeClass() {
            return this.active ? 'active' : '';
        }
    }
}
</script>

<style scoped>
.active {

}
</style>
