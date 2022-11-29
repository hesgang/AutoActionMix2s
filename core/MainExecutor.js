/*
 * @Author: hesgang
 * @Date: 2022年3月18日
 * @Last Modified by: hesgang
 * @Last Modified time: 2022年3月18日
 * @Description: 主函数逻辑
 */

// let daily_sign = require('./cpdaily.js')
// let battery = require('./battery.js')
// let elm = require('./elm.js')

function mainLoop () {
  elm.Executor();
}


function MainExecutor() {

  this.exec = function () {
    // 执行主要业务逻辑
    mainLoop();
    
  }
}
module.exports = new MainExecutor()