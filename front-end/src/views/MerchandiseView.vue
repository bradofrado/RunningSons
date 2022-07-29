<template>
    <h1 v-if="!types">Loading...</h1>
    <h1 v-else-if="!Object.keys(types).length" class="title-container">Merchandise coming soon...</h1>
    <div v-else>
        <h2>Merchandise</h2>
        <div class="types-container">
            <image-button v-for="type in types" :key="type._id" :img="type.image" :name="type.name" :to="'/merchandise/collections/' + type.type"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import ImageButton from '@/components/ImageButton.vue';

export default {
    name: "MerchandiseView",
    components: {
        ImageButton
    },
    data() {
        return {
            types: null
        }
    },
    async created() {
        await this.getMerchandiseTypes();
    },
    methods: {
        async getMerchandiseTypes() {
            try {
                const response = await axios.get('/api/types');

                this.types = response.data;
            } catch {
                //
            }
        }
    }
}
</script>

<style scoped lang="scss">
.types-container {
    display: grid;
    grid-template-columns: auto;
}

@media only screen and (min-width: 960px) {
    .types-container {
        display: grid;
        grid-template-columns: auto auto auto;
    }
}

</style>