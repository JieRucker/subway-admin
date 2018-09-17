const build = {
  staticUrl: 'http://subway.westlakevr.cn:88/', // 静态资源路径
  commonUrl: 'http://subway.qimiaowa.com:88',
  authUrl: 'http://subway.qimiaowa.com:88',
  ngrok: 'http://subway.qimiaowa.com:88',
  node_env: 'prod'
};
const build_dev = {
  staticUrl: 'http://subway.westlakevr.cn:8005/', // 静态资源路径
  commonUrl: 'http://subway.qimiaowa.com:8005',
  authUrl: 'http://subway.qimiaowa.com:8005',
  ngrok: 'http://jrucker.ngrok.qimiaowa.com',
  node_env: 'prod_dev'
};

module.exports = {build, build_dev};
