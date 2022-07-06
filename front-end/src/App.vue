<template>
    <div id="app" class="footer-app-container app-default">
       <Header/>
        <div class="footer-app container">
            <router-view />
        </div>
        <Footer/>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
    name: "App",
    components: {
        Header,

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
