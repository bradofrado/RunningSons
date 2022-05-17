<template>
  <div id="app" class="footer-app-container">
    <router-view class="footer-app"/>
    <Footer/>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue';

export default {
    name: "App",
    components: {
        Footer
    }
}
</script>

<style>
body {
    margin: 0px;
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #fff;
    font-size: 12px;
}

@keyframes gradient {
    0%{background-position:10% 0%}
    50%{background-position:91% 100%}
    100%{background-position:10% 0%}
}
#app {
    text-align: center;
    background-image: linear-gradient(-180deg, #188B7D , #033740);
    background-size: 200% 200%;
    animation: gradient 5s ease infinite;
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

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

@media only screen and (min-width: 960px) {
    body {
        font-size: 16px;
    }
}
</style>
