import BaseModule from "./BaseModule";

class UserInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  //添加管理员
  addAdmin(data = {}) {
    return this.post(`/user/addAdmin`, data)
  }

  // 查询所有员工信息(分页)
  listDbpageUser(data = {}) {
    return this.post(`/user/listDbpageUser`, data)
  }

  // 员工 - 修改
  updateUser(data = {}) {
    return this.post(`/user/updateUser`, data)
  }

  // 获取所有组
  listGroup() {
    return this.post(`/user/listGroup`)
  }

  // 删除用户
  deleteUser() {
    return this.post(`/user/deleteUser`)
  }

  // 导出员工Excel
  exportUserInfo(data = {}) {
    return this.post(`/user/exportUserInfo`, data)
  }

  // 查询职业
  getProfession() {
    return this.post(`/user/getProfession`)
  }

  // 删除员工
  removeUserList(data = {}) {
    return this.post(`/user/removeUserList`, data)
  }

  // 查询工程
  getProjectRelByUser() {
    return this.post(`/project/getProjectRelByUser`)
  }
  // 查询工程
  listProject(data = {}) {
    return this.post(`/user/getUserProjectList`, data)
  }

  getUserProjectList() {
    return this.post(`/user/getUserProjectList`)
  }

  getUser(data = {}) {
    return this.post(`/user/getUser`, data)
  }
  changeProject(data = {}) {
    return this.post(`/user/changeProject`, data)
  }

  // 查询所有员工类型数组
  getUserTypeList() {
    return this.post(`/user/getUserTypeList`)
  }

  // 更新用户关联项目
  updateUserProjectRel(data = {}) {
    return this.post(`/project/updateUserProjectRel`, data)
  }

  // 根据用户查工程
  getProjectRelByUser(data = {}) {
    return this.post(`/project/getProjectRelByUser`, data)
  }

  // 积分排名
  listUserByScore(data = {}) {
    return this.post(`/open/rank`, data)
  }

  // 大屏信息
  allModule(data = {}) {
    return this.post(`/open/allModule`, data)
  }

  // 查询工种及人数
  listTheDayProfessionCount(data = {}) {
    return this.post(`/face/listTheDayProfessionCount`, data)
  }

  // 天气
  getWeatherInfo(data = {}) {
    return this.post(`/open/getWeatherInfo`, data)
  }

  // 导出员工二维码到Base64
  exportQrcodeList(data = {}){
    return this.post(`/user/exportQrcodeList`, data)
  }

  //员工进出列表
  listInOut(data = {}){
    return this.post(`/face/listFaceCheckLog`, data)
  }

}

export default new UserInterface()
