import BaseModule from "./BaseModule";

class ScreenInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 查询所有屏幕信息(分页)
  listScreen(data = {}) {
    return this.post(`/face/listTvScreen`, data)
  }

  // 修改屏幕名
  updateScreen(data = {}) {
    return this.post(`/face/ModifyTvScreen`, data)
  }

  // 删除屏幕
  removeScreenList(data = {}) {
    return this.post(`/face/deleteTvScreen`, data)
  }

  // 添加屏幕
  addScreen(data = {}) {
    return this.post(`/face/addTvScreen`, data)
  }
}

export default new ScreenInterface()
