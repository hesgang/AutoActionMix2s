/*
 * @Author: TonyJiangWJ
 * @Date: 2019-12-09 20:42:08
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-12-26 11:56:26
 * @Description: 
 */
let currentEngine = engines.myEngine().getSource() + ''
let isRunningMode = currentEngine.endsWith('/config.js') && typeof module === 'undefined'
let is_pro = !!Object.prototype.toString.call(com.stardust.autojs.core.timing.TimedTask.Companion).match(/Java(Class|Object)/)
let default_config = {
  //我的信息
  password: '',

  timeout_unlock: 1000,
  timeout_findOne: 1000,
  timeout_existing: 8000,

  device_width: device.width,
  device_height: device.height,
  // 是否是AutoJS Pro  需要屏蔽部分功能，暂时无法实现：生命周期监听等 包括通话监听
  is_pro: is_pro

}
// 不同项目需要设置不同的storageName，不然会导致配置信息混乱
let CONFIG_STORAGE_NAME = 'AutoAction_MIX2s'
let PROJECT_NAME = 'auto_script'
let config = {
  // TODO:
  push_key: "",
  // TODO： 补全企业微信信息
  corpid: "",
  corpsecret: ""
}
let storageConfig = storages.create(CONFIG_STORAGE_NAME)
let securityFields = ['password', 'alipay_lock_password']
let AesUtil = require('./lib/AesUtil.js')
let aesKey = device.getAndroidId()
Object.keys(default_config).forEach(key => {
  let storedVal = storageConfig.get(key)
  if (typeof storedVal !== 'undefined') {
    if (securityFields.indexOf(key) > -1) {
      storedVal = AesUtil.decrypt(storedVal, aesKey) || storedVal
    }
    config[key] = storedVal
  } else {
    config[key] = default_config[key]
  }
})


if (!isRunningMode) {
  module.exports = function (__runtime__, scope) {
    if (typeof scope.config_instance === 'undefined') {
      scope.config_instance = {
        config: config,
        default_config: default_config,
        storage_name: CONFIG_STORAGE_NAME,
        securityFields: securityFields,
        project_name: PROJECT_NAME
      }
    }
    return scope.config_instance
  }
} else {
  setTimeout(function () {
    engines.execScriptFile(files.cwd() + "/可视化配置.js", { path: files.cwd() })
  }, 30)
}
