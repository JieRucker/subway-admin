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
      <span class="header--title">编辑管理员</span>
    </p>
    <div class="body">
      <div class="body__form body__basic">
        <Form label-position="left">
          <FormItem label="姓名：" :label-width="80">
            <Input v-model="initial.userName" placeholder="请输入姓名" style="width: 200px"></Input>
          </FormItem>

          <FormItem label="职位：" :label-width="80">
            <Select v-model="initial.userType" placeholder="请选择职位" style="width:110px">
              <Option v-for="option in initial.userTypeList" :value="option.value"
                      :key="option.value">
                {{option.label}}
              </Option>
            </Select>
          </FormItem>

          <FormItem label="手机号：" :label-width="80">
            <Input v-model="initial.phoneNum" placeholder="请输入手机号" style="width: 200px"></Input>
          </FormItem>

          <FormItem label="身份证号：" :label-width="80">
            <Input v-model="initial.cardNo" placeholder="请输入身份证号" style="width: 200px"></Input>
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
  import addressPicker from '@/components/addressPicker/addressPicker.vue';

  export default {
    name: "admin-nature",
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
      _saveUserModal() {
        if (!new ToolFunctor(this)._valid()) return;
        let param = new ToolFunctor(this)._set();
console.log(param);
        this.$api.userInterface.updateUser(param)
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
      target.professionList = (() => {
        let a = [];
        this.tis.$api.userInterface.getProfession()
          .then(res => {
            res = res.data;
            if (res.success) [...res.data].forEach(m => a.push({
              label: m.professionName,
              value: parseInt(m.professoinId)
            }))
          }).catch(err => console.error(err));
        return a;
      })();
      target.userTypeList = (() => {
        let a = [];
        this.tis.$api.userInterface.getUserTypeList()
          .then(res => {
            res = res.data;
            if (res.success) [...res.data].forEach(m => a.push({
              label: m.userTypeName,
              value: parseInt(m.userTypeId)
            }))
          }).catch(err => console.error(err));
        return a;
      })();
      target.userTypeList = this._JSON().userTypeList;
      target.groupList = (() => {
        let a = [];
        this.tis.$api.userInterface.listGroup()
          .then(res => {
            if (res.data.success) [...res.data.data].forEach(m => a.push({label: m.groupName, value: m.groupId}))
          }).catch(err => console.error(err));
        return a;
      })();

      return this.tis.initial = target;
    }

    _JSON() {
      let userTypeList = [
        {
          label: '安全员',
          value: 3
        },
        {
          label: '兑换员',
          value: 4
        }
      ];

      return {
        userTypeList,
      }
    }

    _valid() {
      let valid, params, toastMSG;
      valid = true;
      params = ['userName', 'userType', 'phoneNum', 'cardNo' ];
      toastMSG = ['请输入姓名', '请选择职位', '请输入手机号', '请输入身份证号'];
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
      let filter = ['_index','_rowKey','birthday','groupId','cityId','joinTime','loginName','score','provinceId','sex','userRemainScore','userExchangeScore','userTotalScore','userTypeList','professionList', 'groupList', 'cardType', 'createDate', 'groupName', 'headUrl'];
      Object.keys(initial).forEach(k => filter.map(m => (k === m && delete initial[k])));

      DEFAULTS = initial;
      target = Object.assign({}, DEFAULTS, source);
      return target;
    }
  }
</script>
