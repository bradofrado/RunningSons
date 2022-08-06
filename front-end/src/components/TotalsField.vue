<template>
    <div class="">
        <div v-if="subtotal" class="total-lineitem"><span>Subtotal:</span><span>${{subtotals.toFixed(2)}}</span></div>
        <div v-else class="total-lineitem" v-for="item in items" :key="item._id">
            <span>{{item.fullName}}</span>
            <span>${{item.total.toFixed(2)}}</span>
        </div>
        <div class="total-lineitem"><span>Shipping:</span><span>${{shipping.toFixed(2)}}</span></div>
        <template v-for="{_id, code} in codes">
            <div v-if="code.value > 0" class="total-lineitem" :key="_id">
                <span><button class="button apply-button" v-b-tooltip.hover title="remove" @click="remove(_id)">{{code.code}}:</button></span> 
                <span>-${{code.value.toFixed(2)}}</span>
            </div>
        </template>
        <hr>
        <div class="total-lineitem"><span><em>Total:</em></span><span>${{total.toFixed(2)}}</span></div>
        <div v-if="coupon" class="total-lineitem mt-3">
            <span><input class="input input-code" v-model="code" placeholder="Apply Code"/></span>
            <span><button class="button button-primary" @click="applyCode" v-spinner="loading">Apply</button></span>
        </div>
        <span v-if="error" class="danger">{{error}}</span>
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
                prev += curr.code.value;

                return prev;
            }, 0)
        },
        total() {
            return this.subtotals + this.shipping - this.codeAmount;
        }
    },
    watch: {
        async total() {
            await this.getCodes();
        }
    },
    methods: {
        async getCodes() {
            try {
                const response = await axios.get('/api/codes/apply');

                this.codes = response.data;
            } catch {
                //
            }
        },
        async applyCode() {
            if (!this.code) return;
            this.loading = true;
            this.error = null;
            try { 
                await axios.post('/api/codes/apply', {
                    code: this.code
                });
                this.code = null;
            } catch(error) {
                this.error = "Cannot apply code";
            } finally {
                await this.getCodes();
                this.loading = false;
            }
        },
        async remove(id) {
            try {
                await axios.delete('/api/codes/apply/'+id);
                await this.getCodes();
            } catch {
                //
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

.apply-button {
    padding-top: 0;
    padding-bottom: 0;
}
</style>