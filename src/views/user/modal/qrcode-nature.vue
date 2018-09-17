<style lang="scss">
  @include b(new-qrcode-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      text-align: center;
      @include e(form) {
        .ivu-form-item {
          margin-bottom: 15px;
        }
      }
      @include e(group) {
        @include m(name) {
          font-size: 14px;
          font-weight: 700;
        }
        @include b(l-list) {
          margin-top: 10px;
          padding: 10px;
          background-color: #f2f2f2;
          @include e(item) {
            float: left;
            margin-right: 10px;
            margin-bottom: 10px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <Modal ref="modal" v-model="show" width="350" class="new-qrcode-modal" @on-visible-change="onVisibleChange">
    <p slot="header" class="header">
      <span class="header--title">二维码</span>
    </p>
    <div class="body">
      <img :src="initial.qrcodeUrl" style="width: 300px;height: 300px">
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "qrcode-nature",
    data() {
      return {
        show: true,
        initial: new Object(null),
      }
    },
    props: {
      currentModal: String,
      qrcodeUrl: String
    },
    mounted() {
      let param = {
        qrcodeUrl: this.qrcodeUrl
      };
      new ToolFunctor(this)._get(param);
    },
    methods: {
      onVisibleChange(value) {
        return value || this.$emit('update:currentModal', this.$Global.setBlank());
      }
    }
  }

  class ToolFunctor {
    constructor(tis) {
      if (!tis) {
        throw new Error('[SKETCHPAD]: Missing parameters (tis)');
      }

      this.tis = typeof(tis) !== 'undefined' ? tis : null;
    }

    equal(fn) {
      return (...args) => {
        return fn.apply(this, args);
      }
    }

    _get(res) {
      let target = new Object(null);
      target.qrcodeUrl = res.qrcodeUrl;

      return this.tis.initial = target;
    }
  }
</script>
