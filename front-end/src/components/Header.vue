<template>
    <b-navbar class="bg-primary-dark" toggleable="lg" type="dark">
        <div class="container header-container">
            <b-navbar-brand href="/">Running Sons</b-navbar-brand>
            <b-navbar-nav class="mobile navbar-singleline b-width-expand">
                <b-nav-item to="/cart" active-class="active" class="cart-icon">
                    <icon class="active-circle" icon="cart" circle v-num-icon="numCartItems"/>
                </b-nav-item>
                <b-nav-item v-if="user" to="/account" exact-active-class="active">
                    <icon class="active-circle" icon="profile" circle/>
                </b-nav-item>
            </b-navbar-nav>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav >
                    <b-nav-item to="/" exact-active-class="active">Home</b-nav-item>
                    <b-nav-item to="/music" active-class="active">Music</b-nav-item> 
                    <b-nav-item id="merch-popover" active-class="active" to="/merchandise" @click="onMerchClick">Merchandise</b-nav-item>                                                        
                </b-navbar-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item to="/cart" active-class="active" class="cart-icon not-mobile">
                        <icon class="active-circle" icon="cart" circle v-num-icon="numCartItems"/>
                    </b-nav-item>
                    <b-nav-item v-if="user" to="/account" exact-active-class="active" class="not-mobile">
                        <icon class="active-circle" icon="profile" circle/>
                    </b-nav-item>
                    <template v-else>
                        <b-nav-item  to="/account/signup" active-class="active">Sign up</b-nav-item>
                        <span class="not-mobile">|</span>
                        <b-nav-item  to="/account" exact-active-class="active">Login</b-nav-item>
                    </template>
                </b-navbar-nav>
                <b-popover v-if="types" ref="popover" target="merch-popover" triggers="hover blur" placement="bottom">
                        <b-navbar-nav>
                            <b-nav-item v-for="type in types" class="nav-dropdown-item" :href="'/merchandise/collections/'+type.type" :key="type._id">{{type.name}}</b-nav-item>                            
                        </b-navbar-nav>
                </b-popover>   
            </b-collapse>
        </div>
    </b-navbar>
</template>

<script>
import axios from 'axios';
import Icon from '../../../global/components/Icon.vue';

export default {
  components: { Icon },
    name: "HeaderControl",
    data() {
        return {
            types: null
        }
    },
    async created() {
        await this.getMerchandiseTypes();
    },
    computed: {
        user() {
            return this.$root.$data.user;
        },
        numCartItems() {
            return this.$root.$data.numCartItems;
        }
    },
    methods: {
        onMerchClick() {
            this.$refs.popover.$emit('close');
        },
        async getMerchandiseTypes() {
            try {
                const response = await axios.get('/api/types');

                this.types = response.data;
            } catch {
                //
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.not-mobile {
    display: none;
}

.mobile {
    display: inherit;
}

.collapsed {
    order: 2
}

.navbar-nav {
    align-items: center;
}

.nav-dropdown-item {
    // padding: 5px;
}

.nav-link {
    color: $white;
}

.nav-link:hover, .nav-dropdown-active, .navbar-dark .navbar-nav .nav-link:hover {
    color: $secondary-2-hover;
}

.navbar-singleline {
    flex-direction: row !important;
    align-items: center;
}

.navbar-singleline li:first-child {
    margin: 0 10px;
}

.active .active-circle {
    background-color: $black;
    border-radius: 50%;
}
.cart-icon {
    position: relative;
}

.b-width-expand {
    flex: 1;
}

@media only screen and (min-width: 960px) {
    .not-mobile {
        display: inherit;
    }

    .mobile {
        display: none;
    }
}
</style>