<template>
<div>
    <form class="pure-form" @submit.prevent="onSubmit">
        <legend>{{title}}</legend>
        <template v-for="(input, index) of theInputs" >
            <fieldset v-if="input.type == 'input'" :key="index">
                <label>{{input.title}}</label>
                <input v-model="input.value" :placeholder="input.title"/>                
            </fieldset>
            <fieldset v-else-if="input.type == 'textarea'" :key="index">
                <label>{{input.title}}</label>
                <textarea v-model="input.value" :placeholder="input.title"/>                
            </fieldset>  
            <fieldset v-else-if="input.type == 'custom'" :key="index">
                <label>{{input.title}}</label>
                <component :is="AddSize" v-model="input.value"/>
            </fieldset>               
        </template>
        <div class="imageInputContainer">
            <template v-for="(input, index) of theInputs" >
                <fieldset v-if="input.type == 'file'" :key="index">
                    <label>{{input.title}}</label>
                    <file-input v-model="input.value" :title="input.title" />                            
                </fieldset>
                <fieldset v-else-if="input.type == 'date'" :key="index">
                    <label>{{input.title}}</label>
                    <b-form-datepicker v-model="input.value" />        
                </fieldset>        
            </template>
        </div>
        <p v-if="submitError" class="danger mt-2">{{submitError}}</p>
        <fieldset class="buttons">
            <button type="button" @click="onClose" class="button button-secondary">Close</button>
            <div>
                <button v-if="$listeners.delete" type="button" @click="onDelete" class="button button-secondary" v-spinner="loadingDelete">Delete</button>
                <button type="submit" class="button button-primary ml-0" v-spinner="loading">Submit</button>
            </div>
        </fieldset>
    </form>
</div>
</template>

<script>
//import axios from 'axios';
import FileInput from "@/components/FileInput.vue"
import {Copy} from '@/util.js';
import AddSize from '@/components/AddSize.vue';

export default {
    name: 'Uploader',
    props: {
        //room: Object,
        title: String,
        inputs: Object,
        error: String,
        id: String
    },
    components: {
        FileInput,
    },
    data() {
        return {
            submitError: '',
            theInputs: {},
            loading: false,
            loadingDelete: false,
            AddSize
        }
    },
    created() {
        this.submitError = this.$props.error;
        this.theInputs = Copy(this.$props.inputs);
    },
    watch: {
        error(error) {
            this.submitError = error;
        }
    },
    methods: {
        onClose() {
            this.$emit('close');
            this.submitError = '';
        },
        async onDelete() {
            this.loadingDelete = true;
            await this.$emit('delete', this.id);
            this.loadingDelete = false;
            this.submitError = '';
        },    
        async onSubmit() {
            this.loading = true;

            let output = {};    
            let inputsChanged = false;
            for (const name in this.theInputs) {
                const input = this.theInputs[name];

                //Validate all of the fields
                //TODO: highlight the exact input in red
                if (input.required && !input.value) {
                    this.submitError = "Please fill out all fields";
                    this.loading = false;
                    return;
                }

                if (input.value !== this.$props.inputs[name].value) {
                    inputsChanged = true;
                }

                output = {...output, [name]: input.value };
            }

            await this.$emit('submit', output, inputsChanged);

            this.loading = false;
            this.submitError = '';
        }
    }
}
</script>
<style>
div:not(.bg-light) > .text-dark {
    color: #fff !important;
}

.form-control.focus {
    background-color:#033740 !important;
}
</style>
<style scoped>
/* Form */

.pure-form legend {
    display: block;
    width: 100%;
    padding: 0.3em 0;
    margin-bottom: 0.3em;
    color: #333;
    border-bottom: 1px solid #e5e5e5;
}

.pure-form label {
    width: 100%;
    color: #000;
    text-align: left;
}

.pure-form fieldset {
    padding: 0.35em 0 0.75em;
    border: 0;
}

.pure-form input:not([type]) {
    padding: 0.5em 0.6em;
    display: inline-block;
    border: 1px solid #ccc;
    -webkit-box-shadow: inset 0 1px 3px #ddd;
    box-shadow: inset 0 1px 3px #ddd;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.pure-form input:not([type]):focus {
    outline: 0;
    border-color: #129fea;
}

.pure-form input[type=color], .pure-form input[type=date], .pure-form input[type=datetime-local], .pure-form input[type=datetime], .pure-form input[type=email], .pure-form input[type=month], .pure-form input[type=number], .pure-form input[type=password], .pure-form input[type=search], .pure-form input[type=tel], .pure-form input[type=text], .pure-form input[type=time], .pure-form input[type=url], .pure-form input[type=week], .pure-form select, .pure-form textarea {
    padding: 0.5em 0.6em;
    display: inline-block;
    border: 1px solid #ccc;
    -webkit-box-shadow: inset 0 1px 3px #ddd;
    box-shadow: inset 0 1px 3px #ddd;
    border-radius: 4px;
    vertical-align: middle;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.pure-form input[type=color]:focus, .pure-form input[type=date]:focus, .pure-form input[type=datetime-local]:focus, .pure-form input[type=datetime]:focus, .pure-form input[type=email]:focus, .pure-form input[type=month]:focus, .pure-form input[type=number]:focus, .pure-form input[type=password]:focus, .pure-form input[type=search]:focus, .pure-form input[type=tel]:focus, .pure-form input[type=text]:focus, .pure-form input[type=time]:focus, .pure-form input[type=url]:focus, .pure-form input[type=week]:focus, .pure-form select:focus, .pure-form textarea:focus {
    outline: 0;
    border-color: #129fea;
}



.imageInputContainer {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
}

input, textarea {
    width: 100%;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.error {
    color: red;
}

@media only screen and (min-width: 960px) {
    .imageInputContainer {
        flex-direction: row;
    }
}
</style>