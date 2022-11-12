<script>
import Icon from './Icon.vue';

const urls = {
    instagram: "https://www.instagram.com/runningsons/",
    facebook: "https://www.facebook.com/braydon.jones.330/",
    github: "https://github.com/bradofrado/RunningSons",
    spotify: "https://open.spotify.com/artist/4oUAnr1cEJYE4Zhl0TEQ8J",
    apple: "https://music.apple.com/us/artist/running-sons/1645664457",
    itunes: "https://music.apple.com/us/artist/running-sons/1645664457",
    amazon: "https://music.amazon.com/artists/B0BFSWSL79/running-sons",
    pandora: "https://www.pandora.com/artist/running-sons/AR4Z6mVblk2lf39",
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