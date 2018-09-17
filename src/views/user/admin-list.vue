<style lang="scss">
  @include b(user-list) {
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
  <div class="user-list">
    <div class="main">
      <div class="main__header clearfix">
        <div class="main__action">


          <Button type="primary" class="main__action--button" @click="_deleteBatch">批量删除
          </Button>
          <!--<Button type="primary" class="main__action&#45;&#45;button" @click="_addBatch">添加-->
          <!--</Button>-->

          <Select v-model="formData.projectId" style="width:150px;margin-right: 10px"
                  @on-change="onChangeProject">
            <Option v-for="item in formData.projectList" :value="item.projectId" :key="item.value">
              {{item.projectName}}
            </Option>
          </Select>
          <Input v-model="formData.userName" style="margin-right: 10px;width: 200px" placeholder="请输入管理员姓名">
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
        :profile="formData.profile"
        :currentModal.sync="currentModal"
      ></component>
      <!--</transition>-->
  </div>
</template>

<script>
  import adminNature from "./modal/admin-nature.vue";
  import adminAddNature from "./modal/admin-add-nature.vue";

  export default {
    name: "admin-list",
    components: {
      adminNature,adminAddNature
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
              title: '职位',
              key: 'userType',
              render: (h, params) => {
                return h('span', {},this._userTypeName(params.row.userType))
              }
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
                        Object.assign(this.formData.profile, { projectId: this.formData.projectId });
                        this.currentModal = this.modalDialog['adminNature'];
                      }
                    }
                  }, '编辑'),
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
          projectId: '',
          projectList: [],
          profile: null // 单个用户数据
        },
        currentModal: '', // 当前Modal
        modalDialog: {
          adminNature: 'Admin-Nature',
          adminAddNature: 'Admin-Add-Nature'
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
      this._listProject();
    },
    filters:{

    },
    methods: {
      _userTypeName(v){
        switch(v){
          case 3: return '安全员';
          case 4: return '兑换员';
        }
      },
      _listProject() {
        const promise = new Promise((resolve, reject) => {
          this.$api.userInterface.listProject({
            userId:userId
          }).then(res => {
            res = res.data;
            res.success ? resolve(res.data) : reject(res.retMsg);
          }).catch(err => console.error(err))
        });

        promise.then(resolve => {
          [...resolve].map(m => this.formData.projectList.push(m));
          if (this.formData.projectList.length) {
            this.formData.projectId = this.formData.projectList[0].projectId;
          }
          this._getUserList();
        }, reject => {
          console.error(reject);
        })
      },
      _getUserList() {
        this.table.body = [];
        this.$api.userInterface.listDbpageUser({
          userType: 34,
          projectId: this.formData.projectId,
          userName: this.formData.userName,
          startRow: this.table.args.startRow,
          pageSize: this.table.args.pageSize
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
console.log(a);
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
        })() : this.$Message.info('请选择管理员');
      },
      _addBatch() {
        this.formData.profile = {
          projectId: this.formData.projectId,
          userName: '',
          userType: 0,
          phoneNum:'',
          cardNo:''
        };
        this.currentModal = this.modalDialog['adminAddNature'];
      },
      onChangeProject(value) {
        this.formData.projectId = value;
        this._getUserList();
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
