<style lang="scss">
  @include b(new-relate-modal) {
    @include b(header) {
      color: #333;
      text-align: center;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      @include e(form) {
        border: 1px solid #e9eaec;
        padding: 0 30px;
        position: relative;
        @include m(title) {
          position: absolute;
          width: 80px;
          font-size: 16px;
          top: -16px;
          left: -93px;
          background-color: #fff;
          text-align: center;
        }
        .ivu-form-item {
          margin-bottom: 15px;
        }
      }

      @include e(info) {
        margin-top: 15px;
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
  <Modal ref="modal" v-model="show" width="600" class="new-relate-modal" :mask-closable="false"
         @on-visible-change="onVisibleChange">
    <p slot="header" class="header">
      <span class="header--title">关联</span>
    </p>
    <div class="body">
      <div class="body__group">
        <p class="body__group--name">关联项目：</p>
        <ul class="l-list clearfix">
          <li class="l-list__item" v-for="(item,index) in initial.projectList">
            <Checkbox v-model="item.selected">&nbsp;{{item.projectName}}</Checkbox>
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click.native="show = false">取消</Button>
      <Button type="primary" size="large" @click.native="_saveUserModal">确定</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "relate-nature",
    data() {
      return {
        show: true,
        initial: new Object(null)
      }
    },
    props: {
      tis: null,
      profile: Object,
      currentModal: String,
    },
    mounted() {
      new ToolFunctor(this)._get(this.profile);
    },
    methods: {
      _saveUserModal() {
        let param = new ToolFunctor(this)._set();

        this.$api.userInterface.updateUserProjectRel(param)
          .then(res => {
            res = res.data;
            if (res.success) {
              this.$Message.info('成功');
              this.show = false;
              this.tis._getUserList();
            } else {
              this.$Message.error(res.retMsg)
            }
          }).catch(err => console.error(err));
      },
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

      target.projectList = (() => {
        let a = [];
        this.tis.$api.userInterface.getProjectRelByUser({
          userId: this.tis.profile.userId
        }).then(res => {
          res = res.data;
          if (res.success) {
            [...res.data.allProjectVOList].map(m => {
              m.selected = false;
              [...res.data.projectVOList].map(k => (m.projectId === k.projectId) && (m.selected = true));
              a.push(m)
            });
          }
        }).catch(err => console.error(err));

        return a;
      })();

      return this.tis.initial = target;
    }

    _set() {
      let DEFAULTS, target;
      let source = new Object(null);
      const initial = {...this.tis.initial};

      source.userId = this.tis.profile.userId;
      source.projectIdJsonArray = (() => {
        let a = [];
        [...this.tis.initial.projectList].map(m => (m.selected) && a.push(m.projectId));
        return JSON.stringify(a);
      })();

      let filter = ['projectList'];
      Object.keys(initial).forEach(k => filter.map(m => (k === m && delete initial[k])));

      DEFAULTS = initial;
      target = Object.assign({}, DEFAULTS, source);
      return target;
    }
  }
</script>
