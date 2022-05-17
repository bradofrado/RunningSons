<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
body {
    background-image: linear-gradient(-180deg, #4a6d6c , #033740);
    background-size: 200% 200%;
    animation: gradient 5s ease infinite;
    margin: 0px;
}

@keyframes gradient {
    0%{background-position:10% 0%}
    50%{background-position:91% 100%}
    100%{background-position:10% 0%}
}
#app {
  font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  height: 100vh;
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
</style>
