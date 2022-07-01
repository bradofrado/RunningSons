<template>
    <div id="app" class="footer-app-container">
       <Header/>
        <div class="footer-app">
            <router-view />
        </div>
        <Footer/>
    </div>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

export default {
    name: "App",
    components: {
        Footer,
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
@import '@/scss/custom.scss';

@keyframes gradient {
    0%{background-position:10% 0%}
    50%{background-position:91% 100%}
    100%{background-position:10% 0%}
}
#app {
    text-align: center;
    background-image: linear-gradient(-180deg, $primary-2 , $primary);
    background-size: 200% 200%;
    animation: gradient 5s ease infinite;
}

.title-container {
    padding-top: 100px;
}

.title {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 5em;
    text-shadow: 2px 4px 20px #283b3b;
}

.sub-title {
    color: #FFC31F;
}

@media only screen and (min-width: 960px) {
    .title-container {
        padding-top: 150px;
    }
}

.footer-app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.footer-app {
    flex: 1;
    margin-top: 20px;
    margin-bottom: 20px;
}

@media only screen and (min-width: 960px) {
    body {
        font-size: 16px;
    }
}
</style>
