<template>
    <b-navbar class="bg-primary-dark" toggleable="lg" type="dark">
        <div class="container header-container">
            <b-navbar-brand href="/">Running Sons</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/" exact-active-class="active">Home</b-nav-item>
                    <b-nav-item to="/music" active-class="active">Music</b-nav-item> 
                    <b-nav-item to="/merchandise" active-class="active">Merchandise</b-nav-item>                                       
                </b-navbar-nav>
            </b-collapse>
        </div>
    </b-navbar>
</template>

<script>
export default {
    name: "HeaderControl"
}
</script>

<style lang="scss" scoped>

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