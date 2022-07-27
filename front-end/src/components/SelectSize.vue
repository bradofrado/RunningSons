<template>
    <div>
        <button v-for="size in Object.keys(sizes)" :key="size" v-active="active == size"
            @click="onClick(size)" :disabled="sizes[size] <= 0">{{size}}</button>
    </div>
</template>

<script>
export default {
    name: "SelectSize",
    props: {
        sizes: Object,
        value: String
    },
    data() {
        return {
            active: null
        }
    },
    created() {
        this.active = this.value;
    },
    methods: {
        onClick(size) {
            this.active = size;
            this.$emit('input', size);
        }
    }
}
</script>

<style scoped lang="scss">
button {
    background-color: inherit;
    color: inherit;
    border: 0px solid $white;
    border-radius: 10px;
    width: 30px;
    height: 30px;
    margin: 0 5px;
}

button:disabled {
    color: $gray;
}

.active:not(:disabled) {
    border-width: 1px;
}
</style>