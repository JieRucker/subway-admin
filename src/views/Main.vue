<style lang="scss">
  @import "./main.scss";
</style>
<template>
  <div class="main-container" :class="{'main-hide-text': shrink}">
    <div class="main-container__sidebar" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
      <shrinkable-menu
        :shrink="shrink"
        @on-change="handleSubmenuChange"
        :theme="menuTheme"
        :before-push="beforePush"
        :open-names="openedSubmenuArr"
        :menu-list="menuList">
        <div slot="top" class="main-container__logo">
                    <span class="main-container__logo--shrink" v-show="!shrink">
                        <!--<img src="../assets/images/logo/logo-min.png" key="max-logo"/>-->
                        <h3>{{getLogoName}}</h3>
                    </span>
          <span class="main-container__logo--shrink-min" v-show="shrink">
                        <img v-show="shrink" src="../assets/images/logo/logo-min.png" key="min-logo"/>
                    </span>
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-container__shrink" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-container__header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                  @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-container__breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>

        <!--新添加-->
        <div class="header-middle-project" v-if="showHeaderMiddleProject">
          <span>当前所在项目：</span>
          <span>{{currentProject.projectName}}&emsp;</span>
          <a type="primary" size="small" @click="onChangeProject">切换项目</a>
          <!--<Select v-model="currentProjectId" style="width:180px;margin-left: 10px"-->
          <!--@on-change="onChangeProject">-->
          <!--<Option v-for="item in projectList" :value="item.projectId" :key="item.value">-->
          <!--{{item.projectName}}-->
          <!--</Option>-->
          <!--</Select>-->
        </div>

        <div class="header-avator-con">
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <theme-switch></theme-switch>

          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{getLoginName}}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="loginout" @click.native="loginOut">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar :src="getAvator" icon="person" style="background: #619fe7;margin-left: 10px;"></Avatar>
            </Row>
          </div>
        </div>
      </div>
    </div>
    <div class="main-container__single" :style="{left: shrink?'60px':'200px'}">
      <div class="main-container__single-page">
        <!--<keep-alive :include="cachePage">-->
        <router-view></router-view>
        <!--</keep-alive>-->
      </div>
    </div>

    <transition name="component-fade" mode="out-in">
      <component
        v-bind:is="currentComponent"
        :tis="tis"
        :profile="currentProject"
        :currentModal.sync="currentModal"
      ></component>
  </div>
</template>
<script>
  import Vue from 'vue';
  import shrinkableMenu from '@/components/shrinkable-menu/shrinkable-menu.vue';
  import breadcrumbNav from '@/components/breadcrumb/breadcrumb-nav.vue';
  import fullScreen from '@/components/full-screen/fullscreen.vue';
  import themeSwitch from '@/components/theme-switch/theme-switch.vue';
  import util from '@/libs/util.js';
  import VueI18n from 'vue-i18n';

  import MainNature from "./main-modal/main-nature.vue";
  Vue.use(VueI18n);

  export default {
    components: {
      shrinkableMenu,
      breadcrumbNav,
      fullScreen,
      themeSwitch,MainNature
    },
    data() {
      return {
        showHeaderMiddleProject: false,
        projectList: [],
        currentProject:{
          projectId: '',
          projectName: '',
        },
        shrink: false,
        isFullScreen: false,
        openedSubmenuArr: this.$store.state.app.openedSubmenuArr,

        currentModal: '', // 当前Modal
        modalDialog: {
          MainNature: 'Main-Nature',
        }

      };
    },
    computed: {
      currentComponent() {
        return this.currentModal.toLowerCase()
      },
      tis() {
        return this
      },
      getLogoName() {
        return '积分管理系统'
      },
      getLoginName() {
        return (typeof getStrLoginName !== 'undefined') ? getStrLoginName : '';
      },
      getAvator() {
        return (typeof getStrHeadUrl !== 'undefined') ? getStrHeadUrl : '';
      },
      menuList() {
        return this.$store.state.app.menuList;
      },
      pageTagsList() {
        return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
      },
      currentPath() {
        return this.$store.state.app.currentPath; // 当前面包屑数组
      },
      cachePage() {
        return this.$store.state.app.cachePage;
      },
      lang() {
        return this.$store.state.app.lang;
      },
      menuTheme() {
        return this.$store.state.app.menuTheme;
      }
    },
    mounted() {
      this.init();

    },
    methods: {

      onChangeProject(value) {
        // this.formData.profile = params.row;
        this.currentModal = this.modalDialog['MainNature'];
        //
        // this.$api.userInterface.changeProject({
        //   // projectId:
      // }).then(res => {
      //   res = res.data;
      //   if (res.success) {
      //     this.currentProjectId = res.data;
      //     this.projectList.push(this.currentProjectId);
      //   } else {
      //     console.error(res.retMsg);
      //   }
      //   ;
      // }).catch(err => console.error(err);
      // this.currentProjectId = value;
    },
      //_listProject()
      _listProject: function () {
        this.projectList = [];

        this.$api.userInterface.getUser({
          userId: userId
        }).then(res => {
          res = res.data;
          if (res.success) {
            typeof res.data.projectName !== 'undefined' ? this.currentProject.projectName = res.data.projectName : this.currentProject.projectName = '无默认项目';
          } else {
            console.error(res.retMsg);
          }
          ;
        }).catch(err => console.error(err))




      },
      init() {
        let pathArr = util.setCurrentPath(this, this.$route.name);
        this.$store.commit('updateMenulist');

        if (pathArr.length >= 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name);
        }
        this.checkTag(this.$route.name);

        if (userType === 5) {
          this.showHeaderMiddleProject = true;
          this._listProject();
        }
      },
      toggleClick() {
        this.shrink = !this.shrink;
      },
      checkTag(name) {
        let openpageHasTag = this.pageTagsList.some(item => {
          if (item.name === name) {
            return true;
          }
        });
        if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
          util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
        }
      },
      handleSubmenuChange(val) {
        // console.log(val)
      },
      beforePush(name) {
        // if (name === 'accesstest_index') {
        //     return false;
        // } else {
        //     return true;
        // }
        return true;
      },
      fullscreenChange(isFullScreen) {
        // console.log(isFullScreen);
      },
      loginOut() {
        this.$api.mainInterface.loginOut()
          .then(res => {
            if (res.data.success) {
              this.$Message.info('登出成功！');
              window.location.href = `${process.env.api.authUrl}/login/turnToLogin`;
            } else {
              this.$Message.info(res.data.retMsg);
            }
          }).catch(err => {
          console.error(err)
        })
      }
    },
    watch: {
      '$route'(to) {
        this.$store.commit('setCurrentPageName', to.name);
        let pathArr = util.setCurrentPath(this, to.name);

        if (pathArr.length > 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name);
        }
        this.checkTag(to.name);
        localStorage.currentPageName = to.name;
      },
      lang() {
        util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
      }
    },
    created() {
      // 显示打开的页面的列表
      this.$store.commit('setOpenedList');
    },
  };
</script>
