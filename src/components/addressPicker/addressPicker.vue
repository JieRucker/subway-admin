<style lang="scss">
  @include b(address-picker) {
    display: inline-block;
  }
</style>

<template>
  <div class="address-picker">
    <FormItem label="省份" :label-width="provinceLabel" v-if="showProvince">
      <Select v-model="province" placeholder="请选择" @on-change="changeProvince"
              style="width:150px">
        <Option v-for="item in provinceList" :value="item.value" :key="item.value">
          {{item.label}}
        </Option>
      </Select>
    </FormItem>
    <FormItem label="市" :label-width="cityLabel" v-if="showCity">
      <Select v-model="city" placeholder="请选择" @on-change="changeCity"
              style="width:150px">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{item.label}}
        </Option>
      </Select>
    </FormItem>
    <FormItem label="区" :label-width="countyLabel" v-if="showCounty">
      <Select v-model="county" placeholder="请选择" style="width:150px">
        <Option v-for="item in countyList" :value="item.value" :key="item.value">{{item.label}}
        </Option>
      </Select>
    </FormItem>
  </div>
</template>

<script>
  export default {
    name: "addressPicker",
    props: {
      isInitRender: {
        type: Boolean,
        default: true
      },
      provinceLabel: {
        type: Number,
        default: 40
      },
      cityLabel: {
        type: Number,
        default: 40
      },
      countyLabel: {
        type: Number,
        default: 40
      },
      showProvince: {
        type: Boolean,
        default: true
      },
      showCity: {
        type: Boolean,
        default: true
      },
      showCounty: {
        type: Boolean,
        default: true
      },
      province: {
        type: String,
        default: ''
      },
      city: {
        type: String,
        default: ''
      },
      county: {
        type: String,
        default: ''
      },
      provinceList: Array,
      cityList: Array,
      countyList: Array,
    },
    methods: {
      changeProvince(value) {
        this.$emit('change-province', value);
      },
      changeCity(value) {
        this.$emit('change-city', value);
      }
    }
  }
</script>

