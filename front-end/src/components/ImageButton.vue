<template>
    <div v-b-tooltip.hover :title="title" :class="'image-button-container' + (dark ? ' dark' : '')">
        <div v-if="img" class="image-container">
            <img :src="img">
        </div>
        <router-link v-if="to" :class="'image-button image-hover center-center' + (img ? ' no-color ' : '') + (buttonClass ? buttonClass : '')" :to="to">            
            <div class="image-button-text center-center" >{{name ? name : ''}}</div>
        </router-link>
        <button v-else-if="hasClick" :class="'image-button image-hover center-center button' + (img ? ' no-color ' : '') + (buttonClass ? buttonClass : '')" @click="onClick">            
            <div class="image-button-text center-center" >{{name ? name : ''}}</div>
        </button>
        <div v-else :class="'image-button center-center' + (img ? ' no-color' : '')">
            <div class="image-button-text center-center" >{{name ? name : ''}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageButton",
    props: {
        to: String,
        name: String,
        img: String,
        id: String,
        buttonClass: String,
        title: String,
        dark: Boolean
    },
    computed: {
        hasClick() {
            return this.$listeners && this.$listeners.click;
        }
    },
    methods: {
        onClick() {
            this.$emit('click', this.id);
        }
    }
}
</script>

<style scoped>

.image-container {
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
}

img {
    height: 100%;
    border-radius: 8px;
    margin-left: 50%;
    transform: translateX(-50%);
}

.image-button-container {
    width: 200px;
    height: 200px;
    margin: 20px auto;
    position: relative;    
}

.image-button {
    position: relative;
    color: inherit;
    background-color: #999;
    transition: background-color .3s ease-in-out;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    border-radius: 8px;
}

.no-color {
    background-color: rgb(255,255,255,0);
}

.no-color.image-hover:hover {
    background-color: rgba(255, 255, 255, .25) !important;
}

.dark .no-color.image-hover:hover {
    background-color: rgba(153, 153, 153, .25) !important;
}

.center-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.image-button-text {
    font-size: 2em;
    color: #fff;
}

.dark .image-button-text {
    font-size: 2em;
    color: #999;
}


.image-hover:hover {
    background-color: rgb(223, 222, 222);
    
    color: inherit;
    cursor: pointer;
}

@media only screen and (min-width: 960px) {
    .image-button-container {
        width: 300px;
        height: 300px;
    }

    .image-button-container {
        margin: 10px;
    }
}
</style>