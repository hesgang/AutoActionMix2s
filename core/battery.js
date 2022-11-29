
let WigtAct = require('../utils/wigt_action.js')
let act_name = "com.wisorg.wisedu.common.BrowsePageActivity"
let sendEmail = require("../utils/SendEmail.js")
let {config} = require('../config.js')(runtime, this)
let WeworkPush = require("../utils/message_template.js")

let PushWeChat = require("../utils/PushServer.js")
var wx = new PushWeChat(config.push_key);

function run_bat(){
    this.huawei_WiFi = function(){
        app.launchPackage('com.huawei.smarthome');
        var a = text("华为5G随行WiFi Pro").findOne(10000);
        sleep(2000)
        WigtAct.click_wigt(a);
        var b = id("mbb_device_battery_percent").findOne(10000);
        var _battery = b.text();
        var num = parseFloat(_battery);
        log(`当前电量为：${num}`)

        if(num <= 20){
            try{
                wigt = this.mi_home();
                wigt.click();
                sleep(5000);
                if(wigt.child(0).desc() == "已开启"){
                    send_m = WeworkPush.send_msg("markdown", {'content':`当前WiFi电量为：<font color=\"info\">${num}%</font> 
                    开始充电！`}, 'HeShengGang');
                    log(send_m)
                }
                else{
                    wx.send(`！！！！当前电量为：${num}，开关失败了！！！`);
                }
            }catch(e){
                wx.send(`！！！！当前电量为：${num}`, `问题为：${e}`);
            }
        }

        if(num >= 90){
            try{
                wigt = this.mi_home();
                wigt.click();
                sleep(2000);
                if(wigt.child(0).desc() == "已关闭"){
                    send_m = WeworkPush.send_msg("markdown", {'content':`当前WiFi电量为：<font color=\"info\">${num}%</font> 
                    充电完成！`}, 'HeShengGang');
                    log(send_m)
                    wx.send(`当前电量为：${num}`);
                }
                else{
                    wx.send(`！！！！当前电量为：${num}，开关失败了！！！`);
                }
            }catch(e){
                wx.send(`！！！！当前电量为：${num}`, `问题为：${e}`);
            }
        }
        sleep(2000);
        WigtAct.clean_back()
    }

    this.mi_home = function(){
        app.launchPackage('com.xiaomi.smarthome');
        sleep(5000);
        text("插排").waitFor();
        a = text("插排").findOne(10000).parent();
        sleep(2000);
        for(var i = 0; i < a.childCount(); i++){
            var child = a.child(i);
            if(child.className() == 'android.widget.FrameLayout'){

                return child
                // log()
                // sleep(1000);
                // child.click();
                // sleep(1000);
                // log(child.child(0).desc())
            }
        }
    }
}


module.exports = new run_bat()