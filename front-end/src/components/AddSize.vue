<template>
    <add-key-value v-model="pairs" keyText="Size" valueText="Number of Items" valueType="number"/>
</template>

<script>
import AddKeyValue from './AddKeyValue.vue';
export default {
    name: "AddSize",
    components: { 
        AddKeyValue 
    },
    props: {
        value: Object
    },
    data() {
        return {
            pairs: []
        }
    },
    created() {
        console.log(this.value);
        for (let key in this.value) {
            this.pairs.push({key: key, value: this.value[key]});
        }
    },
    watch: {
        pairs: {
            handler(pairs) {
                const value = {}
                for (let pair of pairs) {
                    value[pair.key] = pair.value;
                }
                this.$emit('input', value);
            },
            deep: true
        }
    }
}
</script>