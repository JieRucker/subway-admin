<style lang="scss">
  @include b(device-nature) {
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
  <Modal ref="modal" v-model="show" width="500" class="device-nature" :mask-closable="false"
         @on-visible-change="onVisibleChange">
    <p slot="header" class="header">
      <span class="header--title">编辑设备</span>
    </p>
    <div class="body">
      <div class="body__form body__basic">
        <Form label-position="left">

          <FormItem label="设备名称：" :label-width="80">
            <Input v-model="initial.deviceName" placeholder="请输入设备名称" style="width: 200px"></Input>
          </FormItem>

          <FormItem label="设备类型：" :label-width="80">
            <div class="body__group">
              <ul class="l-list clearfix">

                <li class="l-list__item" v-for="(item,index) in initial.deviceTypeList">
                  <RadioGroup v-model="profile.deviceType">
                    <Radio :label="item.deviceType">{{item.deviceTypeName}}</Radio>
                  </RadioGroup>

                </li>
              </ul>
            </div>
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
    name: "device-nature",
    components: {
      addressPicker
    },
    data() {
      return {
        show: true,
        initial: new Object(null),
        provinceList: [],
        cityList: []
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
      _save() {

        console.log(this.profile);

        if (!new ToolFunctor(this)._valid()) return;
        let param = new ToolFunctor(this)._set();
        param.deviceType = this.profile.deviceType;
        console.log(param);
        this.$api.deviceInterface.updateDevice(param)
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
      target.deviceTypeList = this._JSON().deviceTypeList;

      return this.tis.initial = target;
    }

    _JSON() {
      let deviceTypeList = [
        {
          deviceTypeName: '1道闸进',
          deviceType: 1
        },
        {
          deviceTypeName: '2道闸出',
          deviceType: 2
        },
        {
          deviceTypeName: '3手持执法',
          deviceType: 3
        },
        {
          deviceTypeName: '4员工录入',
          deviceType: 4
        },
        {
          deviceTypeName: '5手持执法和员工录入',
          deviceType: 5
        },

      ];

      return {
        deviceTypeList
      }
    }

    _valid() {
      let valid, params, toastMSG;
      valid = true;
      params = ['deviceName'];
      toastMSG = ['请输入设备名称'];
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

      let filter = ['deviceTypeList'];
      Object.keys(initial).forEach(k => filter.map(m => (k === m && delete initial[k])));

      DEFAULTS = initial;
      target = Object.assign({}, DEFAULTS, source);
      return target;
    }
  }
</script>
