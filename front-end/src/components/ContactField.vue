<template>
<div class="grid">
    <input class="input" v-model="firstname" placeholder="First Name" />
    <input class="input" v-model="lastname" placeholder="Last Name" />
    <input class="input grid-1-2" v-model="email" :placeholder="'Email'" />
</div>
</template>

<script>
export default {
    name: "ContactField",
    props: {
        value: Object
    },
    data() {
        return {
            email: null,
            firstname: null,
            lastname: null
        }
    },
    watch: {
        email() {
            this.change();
        },
        firstname() {
            this.change();
        },
        lastname() {
            this.change();
        }
    },
    methods: {
        change() {
            this.$emit('input', {
                email: this.email,
                firstname: this.firstname,
                lastname: this.lastname
            })
        }
    }
}
</script>

<style scoped>
input {
    width: 100%;
}

.w-1-2 {
    width: 45%;
}

.grid-1-2 {
    grid-column: 1 / 3;
}

.grid {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: auto auto;
    gap: 10px;
    grid-auto-rows: 100%;
}
</style>