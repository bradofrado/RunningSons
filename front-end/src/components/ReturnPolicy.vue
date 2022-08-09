<template>
    <div>
        <h1>Return Policy</h1>
        <p>Thank you for your purchase. We hope you are happy with your purchase. However, if you are not completely satisfied with your purchase for any reason, you may return it to us for a full refund or an exchange. Please see below for more information on our return policy.</p>
        <terms-section title="RETURNS">
            <p>All returns must be postmarked within seven (7) days of the purchase date. All returned items must be in new and unused condition, with all original tags and labels attached.</p>
        </terms-section>
        <terms-section title="RETURN PROCESS">
            <p>To return an item, please email customer service at help@runningsons.com to obtain a Return Merchandise Authorization (RMA) number. After receiving a RMA number, place the item securely in its original packaging, and mail your return to the following address:</p>
            <p>Running Sons<br/>
                Attn: Returns<br/>
                RMA #<br/>
                335 Wymount<br/>
                Provo, UT 84604<br/>
                United States<br/></p>
            <p>Please note, you will be responsible for all return shipping charges. We strongly recommend that you use a trackable method to mail your return. </p>
        </terms-section>
        <terms-section title="REFUNDS">
            <p>After receiving your return and inspecting the condition of your item, we will process your return or exchange. Please allow at least seven (7) days from the receipt of your item to process your return or exchange. We will notify you by email when your return has been processed.</p>
        </terms-section>
        <terms-section title="EXCEPTIONS">
            <p>For defective or damaged products, please contact us at the contact details below to arrange a refund or exchange.</p>
        </terms-section>
        <terms-section title="QUESTIONS">
            <p>If you have any questions concerning our return policy, please contact us at:</p>
            <p><a href="mailto:help@runningsons.com">help@runningsons.com</a></p>
        </terms-section>
    </div>
</template>

<script>
import TermsSection from '@/components/TermsSection.vue';

export default {
    name: "ReturnPolicy",
    components: {
        TermsSection
    }
}
</script>

<style scoped>
p {
    text-align: left;
}
</style>