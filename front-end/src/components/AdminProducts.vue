<template>
<div>
    <h4>{{name}}</h4>
    <div class="items-container" >
        <image-button :draggable="isDraggable" @dragstart="onDrag($event, item)" @drop="onDrop($event, item.order)" @dragover.prevent @dragenter.prevent v-for="item in sorted" :key="item._id" :img="item.image" :name="!item.image ? item.name : null" @click="editItem(item)" :title="item.name || item.title"/>
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
import {toUtc} from '@/util.js';

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
        },
        sorted() {
            if (this.isDraggable) {
                return this.items.slice().sort((a, b) => a.order - b.order);
            }

            return this.items;
        },
        isDraggable() {
            return this.items.length > 0 && this.items[0].order >= 0;
        }
    },
    methods: {
        onDrag(evt, item) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('itemID', item._id);
            evt.dataTransfer.setData('order', item.order);
        },
        async onDrop(evt, order) {
            const itemID = evt.dataTransfer.getData('itemID')
            const item = this.items.find((item) => item._id == itemID)
            const startOrder = parseInt(evt.dataTransfer.getData('order'));

            //Don't do anything if we did not change positions
            if (order == startOrder) {
                return;
            }

            if (order > startOrder) {
                for (let i = startOrder + 1; i <= order; i++) {
                    const _item = this.items.find((item) => item.order == i);
                    _item.order--;
                }
            } else if (order < startOrder) {
                for (let i = order; i < startOrder; i++) {
                    const _item = this.items.find((item) => item.order == i);
                    _item.order++;
                }
            }
            item.order = order;

            try {
                await axios.put(this.url + '/order', {items: this.items});
            } catch {
                //
            }
        },
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
            this.error = null;
        },
        async onDelete(id) {
            const item = this.items.find(x => x._id === id);
            if (item) {
                try {
                    await axios.delete(this.url + '/' + id);
                    this.show = false;
                    this.$emit('delete');
                } catch {
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
                    else if (this.inputs[key].type === 'date') {
                        console.log(outputs[key]);
                        formData.append(key, toUtc(outputs[key]));
                    }
                    else {
                        if (typeof outputs[key] === 'object')
                            formData.append(key, JSON.stringify(outputs[key]))
                        else
                            formData.append(key, outputs[key]);
                    }
                }

                if (this.editRoom) {
                    await axios.put(this.url + '/' + this.editRoom._id, formData);
                } else {
                    await axios.post(this.url, formData);
                }
                
                this.show = false;
                this.error = null;
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
    flex-wrap: wrap;
}

@media only screen and (min-width: 960px) {
    .items-container {
        flex-direction: row;
    }
}
</style>