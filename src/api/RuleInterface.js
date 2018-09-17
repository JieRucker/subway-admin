import BaseModule from "./BaseModule";

class RuleInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 查询所有规则信息(分页)
  listRule(data = {}) {
    return this.post(`/userScore/listUserScoreRule`, data)
  }

  // 修改规则名
  updateRule(data = {}) {
    return this.post(`/userScore/updateUserScoreRule`, data)
  }

  // 删除规则
  removeRuleList(data = {}) {
    return this.post(`/userScore/removeUserScoreRuleList`, data)
  }

  // 添加规则
  addRule(data = {}) {
    return this.post(`/userScore/addUserScoreRule`, data)
  }
}

export default new RuleInterface()
