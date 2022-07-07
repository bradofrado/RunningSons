<template>
    <b-navbar class="bg-primary-dark" toggleable="lg" type="dark">
        <div class="container header-container">
            <b-navbar-brand href="/">Running Sons</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/" exact-active-class="active">Home</b-nav-item>
                    <b-nav-item to="/music" active-class="active">Music</b-nav-item> 
                    <b-nav-item id="merch-popover" active-class="active" to="/merchandise" @click="onMerchClick">Merchandise</b-nav-item>                                                        
                </b-navbar-nav>
                <b-popover v-if="types" ref="popover" target="merch-popover" triggers="hover blur" placement="bottom">
                        <b-navbar-nav>
                            <b-nav-item v-for="type in types" class="nav-dropdown-item" :href="'/merchandise/collections/'+type.type" :key="type._id">{{type.name}}</b-nav-item>                            
                        </b-navbar-nav>
                </b-popover>   
            </b-collapse>
            <b-navbar-nav>
                <b-nav-item to="/">
                    <logo-icon icon="shoppingCart"/>
                </b-nav-item>
            </b-navbar-nav>
        </div>
    </b-navbar>
</template>

<script>
import axios from 'axios';

export default {
    name: "HeaderControl",
    data() {
        return {
            types: null
        }
    },
    async created() {
        await this.getMerchandiseTypes();
    },
    methods: {
        onMerchClick() {
            this.$refs.popover.$emit('close');
        },
        async getMerchandiseTypes() {
            try {
                const response = await axios.get('/api/types');

                this.types = response.data;
            } catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.collapsed {
    order: 2
}

.nav-dropdown-item {
    // padding: 5px;
}

.nav-link:hover, .nav-dropdown-active {
    color: $secondary-2;
}
/* .navbar-dark .navbar-nav .nav-link.router-link-exact-active,
.navbar-dark .navbar-nav .nav-link.router-link-exact-active:focus {
    color: #fff;
}


.button-primary {
    background-color: #0f8aa0;
    height: 2.5rem;
    color: #fff;
    margin: 1rem 0;
    font-weight: 500;
}

.button-primary:hover {
    background-color: #18c6e5;
}

button.nav-link {
    border: none;
    background-color: transparent;
}

button:focus, button:focus-visible {
    outline: none;
}

.container.header-container {
    max-width: 100%;
    min-height: 80px;
}

.navbar-collapse {
    justify-content: flex-end;
    margin-right: 20px;
}

.navbar-toggler-container {
    border: none;   
}

.navbar-dark .navbar-toggler {
    color: rgba(255, 255, 255, .8);
    border: none;
}

button.navbar-toggler {
    padding: .75rem 0;
}

.navbar-toggler-label {
    margin-right: 10px;
    font-size: 1rem;
}

.bg-primary-dark {
    background-color: #0f8aa0;
} */
</style>