<template>
    <h1 v-if="!items.length" class="title-container">Merchandise coming soon...</h1>
    <div v-else class="items-container">
        <merch-item-button v-for="item in items" :key="item._id" :id="item._id" :name="item.title">

        </merch-item-button>
    </div>
</template>

<script>
import MerchItemButton from '@/components/MerchItemButton.vue'
export default {
    name: "MerchandiseView",
    components: {
        MerchItemButton
    },
    data() {
        return {
            items: [{
                _id: 'hello',
                title: 'Click me',
                
            },{
                _id: 'hello',
                title: 'Click me'    
            },{
                _id: 'hello',
                title: 'Click me'    
            },{
                _id: 'hello',
                title: 'Click me'    
            }]
        }
    },
    methods: {

    }
}
</script>

<style scoped lang="scss">
.items-container {
    display: grid;
    grid-template-columns: auto auto auto;
}

</style>