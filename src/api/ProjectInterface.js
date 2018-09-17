import BaseModule from "./BaseModule";

class ProjectInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 查询所有项目信息(分页)
  listProject(data = {}) {
    return this.post(`/project/listProject`, data)
  }

  // 修改项目名
  updateProject(data = {}) {
    return this.post(`/project/updateProject`, data)
  }

  // 删除项目
  removeProjectList(data = {}) {
    return this.post(`/project/removeProjectList`, data)
  }

  // 添加项目
  saveProject(data = {}) {
    return this.post(`/project/saveProject`, data)
  }

}

export default new ProjectInterface()
