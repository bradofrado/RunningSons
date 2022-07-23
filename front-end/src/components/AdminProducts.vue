<template>
<div>
    <h4>{{name}}</h4>
    <div class="items-container">
        <image-button v-for="item in items" :key="item._id" :img="item.image" @click="editItem(item)" :title="item.name || item.title"/>
        <image-button name="Add" @click="addItem"/>
    </div>
    <modal :show="show">
        <uploader @close="close" @submit="onUpload"  v-on="editRoom ? {delete : onDelete} : {}" :inputs="theInputs" :title="title" :error="error" :id="editRoom ? editRoom._id : null"/>
    </modal>
</div>
</template>

<script>
import ImageButton from '@/components/ImageButton.vue';
import Modal from './Modal.vue';
import Uploader from './Uploader.vue';

import axios from 'axios';

import {Copy} from '@/util.js';

export default {
    name: "AdminProducts",
    props: {
        items: Array,
        name: String,
        inputs: Object,
        url: String
    },
    data() {
        return {
            editRoom: null,
            error: null,
            show: false,
            theInputs: null
        }
    },
    components: {
        ImageButton,
        Modal,
        Uploader
    },
    computed: {
        title() {
            return this.editRoom ? 'Edit ' + (this.editRoom.name || this.editRoom.title) : 'Add ' + this.name;
        }
    },
    methods: {
        addItem() {
            this.theInputs = Copy(this.$props.inputs);
            this.show = true;
        },
        editItem(item) {
            this.editRoom = item;

            this.theInputs = this.getInputs(item);
            this.show = true;
        },
        getInputs(item) {
            const inputs = Copy(this.$props.inputs)
            for (let key in inputs) {
                inputs[key].value = item && item[key];
            }

            return inputs;
        },
        close() {
            this.show = false;
            this.editRoom = null;
        },
        async onDelete(id) {
            const item = this.items.find(x => x._id === id);
            if (item) {
                try {
                    await axios.delete(this.url + '/' + id);
                    this.show = false;
                    this.$emit('delete');
                } catch(error) {
                    console.log(error);
                    this.show = false;
                }
            }
        },
        async onUpload(outputs, inputsChanged) {
            if (!inputsChanged) {
                this.show = false;
                return;
            }

            try {
                const formData = new FormData();

                for (let key in this.inputs) {
                    if (this.inputs[key].type === 'file') {
                        if (typeof outputs[key] === 'object')
                            formData.append(key, outputs[key], outputs[key].name);
                    }
                    else 
                        formData.append(key, outputs[key]);
                    console.log(outputs[key]);
                }

                console.log('Form data', formData);
                if (this.editRoom) {
                    await axios.put(this.url + '/' + this.editRoom._id, formData);
                } else {
                    await axios.post(this.url, formData);
                }
                
                this.show = false;
                this.$emit('upload');
            } catch (error) {
                if (error.response && error.response.data.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = "Internal service error."
                }
            }          
        }
    }
}
</script>

<style scoped>
h4 {
    text-align: left;
}

.items-container {
    display: flex;
    flex-direction: column;
}

@media only screen and (min-width: 960px) {
    .items-container {
        flex-direction: row;
    }
}
</style>