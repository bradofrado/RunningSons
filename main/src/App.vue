<template>
    <div id="app" class="footer-app-container app-default">
        <div class="footer-app">
            <router-view />
        </div>
        <Footer/>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            intro: true
        }
    },
}
</script>

<style lang="scss">
// @keyframes gradient {
//     0%{background-position:10% 0%}
//     50%{background-position:91% 100%}
//     100%{background-position:10% 0%}
// }

// .app-default {
//     text-align: center;
//     background-image: linear-gradient(-180deg, $primary-2 , $primary);
//     background-size: 200% 200%;
//     animation: gradient 5s ease infinite;
// }

// .footer-app-container {
//     display: flex;
//     flex-direction: column;
//     min-height: 100vh;
// }

// .footer-app {
//     flex: 1;
//     margin-top: 20px;
//     margin-bottom: 20px;
// }
</style>
