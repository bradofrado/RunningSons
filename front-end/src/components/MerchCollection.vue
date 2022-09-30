<template>
    <div v-show="items.length" class="collection-container">
        <h2>{{label}}</h2>
        <div class="items-container">
            <merch-item-button v-for="item in items" :key="item._id" :item="item" :type="type"/>
        </div>
    </div>
</template>

<script>
import MerchItemButton from '@/components/MerchItemButton.vue'

export default {
    name: "MerchCollection",
    components: {
        MerchItemButton
    },
    props: {
        items: Array,
        label: String,
        type: {
            type: String,
            default: 'merchandise'
        }
    },
}
</script>

<style scoped lang="scss">
.items-container {
    display: grid;
    grid-template-columns: auto;
}

@media only screen and (min-width: 960px) {
    .items-container {
        display: grid;
        grid-template-columns: auto auto auto auto;
    }
}

</style>