<template>
    <div class="grid">
        <input class="input grid-1-1" v-model="line1" placeholder="Address" />
        <input class="input grid-1-1" v-model="line2" placeholder="Apartment" />
        <input class="input" v-model="city" placeholder="City" />
        <input class="input" v-model="state" placeholder="State" />
        <input class="input" v-model="postal_code" placeholder="Zip code" />
    </div>
</template>

<script>
export default {
    name: "AddressField",
    props: {
        value: Object
    },
    data() {
        return {
            line1: null,
            city: null,
            line2: null,
            state: null,
            postal_code: null
        }
    },
    created() {
        this.line1 = this.value.line1;
        this.city = this.value.city
        this.line2 = this.value.line2
        this.state = this.value.state
        this.postal_code = this.value.postal_code
    },
    watch: {
        street () {
            this.change();
        },
        city () {
            this.change();
        },
        apartment () {
            this.change();
        },
        state () {
            this.change();
        },
        zipcode () {
            this.change();
        },
    },
    methods: {
        change() {
            this.$emit('input', {
                line1: this.line1,
                line2: this.line2,
                city: this.city,
                state: this.state,
                postal_code: this.postal_code
            })
        }
    }
}
</script>

<style scoped>
.grid-1-1 {
    grid-column: 1/4;
}

.grid {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto auto;
    gap: 10px;
    grid-auto-rows: 100%;
}

input {
    width: 100%;
}
</style>