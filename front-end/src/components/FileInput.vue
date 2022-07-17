<template>
    <div class="imageInput" @click="chooseImage" >
        <img v-if="url" :src="url" />
        <div v-if="!url" class="placeholder">
            {{title}}
        </div>
        <input class="fileInput" ref="fileInput" type="file" @input="fileChanged">
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        value: [String, File]
    },
    data() {
        return {
            url: ""
        }
    },
    created () {
        this.url = typeof this.$props.value === File ? this.$props.value.webkitRelativePath : this.$props.value;
    },
    methods: {
        fileChanged(event) {
            const file = event.target.files[0];
            this.url = URL.createObjectURL(file);

            this.$emit('input', file);
        },
        chooseImage() {
            this.$refs.fileInput.click()
        },
    }
}
</script>

<style scoped>

.placeholder {
    background: #f0f0f0;
    width: 200px;
    height: 125px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    font-size: 14px;
    cursor: pointer;
}

.fileInput {
  display: none;
}

.imageInput {
    margin: 10px;
}

.imageInput .placeholder:hover {
    background-color: #999;
}

.imageInput img, .imageInput .placeholder {
    cursor: pointer;
}

img {
  width: 200px;
  max-height: 200px;
}
</style>