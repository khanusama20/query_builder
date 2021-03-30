<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    :timeout="timeout"
    :left="true"
  >
    {{ text }}
    <v-btn
      dark
      flat
      @click="onClose"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        color: 'success',
        mode: '',
        timeout: 6000
      }
    },
    computed: {
      snackbar: {
        get: function () {
          return this.value;
        },
        // setter
        set: function (newValue) {
          return newValue;
        }
      }
    },
    methods: {
      onClose () {
        this.snackbar = false;
        this.$emit('onToastClose' , false)
      }
    },
    watch: {
      value () {
        let self = this;
        setTimeout(() => {
          self.onClose();
        }, this.timeout)
      }
    }
  }
</script>