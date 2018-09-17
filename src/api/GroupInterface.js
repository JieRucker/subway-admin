import BaseModule from "./BaseModule";

class GroupInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 查询所有工种信息(分页)
  listGroup(data = {}) {
    return this.post(`/group/listGroup`, data)
  }

  // 修改工种名
  updateGroup(data = {}) {
    return this.post(`/group/updateGroup`, data)
  }

  // 删除工种
  removeGroupList(data = {}) {
    return this.post(`/group/removeGroupList`, data)
  }

  // 添加工种
  addGroup(data = {}) {
    return this.post(`/group/addGroup`, data)
  }
}

export default new GroupInterface()
