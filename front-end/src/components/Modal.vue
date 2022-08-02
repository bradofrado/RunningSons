<template>
<div v-if="show">
    <slot></slot>
</div>
</template>

<script>
// import Vue from 'vue'
// import Uploader from '@/components/Uploader.vue'

export default {
    name: 'Modal',
    props: {
        show: Boolean,
    },
    data() {
        return {
            modal: null
        }
    },
    watch: {
        show(show) {
            if (show) {
                // const ComponentClass = Vue.extend(Uploader);
                // const instance = new ComponentClass();
                // instance.$mount();
                // this.$root.$refs.app.$refs.modal(instance.$el);
                this.$root.$refs.app.$refs.modal.showModal(this.$slots.default);
            }
            else {
                this.$root.$refs.app.$refs.modal.hideModal();
            }
        }
    }
}
</script>

<style scoped>

</style>