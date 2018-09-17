import BaseModule from "./BaseModule";

class DeviceInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 查询所有班组信息(分页)
  listDevice(data = {}) {
    return this.post(`/device/listDevice`, data)
  }

  // 修改班组名
  updateDevice(data = {}) {
    return this.post(`/device/updateDevice`, data)
  }

  // 删除设备
  removeDeviceList(data = {}) {
    return this.post(`/device/removeDeviceList`, data)
  }

  // 添加设备
  addDevice(data = {}) {
    return this.post(`/device/saveDevice`, data)
  }
}

export default new DeviceInterface()
