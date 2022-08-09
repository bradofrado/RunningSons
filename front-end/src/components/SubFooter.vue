<template>
    <div class="footer-container">
        <router-link class="footer-link" to='/terms'>Terms</router-link>
        <router-link class="footer-link" to='/privacy'>Privacy Policy</router-link>
        <router-link class="footer-link" to='/returns'>Returns</router-link>
        <router-link class="footer-link" to='/contact'>Contact</router-link>
    </div>
</template>

<script>
export default {
    name: "SubFooter",
}
</script>

<style scoped lang="scss">
.footer-container {
    // text-align: left;
    border-top: 1px solid;
    padding-top: 20px;
    width: 75%;
    margin: 100px auto 0 auto;
    min-width: 300px;
}

.footer-link {
    color: $white;
    text-decoration: none;
    margin-right: 10px;
}

.footer-link:hover {
    color: $white;
    text-decoration: underline;
}
</style>