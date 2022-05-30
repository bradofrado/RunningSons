<template>
<div id="footer">
    <div class="footer-bottom">
        ALL CONTENT COPYRIGHT &#169; 2022 Running Sons
    </div>
    <div class="icons-container">
        <logo-icon icon="instagram" class="icon"/>                 
    </div>   
</div>     
</template>

<script>
import LogoIcon from './LogoIcon.vue'
export default {
    name: "FooterControl",
    components: { 
        LogoIcon 
    },
}
</script>

<style scoped>
#footer {
    padding: 1rem 0;
    /* position: absolute;
    bottom: 0; */
    width: 100%;
}

.footer-top {
    padding: 0.5rem 1rem;
    box-shadow: 0 0 5px 5px #0f8aa0
}

.footer-logo {
    display: flex;
    align-items: center;
    max-width: 200px;
}

.footer-group-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    justify-content: space-around;
}

.footer-group {
    padding: 1rem 0 1rem 1rem;
    color: rgba(255, 255, 255, .8)
}


.icons-container {
    display: flex;
    justify-content: center;
}

.icon {
    margin-right: 1rem;
}

.footer-bottom {
    text-align: center;
    padding: 10px 0;
    font-size: .5rem;
}
</style>