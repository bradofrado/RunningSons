<script>
import Icon from './Icon.vue';

const urls = {
    instagram: "https://www.instagram.com/runningsons/",
    facebook: "https://www.facebook.com/braydon.jones.330/",
    github: "https://github.com/bradofrado/RunningSons",
    // spotify: "https://github.com/bradofrado/RunningSons",
    // apple: "https://music.apple.com/us/artist/1645664457",
    // itunes: "https://music.apple.com/us/artist/1645664457",
    // amazon: "https://github.com/bradofrado/RunningSons",
    // pandora: "https://github.com/bradofrado/RunningSons",
    // youtube: "https://github.com/bradofrado/RunningSons",
}

export default {
    name: "LogoIcon",
    props: {
        icon: String,
        url: String
    },
    render() {
        const url = this.url || urls[this.icon];
        if (!url) {
            console.log("Invalid logo icon " + this.icon);
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