<template>
<div>
    <div id="app" class="footer-app-container">
       <Header/>
        <div class="footer-app container">
            <router-view />
        </div>
        <Footer/>
    </div>
    <modal-base ref='modal'></modal-base>
</div>
</template>

<script>
import Header from '@/components/Header.vue';
import ModalBase from './components/ModalBase.vue';
import axios from 'axios';

export default {
    name: "App",
    components: {
        Header,
        ModalBase,

    },
    data() {
        return {
            intro: true
        }
    },
    async created() {
        try {
            const response = await axios.get('/api/users');

            this.$root.$data.user = response.data.user;
        } catch(error) {
            console.log(error);
        }
    }
}
</script>

<style lang="scss">
//asdfasdf
.popover-body {
    background-color: $black;
}
</style>
