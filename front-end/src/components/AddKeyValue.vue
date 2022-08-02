<template>
<div>
    <div class="pairs-container">
        <div class="pair">
            <span>{{keyText}}</span>
            <span>{{valueText}}</span>
        </div>
        <div class="pair" v-for="pair in pairs" :key="pair._id">
            <input class="input" v-model="pair.key"/>
            <number-picker v-if="valueType == 'number'" v-model="pair.value" :min="0"/>
            <input v-else-if="valueType == 'string'" class="input" v-model="pair.value"/>
            <div v-else>Invalid value type {{valueType}}</div>
            <button type="button" class="button button-secondary" @click="remove(pair.key)">X</button>
        </div>
    </div>
    <button type="button" class="button button-primary add-button" @click="add">Add</button>
</div>
</template>

<script>
import NumberPicker from './NumberPicker.vue';
export default {
    name: "AddKeyValue",
    components: { 
        NumberPicker
    },
    props: {
        value: Array,
        keyText: {
            type: String,
            default: 'Key'
        },
        valueText: {
            type: String,
            default: 'Value'
        },
        valueType: {
            type: String,
            default: 'string'
        }
    },
    data() {
        return {
            pairs: []
        }
    },
    created() {
        for (let key of this.value) {
            this.pairs.push(key);
        }
    },
    methods: {
        add() {
            this.pairs.push({key: null, value: null});
        },
        remove(key) {
            const index = this.pairs.findIndex(x => x.key === key);

            if (index > -1) {
                this.pairs.splice(index, 1);
            }
        }
    },
    watch: {
        pairs: {
            handler(pairs) {
                this.$emit('input', pairs);
            },
            deep: true
        }
    }
}
</script>

<style scoped lang="scss">
.pair {
    display: grid;
    grid-template-columns: 100px 200px 60px;
    gap: 10px;
}

.pair span {
    color: $black;
}

.add-button {
    float: left;
    margin-top: 10px;
}
</style>