<style lang="scss">
  @mixin overflow($line:1) {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: $line;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
  }

  @include b(user-card) {
    @include b(l-list) {
      @include e(item) {
        display: flex;
        color: #333;
        height: 115px;
        .index {
          width: 40px;
          text-align: left;
          font-size: 18px;
          align-self: center;
        }
        .avatar-img {
          align-self: center;
          .avatar {
            background: #ccc;
            text-align: center;
            width: 50px;
            height: 50px;
            border-radius: 50px;
            display: flex;
            justify-content: center;
            &--img {
              width: 100%;
              height: 100%;
              border-radius: 50px;
            }
            &--icon {
              font-size: 20px;
              color: #fff;
              align-self: center;
            }
          }
        }
        .info {
          align-self: center;
          width: 120px;
          text-align: center;
          p {
            font-size: 18px;
          }
          &--name {
            @include overflow()
          }
          &--number {
            @include overflow()
          }
        }
        .score {
          align-self: center;
          width: 30%;
          text-align: center;
          font-size: 18px;
        }
        .image {
          width: 40%;
          img {
            height: 100%;
            width: 100%;
            border-radius: 5px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="user-card">
    <ul class="l-list">
      <li class="l-list__item" v-for="(item,index) in list" :style="liStyles">
        <div class="index" v-if="showIndex">{{index + 1}}</div>
        <div class="avatar-img" v-if="showAvatar">
          <div class="avatar">
            <img :src="item.headUrl" class="avatar--img" v-if="item.headUrl && item.headUrl !== ''">
            <Icon type="person" class="avatar--icon" v-else></Icon>
          </div>
        </div>
        <div class="info" v-if="showInfo">
          <slot name="info" :item="item">
            <p class="info--name">{{item.userName}}</p>
            <p class="info--number">{{item.loginName}}</p>
          </slot>
        </div>
        <div class="score" v-if="showScore">
          <slot name="score" :item="item">
            {{item.userTotalScore}}分
          </slot>
        </div>
        <div class="image" v-if="showImage">
          <img :src="item.picUrl"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'userCard',
    props: {
      list: Array,
      showIndex: {
        type: Boolean,
        default: false
      },
      showAvatar: {
        type: Boolean,
        default: true
      },
      showInfo: {
        type: Boolean,
        default: true
      },
      showScore: {
        type: Boolean,
        default: true
      },
      showImage: {
        type: Boolean,
        default: false
      },
      liStyles: {
        type: Object,
        default: {}
      }
    }
  };
</script>

