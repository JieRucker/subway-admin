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
          <Button type="primary" class="main__action--button" @click="_exportAll">全量导出
          </Button>
          <Button type="primary" class="main__action--button" @click="_exportBatch">批量导出
          </Button>
          <Button type="primary" class="main__action--button" @click="_deleteBatch">批量删除
          </Button>
          <Button type="primary" class="main__action--button" @click="_printBatch({type:1})">批量打印
          </Button>
          <Select v-model="formData.projectId" style="width:150px;margin-right: 10px"
                  @on-change="onChangeProject">
            <Option v-for="item in formData.projectList" :value="item.projectId" :key="item.value">
              {{item.projectName}}
            </Option>
          </Select>
          <Input v-model="formData.userName" style="margin-right: 10px;width: 200px" placeholder="请输入员工姓名">
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
  import userNature from "./modal/user-nature.vue";
  import qrcodeNature from "./modal/qrcode-nature.vue";

  export default {
    name: "user-list",
    components: {
      userNature,
      qrcodeNature
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
                        this.formData.profile.score = params.row.userRemainScore;
                        Object.assign(this.formData.profile, {projectId: this.formData.projectId});
                        console.log(this.formData.profile);
                        this.currentModal = this.modalDialog['userNature'];
                      }
                    }
                  }, '编辑'),
                  h('span', {
                    style: {
                      marginLeft: '5px',
                      marginRight: '5px',
                      color: '#999'
                    },
                  }, '|'),
                  h('a', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this._exportUserInfo(JSON.stringify([`${params.row.userId}`]))
                      }
                    }
                  }, '导出'),
                  h('span', {
                    style: {
                      marginLeft: '5px',
                      marginRight: '5px',
                      color: '#999'
                    },
                  }, '|'),
                  h('a', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this._printBatch({type: 0, userId: params.row.userId});
                      }
                    }
                  }, '打印'),
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
          projectId: '',
          projectList: [],
          profile: null // 单个用户数据
        },
        currentModal: '', // 当前Modal
        modalDialog: {
          userNature: 'User-Nature',
          qrcodeNature: 'Qrcode-Nature'
        }
      }
    },
    computed: {
      currentComponent() {
        /**
         * 当前显示的组件
         */
        return this.currentModal.toLowerCase()
      },
      tis() {
        return this
      }
    },
    mounted() {
      this._listProject();
    },
    methods: {
      _listProject() {
        /**
         * 获取工程列表
         */
        const promise = new Promise((resolve, reject) => {
          this.$api.userInterface.listProject({
            userId: userId
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
        /**
         * 获取用户列表
         */
        this.table.body = [];
        this.$api.userInterface.listDbpageUser({
          projectId: this.formData.projectId,
          userName: this.formData.userName,
          startRow: this.table.args.startRow,
          pageSize: this.table.args.pageSize,
          userType: 1,
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
      _exportUserInfo(userIdList) {
        /**
         * 导出用户列表Excel
         */
        let url = `${process.env.api.commonUrl}/user/exportUserInfo`;
        let form = document.createElement('form');
        let input = document.createElement('input');
        let input2 = document.createElement('input');
        let formTable = document.querySelector('#formTable');
        input.setAttribute('name', 'userIdList');
        input2.setAttribute('name', 'projectId');
        input.value = userIdList;
        input2.value = this.formData.projectId;
        form.id = 'formTable';
        form.style.display = 'none';
        form.setAttribute('method', 'post');
        form.setAttribute('action', url);
        form.appendChild(input);
        form.appendChild(input2);
        document.body.appendChild(form);
        form.submit();
        formTable && formTable.remove();
      },
      _exportAll() {
        /**
         * 导出全部
         */
        this._exportUserInfo(null);
      },
      _exportBatch() {
        /**
         * 批量导出
         */
        this.$refs.userTable.getSelection().length ? (() => {
          let a = [];
          this.$refs.userTable.getSelection().forEach(m => a.push(m.userId));

          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定导出？</p>',
            onOk: () => {
              this._exportUserInfo(JSON.stringify(a));
            }
          });
        })() : this.$Message.info('请选择用户');
      },
      _deleteBatch() {
        /**
         * 批量删除
         */
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
      _printBatch(param) {
        /**
         * 打印员工二维码
         * type:0 单个打印
         * type:1 批量打印
         */
        let type = param.type;

        switch (type) {
          case 0:
            this.$Modal.confirm({
              title: '提示',
              content: '<p>确定打印？</p>',
              onOk: () => {
                this.$api.userInterface.exportQrcodeList({
                  userIdJsonArray: JSON.stringify([`${param.userId}`])
                }).then(res => {
                  res = res.data;
                  if (res.success) {
                    let url = 'data:image/jpeg;base64,' + res.data[0];
                    let printHtml = `<img src="${url}" style="height: 220px;width: 170px;">`;
                    let printWindow = window.open("", 'newwindow', 'height=500, width=700, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
                    printWindow.document.querySelector('body').style.margin = '0';
                    printWindow.document.body.innerHTML = printHtml;
                    setTimeout(() => {
                      printWindow.print();
                    }, 1000);

                  }
                }).catch((err) => console.error(err))
              }
            });
            break;
          case 1:
            this.$refs.userTable.getSelection().length ? (() => {
              let a = [];
              this.$refs.userTable.getSelection().forEach(m => a.push(m.userId));
              this.$Modal.confirm({
                title: '提示',
                content: '<p>确定打印？</p>',
                onOk: () => {
                  this.$api.userInterface.exportQrcodeList({
                    userIdJsonArray: JSON.stringify(a)
                  }).then(res => {
                    res = res.data;
                    if (res.success) {

                      let printHtml = document.createElement('div');
                      let printWindow = window.open("", 'newwindow', 'height=500, width=700, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
                      [...res.data].forEach(m => {
                        let src = 'data:image/jpeg;base64,' + m;
                        let img = document.createElement('img');
                        img.src = src;
                        img.style.height = '220px';
                        img.style.width = '170px';
                        img.style.display = 'block';
                        printHtml.appendChild(img);
                      });

                      this.$Global.timeout(600).then(() => {
                        printWindow.document.querySelector('body').style.margin = '0';
                        printWindow.document.body.appendChild(printHtml);
                        printWindow.print();
                      });
                    }
                  }).catch((err) => console.error(err))
                }
              });
            })() : this.$Message.info('请选择用户');
            break;
        }
      },
      onChangeProject(value) {
        /**
         * 切换工程Event
         */
        this.formData.projectId = value;
        this._getUserList();
      },
      _handleSearch() {
        /**
         * 搜索Event
         */
        this._getUserList()
      },
      updatePage(targetPage) {
        /**
         * 分页切换
         */
        this.table.args.currentPage = targetPage;
        this.table.args.startRow = (targetPage - 1) * this.table.args.pageSize;
        this._getUserList();
      }
    }
  }
</script>
