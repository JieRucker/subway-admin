<style lang="scss">
  @include b(device-list) {
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
  <div class="device-list">
    <div class="main">
      <div class="main__header clearfix">
        <div class="main__action">
          <Button type="primary" class="main__action--button" @click="_deleteBatch">批量删除
          </Button>
          <Button type="primary" class="main__action--button" @click="_addBatch">添加
          </Button>
          <Select v-model="formData.projectId" style="width:150px;margin-right: 10px"
                  @on-change="onChangeProject">
            <Option v-for="item in formData.projectList" :value="item.projectId" :key="item.value">
              {{item.projectName}}
            </Option>
          </Select>
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
  import deviceNature from "./modal/device-nature.vue";
  import deviceAddNature from "./modal/device-add-nature.vue";
  export default {
    name: "device-list",
    components: {
      deviceNature,deviceAddNature
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
              title: '设备名称',
              key: 'deviceName'
            },
            {
              title: '设备序号',
              key: 'sn'
            },
            {
              title: '设备类型',
              key: 'deviceType',
              render: (h, params) => {
                return h('span', {},this._userTypeName(params.row.deviceType))
              }
            },
            {
              title: '设备ip',
              key: 'databusIp'
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
                        this.currentModal = this.modalDialog['deviceNature'];
                      }
                    }
                  }, '编辑')
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
          projectId: '',
          projectList: [],
          profile: null // 单个用户数据
        },
        currentModal: '', // 当前Modal
        modalDialog: {
          deviceNature: 'Device-Nature',
          deviceAddNature: 'Device-Add-Nature'
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
    methods: {
      _userTypeName(v){
        switch(v){
          case 1: return '道闸进';
          case 2: return '道闸出';
          case 3: return '手持执法';
          case 4: return '员工录入';
          case 5: return '手持执法和员工录入';
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
          this.$api.deviceInterface.listDevice({
          projectId: this.formData.projectId,
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
          this.$refs.userTable.getSelection().forEach(m => a.push(m.faceDeviceId));
          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定删除？</p>',
            onOk: () => {
              this.$api.deviceInterface.removeDeviceList({
                deviceIdJsonArray: JSON.stringify(a)
              }).then(res => {
                res = res.data;
                if (res.success) {
                  this.$Message.info('删除成功！');
                  this._getUserList();
                }
              }).catch((err) => console.error(err))
            }
          });
        })() : this.$Message.info('请选择设备');
      },
      _addBatch() {
        this.formData.profile = {
          projectId: this.formData.projectId,
          deviceName: '',
          databusIp:'',
          deviceType: 0,
          sn:''
        };
        this.currentModal = this.modalDialog['deviceAddNature'];
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
