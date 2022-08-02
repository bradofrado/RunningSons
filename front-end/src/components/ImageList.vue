<template>
    <div class="list-container">
        <h2>{{name}}</h2>
        <div class="items-container">
            <image-button class="item" v-for="item in items" :key="item._id" :img="item.image" 
                :name="item.name" :to="to + item.name" :center="false" dark/>
        </div>
    </div>
</template>

<script>
import ImageButton from '@/components/ImageButton.vue';

export default {
    name: "ImageList",
    props: {
        name: String,
        items: Array,
        to: String
    },
    components: {
        ImageButton
    }
}
</script>

<style scoped>
h2 {
    text-align: center;
}
.list-container {
   
}

.items-container {
    display:flex;
    flex-direction: column;
}

.item {

}

@media only screen and (min-width: 960px) {
    h2 {
        text-align: left;
        padding-left: 40px;
    }

    .items-container {
        flex-direction: row;
    }

    .item {
        margin: 0 10px;
    }
}
</style>