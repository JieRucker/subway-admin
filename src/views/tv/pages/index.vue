<style lang="scss">
  @mixin overflow($line:1) {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: $line;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
  }

  @include b(tv-container) {
    padding-top: 10px;
    @include b(head) {
      @include e(hand) {
        padding-left: 20px;
        @include m(img) {
          vertical-align: middle;
        }
      }
      @include e(title) {
        text-align: left;
        p {
          color: #5530f6;
          font-size: 28px;
          text-align: center;
        }
      }
      @include e(tool) {
        @include m(img) {
          vertical-align: middle;
          width: 16px;
          height: 16px;
        }
        @include m(style) {
          margin-left: 10px;
          font-size: 18px;
          color: #333;
          vertical-align: middle;
        }
      }
    }
    @include b(section) {
      margin-top: 30px;
      @include b(left) {
        padding-left: 3%;
      }
      @include b(middle) {
        padding-left: 3%;
        padding-right: 3%;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        @include b(desc) {
          margin-top: 10px;
          color: #666;
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          display: -webkit-box;
        }
      }
      @include b(right) {
        padding-left: 20px;
        padding-right: 20px;
        @include b(l-list) {
          @include e(item) {
            color: #333;
            font-size: 18px;
            margin-bottom: 10px;
            @include m(name) {
              float: left;
            }
            @include m(value) {
              float: right;
            }
          }
          @include e(last) {
            color: #5530f6;
            font-size: 18px;
            @include m(name) {
              float: left;
              @include overflow();
            }
            @include m(value) {
              float: right;
            }
          }
        }
      }
    }

    .welcome-wrap {
      overflow: hidden;
      height: 30px;
      width: 200px;
      font-size: 22px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
      color: #5530f6;
      ul.item {
        width: 200px;
        li {
          float: left;
          margin-right: 10px;
        }
      }
    }
  }
</style>

