<style lang="scss">
  @include b(relate-list) {
    height: 100%;

    @include b(main) {
      @include e(header) {
        line-height: 32px;
        margin-bottom: 10px;
        @include b(main__action) {
          display: flex;
          float: left;
          @include m(button) {
            margin-right: 10px;
          }
        }
      }

      @include e(section) {
        background: #fff;
        @include b(table) {
          position: relative;
          padding: 10px;
        }
      }
    }
  }
</style>

<template>
  <div class="relate-list">
    <div class="main">
      <div class="main__header clearfix">
        <div class="main__action">
          <Button type="primary" class="main__action--button" @click="_deleteBatch">批量删除
          </Button>
          <Input v-model="formData.userName" style="margin-right: 10px" placeholder="请输入员工姓名">
          <Button slot="append" icon="ios-search" @click.native="_handleSearch"></Button>
          </Input>
        </div>
      </div>
      <div class="main__section clearfix">
        <div class="table">
          <Table :columns="table.header" ref="userTable" :data="table.body"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="table.args.totalCount"
                    :current="table.args.currentPage"
                    :page-size="table.args.pageSize"
                    show-total @on-change="updatePage"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="component-fade" mode="out-in">
      <component
        v-bind:is="currentComponent"
        :tis="tis"
        :qrcodeUrl="formData.qrcodeUrl"
        :profile="formData.profile"
        :currentModal.sync="currentModal"
      ></component>
    </transition>
  </div>
</template>

<script>
  import relateNature from "./modal/relate-nature.vue";

  export default {
    name: "relate-list",
    components: {
      relateNature
    },
    data() {
      return {
        table: {
          header: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '头像',
              key: 'headUrl',
              align: 'left',
              render: (h, params) => {
                return h('Avatar', {
                  attrs: {
                    icon: 'person',
                    src: params.row.headUrl
                  },
                  props: {
                    size: 'default'
                  },
                  nativeOn: {
                    click: (e) => {
                      console.log(e)
                    }
                  }
                })
              }
            },
            {
              title: '姓名',
              key: 'userName'
            },
            {
              title: '工号',
              key: 'loginName'
            },
            {
              title: '身份证号',
              key: 'cardNo'
            },
            {
              title: '工种',
              key: 'groupName'
            },
            {
              title: '手机号',
              key: 'phoneNum'
            },
            {
              title: '操作',
              key: 'action',
              width: 140,
              render: (h, params) => {
                return h('div', [
                  h('a', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.formData.profile = params.row;
                        // this.formData.profile.userId = params.row.userId;
                        this.currentModal = this.modalDialog['relateNature'];
                      }
                    }
                  }, '关联')
                ]);
              }
            }
          ],
          body: [],
          args: {
            startRow: 0, // 当前行
            pageSize: 15, // 一页行数
            currentPage: 1, // 默认页
            totalCount: 0 // 总条数
          }
        },
        formData: {
          userName: '', // 搜索条件
          qrcodeUrl: '', // 二维码地址
          profile: null // 单个用户数据
        },
        currentModal: '', // 当前Modal
        modalDialog: {
          relateNature: 'Relate-Nature'
        }
      }
    },
    computed: {
      currentComponent() {
        return this.currentModal.toLowerCase()
      },
      tis() {
        return this
      }
    },
    mounted() {
      this._getUserList();
    },
    methods: {
      _getUserList() {
        this.table.body = [];
        this.$api.userInterface.listDbpageUser({
          userName: this.formData.userName,
          startRow: this.table.args.startRow,
          pageSize: this.table.args.pageSize,
          userType: 5,
        }).then(res => {
          res = res.data;
          if (res.success) {
            this.table.args.totalCount = res.data.count;
            this.table.body = (() => {
              let arr = [];
              [...res.data.dbPageList].map(m => arr.push(m));
              return arr;
            })();
          }
        }).catch(err => console.error(err))
      },
      _deleteBatch() {
        this.$refs.userTable.getSelection().length ? (() => {
          let a = [];
          this.$refs.userTable.getSelection().forEach(m => a.push(m.userId));

          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定删除？</p>',
            onOk: () => {
              this.$api.userInterface.removeUserList({
                userIdJsonArray: JSON.stringify(a)
              }).then(res => {
                res = res.data;
                if (res.success) {
                  this.$Message.info('删除成功！');
                  this._getUserList();
                }
              }).catch((err) => console.error(err))
            }
          });
        })() : this.$Message.info('请选择用户');
      },
      _handleSearch() {
        this._getUserList()
      },
      updatePage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.startRow = (targetPage - 1) * this.table.args.pageSize;
        this._getUserList();
      }
    }
  }
</script>
