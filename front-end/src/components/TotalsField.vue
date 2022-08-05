<template>
    <div class="">
        <div v-if="subtotal" class="total-lineitem"><span>Subtotal:</span><span>${{subtotals.toFixed(2)}}</span></div>
        <div v-else class="total-lineitem" v-for="item in items" :key="item._id">
            <span>{{item.fullName}}</span>
            <span>${{item.total.toFixed(2)}}</span>
        </div>
        <div class="total-lineitem"><span>Shipping:</span><span>${{shipping.toFixed(2)}}</span></div>
        <div class="total-lineitem" v-for="code in codes" :key="code._id">
            <span>{{code.code}}:</span> <span>-${{code.value}}</span>
        </div>
        <hr>
        <span v-if="error" class="danger">{{error}}</span>
        <div class="total-lineitem"><span><em>Total:</em></span><span>${{total.toFixed(2)}}</span></div>
        <div v-if="coupon" class="total-lineitem mt-3">
            <span><input class="input input-code" v-model="code" placeholder="Apply Code"/></span>
            <span><button class="button button-primary" @click="applyCode" v-spinner="loading">Apply</button></span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "TotalsField",
    props: {
        coupon: {
            type: Boolean,
            default: false
        },
        subtotal: {
            type: Boolean,
            default: false
        },
        items: Array
    },
    data() {
        return {
            code: null,
            error: null,
            loading: false,
            codes: [],
        }
    },
    async created() {
        await this.getCodes();
    },
    computed: {
        subtotals() {
            return this.items.reduce((prev, curr) => prev + curr.total, 0);
        },
        shipping() {
            return 5;
        },
        codeAmount() {
            return this.codes.reduce((prev, curr) => {
                prev += curr.value;

                return prev;
            }, 0)
        },
        total() {
            return this.subtotals + this.shipping - this.codeAmount;
        }
    },
    methods: {
        async getCodes() {
            try {
                const response = await axios.get('/api/codes/applied');

                this.codes = response.data;
            } catch {
                //
            }
        },
        async applyCode() {
            if (!this.code) return;
            this.applyLoading = true;
            this.error = null;
            try { 
                await axios.post('/api/codes/apply', {
                    code: this.code
                });
            } catch(error) {
                this.error = "Cannot apply code";
            } finally {
                await this.getCodes();
                this.applyLoading = false;
            }
        }
        
    }
}
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    gap: 10px;
    grid-auto-rows: 100%;
}

.input-code {
    max-width: 150px;
    margin-right: 10px;
    height: inherit;
}

.total-lineitem {
    display: flex;
}

.total-lineitem span {
    flex: 1
}

.total-lineitem span:first-child {
    text-align: left;
}

.total-lineitem span:last-child {
    text-align: right;
}
</style>