<template>
    <div class="home-container">
        <h1 class="title">Running Sons</h1>
        <p>Album <em>Falling Sand</em> and Merchandise coming soon...</p>
    </div>
</template>

<script>
export default {
  name: 'HomeView',
  components: {
    
  }
}
</script>

<style scoped>
.title {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 5em;
    text-shadow: 2px 4px 20px #283b3b;
}

p {
    color: #FFC31F;
}

.home-container {
    padding-top: 100px;
}

@media only screen and (min-width: 960px) {
    .home-container {
        padding-top: 150px;
    }
}
</style>
