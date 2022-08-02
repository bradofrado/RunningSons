<template>
    <div class="picker-container">
        <button type="button" class="square button button-secondary" @click="remove" :disabled="content <= min">-</button>
        <input ref="input" class="square input" :value="content" @blur="handleInput"/>
        <button type="button" class="square button button-secondary" @click="add" :disabled="max != null && content >= max">+</button>
    </div>
</template>

<script>
export default {
    name: "NumberPicker",
    props: {
        min: {
            type: Number,
            default: 1
        },
        max: {
            type: Number,
            default: null
        },
        value: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            content: this.value
        }
    },
    watch: {
        max() {
            this.setValue(this.content);
        },
        min() {
            this.setValue(this.content);
        }
    },
    methods: {
        handleInput(e) {
            const val = parseInt(e.target.value);
            if (!this.isInt(e.target.value)) {
                this.$refs.input.value = this.content;
                return;
            }

            this.setValue(val);
        },
        add() {
            this.setValue(this.content+1);
        },
        remove() {
            this.setValue(this.content-1);
        },
        setValue(val) {
            if (this.max != null && val > this.max) {
                val = this.max;
                this.$refs.input.value = val;
                this.content = val;
                this.$emit('input', val);
                return;
            }

            if (val < this.min) {
                val = this.min;
                this.$refs.input.value = val;
                this.content = val;
                this.$emit('input', val);
                return;
            }

            this.content = val;
            this.$emit('input', val);
        },
        isInt(val) {
            const length = val.length;
            const i = parseInt(val);
            if (isNaN(i)) return false;

            if (i.toString().length != length) return false;

            return true;
        }
    }
}
</script>

<style scoped>
.picker-container {
    display: flex;
    justify-content: center;
}

.square {
    min-width: 50px;
    height: 50px;
    max-width: 100px;
}

.picker-button {
    
}

input {
    text-align: center;
}
</style>