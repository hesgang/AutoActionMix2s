/*
 * @Author: hesgang
 * @Last Modified by: hesgang
 * @Last Modified time: 2022-11-29 14:39:55
 * @Description: 自动任务
 */

let { config } = require('./config.js')(runtime, this)
let unlocker = require('./lib/Unlock.js')

let mainExecutor = require('./core/MainExecutor.js')
/***********************
 * 初始化
 * 本手机权限一切正常，暂时不添加前置校验情况
 ***********************/
// 检查手机是否开启无障碍服务



 /***********************
 * 解锁
 ***********************/
try {
  unlocker.exec()
  console.log('解锁成功')
} catch (e) {
  console.log(e)
}

 /***********************
 * 执行主程序
 ***********************/
// if (config.develop_mode) {
//     mainExecutor.exec()
//   } else {
//     try {
//       mainExecutor.exec()
//     } catch (e) {
//       commonFunctions.setUpAutoStart(1)
//       errorInfo('执行异常, 1分钟后重新开始' + e)
//       commonFunctions.printExceptionStack(e)
//     }
//   }
