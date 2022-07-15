<template>
    <div class="bubble-container card-container">
        <form-section class="mb-5" name="Contact Information">
            <contact-field v-model="contact"/>
        </form-section>
        <form-section class="mb-5" name="Address Information">
            <address-field v-model="address"/>
        </form-section>
        <form-section class="mb-5" name="Card Information">
            <card-element :address="address" :contact="contact"/>
        </form-section>
    </div>
</template>

<script>
import CardElement from '../components/CardElement.vue'
import FormSection from '../components/FormSection.vue'
import ContactField from '../components/ContactField.vue'
import AddressField from '../components/AddressField.vue'
export default {
    name: "CheckoutView",
    components: {
        CardElement,
        FormSection,
        ContactField,
        AddressField
    },
    data() {
        return {
            address: {
                street: null,
                apartment: null,
                city: null,
                state: null,
                zipcode: null
            },
            contact: {
                email: null,
                firstname: null,
                lastname: null
            }
        }
    },
    watch: {
        address: {
            handler (a) {
                console.log(a);
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.card-container {
    margin: 0 50px;
}

@media only screen and (min-width: 960px) {
    .card-container {
        margin: 0 100px;
    }
}
</style>