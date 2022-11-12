<template>
    <b-dropdown :text="text">
        <b-dropdown-item v-for="(item, i) in items" :key="item[_key]" @click="select(i)">
            {{item[name]}}
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
import { BDropdown, BDropdownItem } from 'bootstrap-vue'
export default {
    name: "Dropdown",
    components: {
        BDropdown,
        BDropdownItem
    },
    props: {
        items: Array,
        _key: {
            type: String,
            default: '_id'
        },
        value: String,
        name: {
            type: String,
            default: 'name'
        }
    },
    data() {
        return {
            selected: -1
        }
    },
    created() {
        if (this.value) {
            let index = this.items.findIndex(x => x[this._key] == this.value);
            this.selected = index;
        }
    },
    computed: {
        text() {
            return this.selected > -1 ? this.items[this.selected][this.name] : 'Select';
        }
    },
    methods: {
        select(index) {
            this.selected = index;
            this.$emit('input', this.items[index]);
        }
    }
}
</script>