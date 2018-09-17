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


          <Select v-model="formData.projectId" style="width:150px;margin-left: 10px;margin-right: 10px"
                  @on-change="onChangeProject">
            <Option v-for="item in formData.projectList" :value="item.projectId" :key="item.value">
              {{item.projectName}}
            </Option>
          </Select>

          <DatePicker ref="time" v-model="time" type="date" format="yyyy-MM-dd" placeholder="请选择日期"
                      style="width:150px;margin-right: 10px" @on-change="changeTime()"></DatePicker>

          <Select v-model="state" placeholder="请选择状态" style="width:120px;margin-right: 10px">
            <Option v-for="item in stateList" :value="item.value" :key="item.value">
              {{item.label}}
            </Option>
          </Select>

          <Input v-model="pin" placeholder="请输入工号" style="width: 120px;margin-right: 10px"/>

          <Button type="primary" class="main__action--button" @click="_getUserList">查询
          </Button>

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

  </div>
</template>

<script>


  export default {
    name: "inOut-list",
    components: {},
    data() {
      return {
        time: this._today(),
        pin: '',
        state: 1,
        stateList: [{
          label: '进',
          value: 1
        },
          {
            label: '出',
            value: 2
          }],
        table: {
          header: [
            {
              title: '姓名',
              key: 'userName'
            },
            {
              title: '工号',
              key: 'pin'
            },
            {
              title: '进出',
              key: 'state',
              render: (h, params) => {
                return h('span', {}, this._userTypeName(params.row.state))
              }
            },
            {
              title: '时间',
              key: 'date',
            },
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
      }
    },
    computed: {},
    mounted() {
      let today = new Date();
      this.time = today.getFullYear()+"-" + (today.getMonth()+1) + "-" + today.getDate();
      this._listProject();
    },
    filters: {},
    methods: {
      _userTypeName(v) {
        switch (v) {
          case 1:
            return '进';
          case 2:
            return '出';
        }
      },
      changeTime() {
        this.time = this.$refs.time.publicStringValue;
      },
      _today(){
        let today = new Date();
        return today.getFullYear()+"-" + (today.getMonth()+1) + "-" + today.getDate();
      },
      _listProject() {
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
            this._getUserList();
          }
        }, reject => {
          console.error(reject);
        })
      },
      _getUserList() {
        if(typeof this.time === 'undefined'|| this.time === ''|| this.time === {}){
          let today = new Date();
          this.time = today.getFullYear()+"-" + (today.getMonth()+1) + "-" + today.getDate();
        }
        let a = {
          projectId: this.formData.projectId,
          time: this.time,
          pin: this.pin,
          state: this.state,
        }
        this.table.body = [];
        this.$api.userInterface.listInOut(a).then(res => {
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


      onChangeProject(value) {
        this.formData.projectId = value;
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
