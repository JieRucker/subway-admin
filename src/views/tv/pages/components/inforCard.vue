<style lang="scss">
  @include b(infor-card) {
    margin-bottom: 20px;
    @include e(head) {
      @include m(icon) {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        vertical-align: middle;
      }
      @include m(title) {
        color: #5530f6;
        font-size: 18px;
        vertical-align: middle;
      }
    }
  }
</style>

<template>
  <div class="infor-card">
    <div :class="headClasses" v-if="showHead">
      <slot name="title">
        <p>
          <img :src="titleSrc" class="infor-card__head--icon">
          <span class="infor-card__head--title">{{cardTitle}}</span>
        </p>
      </slot>
    </div>
    <div :class="bodyClasses">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  const prefixCls = 'info-card';

  export default {
    name: 'inforCard',
    props: {
      cardTitle: String,
      titleColor: String,
      titleSrc: {
        type: String,
        default: `${process.env.api.staticUrl}static/images/tv/title.png`,
      },
      showHead: {
        type: Boolean,
        default: true
      },
      iconSize: {
        type: Number,
        default: 40
      }
    },
    computed: {
      headClasses() {
        return `${prefixCls}__head`;
      },
      bodyClasses() {
        return `${prefixCls}__body`;
      }
    }
  };
</script>

