<template>
    <a class="button-venmo button button-secondary" :href="url" target="_blank">
        <img src="/images/VenmoLogo.png"/>
    </a>
</template>

<script>
const urls = {
    default: process.env.VUE_APP_VENMO_URL,
    ios: process.env.VUE_APP_VENMO_URL_IOS,
    android: process.env.VUE_APP_VENMO_URL_ANDROID
}

export default {
    name: "VenmoButton",
    props: {
        amount: Number,
        note: String
    },
    computed: {
        url() {
            let url = urls[this.device];

            url += '&amount=' + this.amount;
            if (this.note) {
                url +=  '&note=' + this.note;
            }

            return url;
        },
        device() {
            return 'default';
            // if (/Android/i.test(navigator.userAgent)) return 'android';
            // if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return 'ios';

            // return 'default'
        }
    }
}
</script>

<style scoped>
.button-venmo img {
    width: 50%;
}
</style>