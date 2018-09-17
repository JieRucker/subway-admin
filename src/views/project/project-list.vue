<style lang="scss">
  @include b(project-list) {
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
  <div class="project-list">
    <div class="main">
      <div class="main__header clearfix">
        <div class="main__action">
          <Button type="primary" class="main__action--button" @click="_deleteBatch">批量删除
          </Button>
          <Button type="primary" class="main__action--button" @click="_addBatch">添加
          </Button>
          <Input v-model="formData.projectName" style="margin-right: 10px" placeholder="请输入项目名称">
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
    </transition>
  </div>
</template>

<script>
  import projectNature from "./modal/project-nature.vue";
  import projectAddNature from "./modal/project-add-nature.vue";

  export default {
    name: "project-list",
    components: {
      projectNature,projectAddNature
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
              title: '项目名称',
              key: 'projectName'
            },
            {
              title: '项目描述',
              key: 'projectDesc'
            },
            {
              title: '城市编号',
              key: 'weatherCityId'
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
                        this.currentModal = this.modalDialog['projectNature'];
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
          projectName: '', // 搜索条件
          profile: null // 单个用户数据
        },
        currentModal: '', // 当前Modal
        modalDialog: {
          projectNature: 'Project-Nature',
          projectAddNature:'Project-Add-Nature'
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
        this.$api.projectInterface.listProject({
          projectName: this.formData.projectName,
          startRow: this.table.args.startRow,
          pageSize: this.table.args.pageSize,
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
          this.$refs.userTable.getSelection().forEach(m => a.push(m.projectId));

          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定删除？</p>',
            onOk: () => {
              this.$api.projectInterface.removeProjectList({
                projectIdJsonArray: JSON.stringify(a)
              }).then(res => {
                res = res.data;
                if (res.success) {
                  this.$Message.info('删除成功！');
                  this._getUserList();
                }
              }).catch((err) => console.error(err))
            }
          });
        })() : this.$Message.info('请选择项目');
      },
      _addBatch() {
        this.formData.profile = {
          projectName: '',
          projectDesc: '',
          weatherCityId:'',
        };
        this.currentModal = this.modalDialog['projectAddNature'];
      },
      _handleSearch() {
        this._getUserList();
      },
      updatePage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.startRow = (targetPage - 1) * this.table.args.pageSize;
        this._getUserList();
      }
    }
  }
</script>
