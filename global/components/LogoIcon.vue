<script>
import Icon from './Icon.vue';

const urls = {
    instagram: "https://www.instagram.com/runningsons/",
    facebook: "https://www.facebook.com/braydon.jones.330/",
    github: "https://github.com/bradofrado/RunningSons",
}

export default {
    name: "LogoIcon",
    props: {
        icon: String,
    },
    render() {
        const url = urls[this.icon];
        if (!url) {
            console.error("Invalid logo icon " + this.icon);
            return;
        }

        return <a target="_blank" href={url} class="circle-hover">
            <Icon icon={this.icon} circle/>
        </a>
    }
}
</script>

<style scoped>
/*asdf*/
</style>