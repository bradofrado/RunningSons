<template>
    <div class="picker-container">
        <button class="square button button-secondary" @click="remove">-</button>
        <input ref="input" class="square input" :value="content" @blur="handleInput"/>
        <button class="square button button-secondary" @click="add">+</button>
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
                return;
            }

            if (val < this.min) {
                val = this.min;
                this.$refs.input.value = val;
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
    display: display;
}

.square {
    width: 50px;
    height: 50px;
}

.picker-button {
    
}

input {
    text-align: center;
    background-color: #fff;
}
</style>