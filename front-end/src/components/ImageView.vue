<template>
    <div class="view-container">
        <div class="image-container">
            <img :src="image"/>
        </div>
        <div :class="'info-container ' + this.infoClass">
            <slot/>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageView",
    props: {
        image: String,
        infoClass: String
    }
}
</script>

<style scoped>
.view-container {
    display: flex;
    flex-direction: column;
}

.image-container {
    padding: 0 60px;
}

.info-container {
    display: flex;
    flex-direction: column;
}

.info-container p {
    padding-top: 1rem;
    text-align: left;
}

img {
    width: 100%;
}

@media only screen and (min-width: 960px) {
    .view-container {
        flex-direction: row;
        padding: 20px 40px;
    }

        .view-container > div {
        width: 50%;
    }

}
</style>