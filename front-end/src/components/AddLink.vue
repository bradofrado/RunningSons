<template>
    <add-key-value v-model="pairs" keyText="Links" valueText="Number of Items"/>
</template>

<script>
import AddKeyValue from './AddKeyValue.vue';
export default {
    name: "AddLink",
    components: { 
        AddKeyValue 
    },
    props: {
        value: Array
    },
    data() {
        return {
            pairs: []
        }
    },
    created() {
        for (let link of this.value) {
            this.pairs.push({key: link.type, value: link.url});
        }
    },
    watch: {
        pairs: {
            handler(pairs) {
                const value = [];
                for (let pair of pairs) {
                    value.push({type: pair.key, url: pair.value});
                }
                console.log(value);
                this.$emit('input', value);
            },
            deep: true
        }
    }
}
</script>