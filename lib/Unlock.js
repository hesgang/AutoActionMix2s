/*
 * @Author: Hesgang
 * @Date: 2022-11-29 14:52:54
 * @Last Modified by: Hesgang
 * @Last Modified time: 2022-11-29 14:53:05
 * @Description: 
 */

let { config: _config, storageName: _storageName } = require('../config.js')(runtime, global)





function Unlocker () {
  const _km = context.getSystemService(context.KEYGUARD_SERVICE)

  this.relock = false
  this.reTry = 0

  // 设备是否锁屏
  this.is_locked = function () {
    return _km.inKeyguardRestrictedInputMode()
  }

  // 设备是否加密
  this.is_passwd = function () {
    return _km.isKeyguardSecure()
  }

  // 解锁失败
  this.failed = function () {
    automator.back()
    this.reTry++
    if (this.reTry > 3) {
      console.log('解锁失败达到三次，停止运行')
      _config.resetBrightness && _config.resetBrightness()
      _runningQueueDispatcher.removeRunningTask()
      this.saveNeedRelock(true)
      exit()
    } else {
      let sleepMs = 5000 * this.reTry
      console.log('解锁失败，' + sleepMs + 'ms之后重试')
      sleep(sleepMs)
      this.run_unlock()
    }
  }

  // 检测是否解锁成功
  this.check_unlock = function () {
    sleep(1000)
    if (
      textContains('重新').exists() ||
      textContains('重试').exists() ||
      textContains('错误').exists()
    ) {
      console.log('密码错误')
      return false
    }
    return !this.is_locked()
  }

  // 唤醒设备
  this.wakeup = function () {
    let limit = 3
    while (!device.isScreenOn() && limit-- > 0) {
      device.wakeUp()
      sleep(1000)
    }
    if (!device.isScreenOn()) {
      console.warn('isScreenOn判定失效，无法确认是否已亮屏。直接尝试后续解锁操作')
    }
  }

  /**
   * 当闹钟响铃时暂停
   */
  this.suspendOnAlarm = function () {
    if (_config.suspend_on_alarm_clock) {
      let alarmContent = _widgetUtils.widgetGetOne(_config.suspend_alarm_content || '滑动关闭闹钟', 1000, true, true)
      if (alarmContent) {
        warnInfo(['闹钟响铃中，暂停脚本 text: {}', alarmContent.content], true)
        _config.forceStop = true
        _commonFunctions.setUpAutoStart(5)
        if (this.relock && _config.auto_set_brightness) {
          console.log('设置显示亮度为最低，关闭自动亮度')
          // 重新打开自动亮度
          device.setBrightnessMode(1)
        }
        exit()
      } else {
        debugInfo('未找到关闭闹钟控件信息')
      }
    }
  }

  // 划开图层
  this.swipe_layer = function () {
    let x = parseInt(_config.device_width * 0.2)
    gesture(320, [x, parseInt(_config.device_height * 0.8)], [x, parseInt(_config.device_height * 0.3)])
    sleep(_config.timeout_unlock)
  }

  // 执行解锁操作
  this.run_unlock = function () {
    // 如果已经解锁则返回
    if (!this.is_locked()) {
      console.log('已解锁')
      return true
    }

    // 首先点亮屏幕
    this.wakeup()
    // 打开滑动层
    this.swipe_layer()
    // 如果有锁屏密码则输入密码
    // if (this.is_passwd() && !this.unlock(_config.password)) {
    //   // 如果解锁失败
    //   this.failed()
    // }
  }

  this.saveNeedRelock = function (notRelock) {
    this.relock = this.relock || this.getRelockInfo()
    if (notRelock || _config.notNeedRelock) {
      this.relock = false
    }
    let storage = storages.create(_storageName)
    debugInfo('保存是否需要重新锁屏：' + this.relock)
    storage.put('needRelock', JSON.stringify({ needRelock: this.relock, timeout: new Date().getTime() + 30000 }))
  }

  this.getRelockInfo = function () {
    let storage = storages.create(_storageName)
    let needRelock = storage.get('needRelock')
    if (needRelock) {
      needRelock = JSON.parse(needRelock)
      if (needRelock && new Date().getTime() <= needRelock.timeout) {
        return needRelock.needRelock
      }
    }
    return false
  }
}

const _unlocker = new Unlocker()
module.exports = {
  exec: function () {
    _unlocker.reTry = 0
    _unlocker.run_unlock()
    // if (!_unlocker.relock) {
    //   let skipped = false
    //   // 未锁定屏幕情况下，判断是否在白名单中
    //   do {
    //     skipped = _commonFunctions.delayStartIfInSkipPackage()
    //     // 跳过了，需要重新执行解锁操作
    //     skipped && _unlocker.run_unlock()
    //   } while (skipped && !_unlocker.relock)
    // }
  }
  // needRelock: function () {
  //   console.log('是否需要重新锁定屏幕：' + _unlocker.relock)
  //   return _unlocker.relock
  // },
  // saveNeedRelock: function (notRelock) {
  //   _unlocker.saveNeedRelock(notRelock)
  // },
  // unlocker: _unlocker
}

