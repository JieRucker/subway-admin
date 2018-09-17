<style lang="scss">
  @include b(user-nature) {
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
  <Modal ref="modal" v-model="show" width="500" class="user-nature" :mask-closable="false"
         @on-visible-change="onVisibleChange">
    <p slot="header" class="header">
      <span class="header--title">添加加分计划</span>
    </p>
    <div class="body">
      <div class="body__form body__basic">
        <Form label-position="left">

          <FormItem label="描述：" :label-width="80">
            <Input v-model="initial.operateDesc" placeholder="请输入描述" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="周期：" :label-width="80">
            <Input v-model="initial.cycle" placeholder="请输入周期" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="积分：" :label-width="80">
            <Input v-model="initial.score" placeholder="请输入积分" style="width: 200px"></Input>
          </FormItem>

          <FormItem label="类型：" :label-width="80">
            <Select v-model="profile.dealType" placeholder="请选择类型" style="width:110px">
              <Option v-for="option in initial.dealTypeList" :value="option.value"
                      :key="option.value">
                {{option.label}}
              </Option>
            </Select>
          </FormItem>

        </Form>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click.native="show = false">取消</Button>
      <Button type="primary" size="large" @click.native="_save">确定</Button>
    </div>
  </Modal>
</template>

<script>
  import addressPicker from '@/components/addressPicker/addressPicker.vue';

  export default {
    name: "plan-add-nature",
    components: {
      addressPicker
    },
    data() {
      return {
        show: true,
        initial: new Object(null),
        provinceList: [],
        cityList: [],
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
      _save(){
        if (!new ToolFunctor(this)._valid()) return;
        let param = new ToolFunctor(this)._set();
        param.dealType = this.profile.dealType;
        // console.log(param);
        if (param.dealType === '' || param.dealType === null) {
          this.tis.$Message.info('请选择加分计划类型');
          return false;
        }
        this.$api.planInterface.addPlan(param)
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
      Object.keys(res).forEach(k => (target[`${k}`] = res[k]));
      target.dealTypeList = this._JSON().dealTypeList;
      return this.tis.initial = target;
    }

    _JSON() {
      let dealTypeList = [
        {
          label: '第一进程',
          value: 1
        },
        {
          label: '第二进程',
          value: 2
        },
        {
          label: '第三进程',
          value: 3
        }
      ];
      return {
        dealTypeList,
      }
    }

    _valid() {
      let valid, params, toastMSG;
      valid = true;
      params = ['operateDesc','cycle','score'];
      toastMSG = ['请输入加分计划描述','请输入加分计划周期','请输入加分计划积分'];
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
      let filter = ['dealTypeList'];
      Object.keys(initial).forEach(k => filter.map(m => (k === m && delete initial[k])));

      DEFAULTS = initial;
      target = Object.assign({}, DEFAULTS, source);
      return target;
    }
  }
</script>
