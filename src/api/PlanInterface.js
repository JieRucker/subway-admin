import BaseModule from "./BaseModule";

class PlanInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 查询所有加分计划信息(分页)
  listPlan(data = {}) {
    return this.post(`/face/listUserAutoScoreRuleCfg`, data)
  }

  // 修改加分计划名
  updatePlan(data = {}) {
    return this.post(`/face/ModifyUserAutoScoreRuleCfg`, data)
  }

  // 删除加分计划
  removePlanList(data = {}) {
    return this.post(`/face/deleteUserAutoScoreRuleCfg`, data)
  }

  // 添加加分计划
  addPlan(data = {}) {
    return this.post(`/face/addUserAutoScoreRuleCfg`, data)
  }
}

export default new PlanInterface()
