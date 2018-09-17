<style lang="scss">
  @include b(divide) {
    height: 1px;
    width: 100%;
    background-color: #ccc;
  }
</style>

<template>
  <div class="divide" :style="bodyStyles"></div>
</template>

<script>
  export default {
    name: "divide",
    props: {
      height: {
        type: String,
        default: '1px'
      },
      width: {
        type: String,
        default: '100%'
      },
      backgroundColor: {
        type: String,
        default: '#ccc'
      }
    },
    computed: {
      bodyStyles() {
        return {
          height: this.height,
          width: this.width,
          backgroundColor: this.backgroundColor
        }
      }
    }
  }
</script>
