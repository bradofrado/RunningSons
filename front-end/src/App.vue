<template>
<div>
    <div id="app" class="footer-app-container app-default">
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
}
</script>

<style lang="scss">
//asdfasdf

</style>
