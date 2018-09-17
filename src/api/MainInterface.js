import BaseModule from "./BaseModule";

class MainInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 登出
  loginOut(data = {}) {
    return this.post(`/loginOut`, data)
  }

  // 获取uploadId
  createUploadId(data = {}) {
    return this.post(`/common/createUploadId`, data)
  }

  // 查询省
  listProvince(){
    return this.post(`/user/listProvince`)
  }

  // 查询市
  listCity(data = {}){
    return this.post(`/user/listCity`, data)
  }

  // 查询区
  listCounty(data = {}){
    return this.post(`/user/listCounty`, data)
  }
}

export default new MainInterface()