<template>
  <div class="tv-container" :style="bgStyle">
    <Row class="head">
      <Col span="8" class="head__hand" style="width: 30%">
        <span v-if="!newsList.length">&nbsp;</span>
        <div v-if="newsList.length" style="margin-top: 5px">
          <img :src="handclap" class="head__hand--img" style="width: 30px;height: 30px"/>
          <seamless-scroll :data="newsList" :class-option="{step: 0.5,direction: 2,limitMoveNum: 2,autoPlay: true}"
                           class="welcome-wrap">
            <ul class="item">
              <li class="head__hand--name" v-for="item in newsList" v-text="item.title"></li>
            </ul>
          </seamless-scroll>
        </div>
      </Col>
      <Col span="8" class="head__title" style="width: 40%">
        <p>{{projectName}}</p>
      </Col>
      <Col span="8" class="head__tool" style="width:28%;text-align: right;">
        <div>
          <img class="head__tool--img" :src="weather"/>
          <span class="head__tool--style">{{currentWeather}}</span>
        </div>
        <div>
          <img class="head__tool--img" :src="date"/>
          <span class="head__tool--style">{{currentTime}}</span>
        </div>
      </Col>
    </Row>
    <Row class="section">
      <Col span="8" class="left" style="width: 30%">
        <infor-card
          card-title="积分排名">
          <seamless-scroll :data="integralScrollList" :class-option="{step: 1,limitMoveNum: 5}"
                           style="overflow: hidden;height: 715px;width: 100%;position: relative">
            <user-card
              :list="integralList"
              show-index="true" :liStyles="{'height':'70px'}">
            </user-card>
          </seamless-scroll>
        </infor-card>
      </Col>
      <Col span="8" class="middle" style="width: 50%">
        <Row class="score">
          <infor-card
            card-title="加减分记录">
            <p class="desc">描述：{{userScoreOperate.operateDesc}}</p>
            <user-card
              :list="normalUserList" show-image="true">
              <template slot="score" slot-scope="props">
                <span style="color: #f00" v-if="userScoreOperate.operateType === 1">加分：{{userScoreOperate.score}}</span>
                <span style="color: #f00" v-if="userScoreOperate.operateType === 2">减分：{{userScoreOperate.score}}</span>
              </template>
            </user-card>
          </infor-card>
        </Row>
        <Row class="divide">
          <divide></divide>
        </Row>
        <Row class="exchange" style="margin-top: 20px;">
          <infor-card
            card-title="兑换记录">
            <user-card
              :list="exchangeList" show-image="true">
              <template slot="score" slot-scope="props">
                <span style="color: #f00">兑换：{{props.item.score}}</span>
              </template>
            </user-card>
          </infor-card>
        </Row>
      </Col>
      <Col span="8" class="right" style="width: 20%">

        <infor-card
          card-title="工种">
          <div style="margin-top: 20px;">
            <seamless-scroll
              :data="professionScrollList"
              :class-option="{step: 0.4,limitMoveNum: 10}"
              style="overflow: hidden;height: 350px;width: 100%;position: relative">
              <ul class="l-list">
                <li class="l-list__item clearfix" v-for="item in professionList">
                  <p class="l-list__item--name">{{item.name}}：</p>
                  <p class="l-list__item--value">{{item.value}}人</p>
                </li>
              </ul>
            </seamless-scroll>
          </div>
          <!--<ul class="l-list" style="position: fixed;bottom: 10px;">-->
          <ul class="l-list">
            <li class="l-list__last clearfix">
              <p class="l-list__item--name">总计：</p>
              <p class="l-list__item--value">{{totalCount}}人</p>
            </li>
          </ul>
        </infor-card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import seamlessScroll from './components/seamlessScroll';
  import inforCard from "./components/inforCard.vue";
  import userCard from "./components/userCard";
  import divide from "./components/divide";

  export default {
    components: {
      seamlessScroll,
      userCard,
      inforCard,
      divide
    },
    data() {
      return {
        integralScrollList: [],
        professionScrollList: [],
        integralList: [],
        userScoreOperate: {}, // 积分
        normalUserList: [],
        exchangeList: [], // 兑换记录
        professionList: [], // 工种
        newsList: [], // 进场消息提示
        currentWeather: null, // 当前天气
        currentTime: new GetTime().current(), // 当前时间
        totalCount: 0, // 总工种人数
        args: {
          startRow: 0,
          pageSize: 10,
          hasMore: false
        }
      };
    },
    computed: {
      projectName() {
        return !this.$Global.isBlank(projectName) ? projectName : ''
      },
      bgStyle() {
        return {
          backgroundImage: `url(${process.env.api.staticUrl}static/images/tv/banner.png)`,
          backgroundSize: 'cover',
          height: '100%'
        }
      },
      handclap() {
        return `${process.env.api.staticUrl}static/images/tv/handclap.png`
      },
      date() {
        return `${process.env.api.staticUrl}static/images/tv/date.png`
      }
    },
    mounted() {
      this.getInit();
    },
    beforeDestroy() {
      // 清除定时器
      this.timer && clearInterval(this.timer);
      this.integralTimer && clearInterval(this.integralTimer);
      this.getAllModuleTimer && clearInterval(this.getAllModuleTimer);
      this.getWeatherTimer && clearInterval(this.getWeatherTimer);
    },
    methods: {
      getInit() {
        this.getCurrentTime();// 获取当前时间
        this.getWeather(); // 获取天气
        this.getWeatherTimer = setInterval(() => {
          this.getWeather();
        }, 3600000);

        this._getUserByScore(); // 获取积分排名
        this.loopIntegralList(); // 轮询积分排名

        this._getAllModule(); // 查询加减分、兑换记录
        this.getAllModuleTimer = setInterval(() => {
          this._getAllModule(); // 查询加减分、兑换记录
        }, 60000);

        this._getProfession(); // 查询工种

        /*this.newsList = [{
          title:'热烈欢迎 某某进入'
        },{
          title:'热烈欢迎 某某进入'
        }]*/

        const initMessage = () => {
          this.$Global.JMessage.startJMessage({
            username: !this.$Global.isBlank(jpushUser) ? jpushUser : `project_${this.$Global.queryUrl('p')}_${this.$Global.queryUrl('t')}`,
            password: '1qaz2wsx',
            callback: (res) => {
              let text = res.messages[0].content.msg_body.text;
              let json = JSON.parse(text);
              let map = json.map;
              let userName = json.userName;
              let totalCount = json.totalCount;

              if (userName) {
                this.newsList = (() => {
                  let a = [];
                  for (let i = 0, len = 1; i <= len; i++) {
                    a.push({
                      title: `${userName}`
                    })
                  }
                  return a;
                })();
              }

              this.professionList = (() => {
                let a = [];
                Object.keys(map).forEach(key => {
                  a.push({
                    name: key,
                    value: map[key]
                  });
                });
                return a;
              })();

              this.totalCount = totalCount;

              this.$Global.timeout(30000).then(() => {
                this.newsList.length && (this.newsList = []);
              });

              console.log(res)
            }
          });
        };

        if (!this.$Global.isBlank(projectName)) {
          this.$Global.JMessage.initJIM();
          initMessage();
          JIM.onDisconnect(() => {
            initMessage();
          });
        }
      },
      _getAllModule() {
        this.normalUserList = [];
        this.exchangeList = [];
        this.$api.userInterface.allModule({
          projectId: !this.$Global.isBlank(projectId) ? projectId : ''
        }).then(res => {
          res = res.data;
          if (res.success) {
            let operateRecordVO = res.data.operateRecordVO;
            let exchangeRecordVO = res.data.exchangeRecordVO;

            // 描述
            this.userScoreOperate = operateRecordVO.userScoreOperate;

            // 加减分记录
            if (operateRecordVO) {
              this.normalUserList.push({
                groupName: operateRecordVO.normalUser[0].groupName,
                headUrl: operateRecordVO.normalUser[0].headUrl,
                loginName: operateRecordVO.normalUser[0].loginName,
                userName: operateRecordVO.normalUser[0].userName,
                picUrl: operateRecordVO.userScoreOperate.userPicURL[0]
              });
            }

            // 兑换记录
            if (exchangeRecordVO) {
              this.exchangeList.push({
                groupName: exchangeRecordVO.normalUserGroupName,
                headUrl: exchangeRecordVO.normalUserHeadUrl,
                loginName: exchangeRecordVO.normalUserLoginName,
                userName: exchangeRecordVO.normalUserName,
                score: exchangeRecordVO.exchangeScore,
                picUrl: exchangeRecordVO.userPicURL
              })
            }


          }
        }).catch(err => console.error(err));
      },
      _getUserByScore() {
        this.$api.userInterface.listUserByScore({
          projectId: !this.$Global.isBlank(projectId) ? projectId : '',
          startRow: this.args.startRow,
          pageSize: this.args.pageSize
        }).then(res => {
          res = res.data;
          if (res.success) {
            this.args.hasMore = res.data.hasMore;
            [...res.data.dbPageList].map(m => this.integralList.push(m));
            this.integralScrollList = this.integralList;
            this.args.startRow += this.args.pageSize
          }
        }).catch(err => console.error(err));
      },
      _getProfession() {
        this.$api.userInterface.listTheDayProfessionCount({
          projectId: !this.$Global.isBlank(projectId) ? projectId : ''
        }).then(res => {
          res = res.data;
          if (res.success) {
            this.professionList = (() => {
              let a = [];
              let map = res.data.map;
              Object.keys(map).forEach(key => {
                a.push({
                  name: key,
                  value: map[key]
                });
              });
              return a;
            })();

            this.professionScrollList = this.professionList;
            this.totalCount = res.data.totalCount
          }
        }).catch(err => console.error(err));
      },
      // 获取积分排名
      loopIntegralList() {
        this.integralTimer = setInterval(() => {
          if (!this.args.hasMore) {
            this.integralTimer && clearInterval(this.integralTimer)
          } else {
            this._getUserByScore();
          }
        }, 10000)
      },
      // 获取当前时间
      getCurrentTime() {
        this.timer = setInterval(() => this.currentTime = new GetTime().current(), 500);
      },
      // 获取天气
      getWeather() {
        this.$api.userInterface.getWeatherInfo({
          projectId: !this.$Global.isBlank(projectId) ? projectId : ''
        }).then(res => {
          res = res.data;
          if (res.success) {
            this.currentWeather = `${res.data['weather']} ${res.data['wd']}${res.data['ws']} ${res.data['temp']}`;
            this.weather = `${res.data.weatherPicUrl}`
          }
        }).catch(err => console.error(err));
      }
    }
  };

  class GetTime {
    constructor() {
      //获取当前时间
      this.date = new Date();
      this.getFullYear = this.date.getFullYear();
      this.getMonth = this.date.getMonth() < 10 ? "0" + (this.date.getMonth() + 1) : (this.date.getMonth() + 1);
      this.getDate = this.date.getDate() < 10 ? "0" + (this.date.getDate()) : (this.date.getDate());
      this.getHours = this.date.getHours() < 10 ? "0" + this.date.getHours() : this.date.getHours();
      this.getMinutes = this.date.getMinutes() < 10 ? "0" + this.date.getMinutes() : this.date.getMinutes();
      this.getSeconds = this.date.getSeconds() < 10 ? "0" + this.date.getSeconds() : this.date.getSeconds();
    }

    stringValue() {
      return {
        getFullYear: this.getFullYear,
        getMonth: this.getMonth,
        getDate: this.getDate,
        getHours: this.getHours,
        getMinutes: this.getMinutes,
        getSeconds: this.getSeconds
      }
    }

    current() {
      return `${this.getFullYear}-${this.getMonth}-${this.getDate} ${this.getHours}:${this.getMinutes}:${this.getSeconds}`
    }
  }
</script>
