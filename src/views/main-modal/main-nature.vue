<style lang="scss">
  @include b(new-user-modal) {
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
  <Modal ref="modal" v-model="show" width="600" class="new-user-modal" :mask-closable="false"
         @on-visible-change="onVisibleChange">
    <p slot="header" class="header">
      <span class="header--title">切换项目</span>
    </p>
    <div class="body">
      <div class="body__form body__basic">
        <Form label-position="left">

          <FormItem label="项目：" :label-width="80">
            <Select v-model="initial.projectId" placeholder="请选择项目" style="width:200px">
              <Option v-for="option in initial.projectList" :value="option.projectId"
                      :key="option.projectId">
                {{option.projectName}}
              </Option>
            </Select>
          </FormItem>

        </Form>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click.native="show = false">取消</Button>
      <Button type="primary" size="large" @click.native="_saveUserModal">确定</Button>
    </div>
  </Modal>
</template>

<script>
  // import addressPicker from '@/components/addressPicker/addressPicker.vue';

  export default {
    name: "main-nature",
    components: {
      // addressPicker
    },
    data() {
      return {
        show: true,
        initial: new Object(null),
        projectList:[],
      }
    },
    props: {
      tis: null,
      profile: Object,
      currentModal: String,
    },
    mounted(){
      this.projectList = [];
      const promise = new Promise((resolve, reject) => {
        this.$api.userInterface.getUserProjectList().then(res => {
          res = res.data;
          res.success ? resolve(res.data) : reject(res.retMsg);
        }).catch(err => console.error(err))
      });

      promise.then(resolve => {
        [...resolve].map(m => this.projectList.push(m));
        console.log(this.projectList);
        new ToolFunctor(this)._get(this.projectList);
      }, reject => {
        console.error(reject);
      });

    },
    methods: {
      _saveUserModal() {
        if (!new ToolFunctor(this)._valid()) return;
        let param = new ToolFunctor(this)._set();
console.log(param);

        this.$Modal.confirm({
          title: '提示',
          content: '<h3>确定更改当前管理员当前所在项目？</h3>',
          onOk: () => {
            this.$api.userInterface.changeProject(param)
              .then(res => {
                res = res.data;
                if (res.success) {
                  this.$Message.info('成功');
                  this.show = false;
                  this.tis.init();
                } else {
                  this.$Message.error(res.retMsg);
                }
              }).catch(err => console.error(err));
          }
        });

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
      // Object.keys(res).forEach(k => (target[`${k}`] = res[k]));
      target.projectList = res;
      console.log(target);
      return this.tis.initial = target;

    }

    // _JSON() {
    //   let projectList = [
    //     {
    //       label: '加分',
    //       value: 1
    //     },
    //     {
    //       label: '减分',
    //       value: 2
    //     }
    //   ];
    //
    //   return {
    //     projectList,
    //   }
    // }

    _valid() {
      let valid, params, toastMSG;
      valid = true;
      params = ['projectId'];
      toastMSG = ['请选择项目'];
      this.tis.$Global.fore7(params, (m, i) => {
        if (this.tis.initial[`${m}`] === '' || this.tis.initial[`${m}`] === null) {
          valid = false;
          this.tis.$Message.info(`${toastMSG[i]}`);
          return false
        }
      });

      return valid
    }

    _set() {
      let DEFAULTS, target;
      let source = new Object(null);
      const initial = {...this.tis.initial};

      console.log('initial:');
      console.log(initial);
      let filter = ['projectList'];
      Object.keys(initial).forEach(k => filter.map(m => (k === m && delete initial[k])));

      DEFAULTS = initial;
      target = Object.assign({}, DEFAULTS, source);
      return target;
    }
  }
</script>
