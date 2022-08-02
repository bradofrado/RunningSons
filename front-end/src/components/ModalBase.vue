<template>
<transition v-if="show" name="modal">
  <div class="modal-mask">
    <div class="modal-container">
        <div ref='container'></div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
    name: 'Modal',
    data() {
        return {
            show: false,
            children: []
        }
    },
    methods: {
        showModal(children) {
            //We have to set it to false, then true in case there is already a modal showing
            //to clear the contents
            this.show = false;
            this.$nextTick(function() {
                this.show = true;
                this.$nextTick(function() {
                    //The children passed in are VNodes
                    children.forEach(child => {
                        this.$refs.container.appendChild(child.elm);
                    })
                }.bind(this))
               
            }.bind(this));
        },
        hideModal() {
            this.show = false;
        }
    },
}
</script>

<style scoped>
/* Modals */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  transition: opacity 0.5s ease;
  display: flex;
  transition: background 0.2s ease-in-out, height 1s ease-in-out;
  transition: height 0.2s ease-in-out, width 0.2s ease-in-out;
  justify-content: center;
  transition-timing-function: cubic-bezier(0.64, 0.57, 0.67, 1.53);
  overflow: auto;
}

.modal-container {
  height: max-content;
  margin-top: 10px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all 0.5s ease;
}

/*
* The following styles are auto-applied to elements with
* transition="modal" when their visibility is toggled
* by Vue.js.
*
* You can easily play with the modal transition by editing
* these styles.
*/
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/* Form */
@media only screen and (min-width: 960px) {
    .modal-container {
        width: 50%;
        margin-top: 40px;
        flex-direction: row;
    }
}
</style>