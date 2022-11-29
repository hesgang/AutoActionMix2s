let WigtAct = require('../utils/wigt_action.js')
let act_name = "com.wisorg.wisedu.common.BrowsePageActivity"
let sendEmail = require("../utils/SendEmail.js")
let {config} = require('../config.js')(runtime, this)

let PushWeChat = require("../utils/PushServer.js")
var wx = new PushWeChat(config.push_key);


function push_message(_flag){
    if (_flag == 'ok'){
        wx.send('今日校园填写完成！', ' ');
    } else {
        wx.send('今日校园签到失败！', '未检测到完成打卡标志，请及时检测并记录存在的问题。  \n截图已保存！');
    }
}

function save_img(_flag){
    if(!requestScreenCapture()){
        toast("请求截图失败");
        exit();
    }
    if(_flag){
        sleep(1000);
        captureScreen("/sdcard/img.png");
        push_message('ok');
        sendEmail();
    }else{
        sleep(1000);
        captureScreen("/sdcard/img.png");
        push_message('err');
        sendEmail();
    }
    
    
}

function in_cpdaily(){
    var a = null;
    // 打开软件
    app.launchPackage('com.wisedu.cpdaily');
    a = text('信息收集').findOne(10000);
    if(a != null){
        // 进入信息收集界面
        wigt = WigtAct.clickable_parent(a, 5);
        wigt.click();
    }else {
        // 信息收集界面进入失败，再尝试一次
        WigtAct.clean_back();
        app.launchPackage('com.wisedu.cpdaily');
        a = text('信息收集').findOne(10000);
        if(a != null){
            // 进入信息收集界面
            wigt = WigtAct.clickable_parent(a, 5);
            wigt.click();
        }else {
            save_img(false);
        }
    }
}

function sign_cpdaily(times){  
    text("重要收集").waitFor();
    log('准备点击');
    sleep(2000);
    let a = text("未填写 >").findOne(2000);
    if(text("未填写 >").exists()){
        WigtAct.clickable_parent(a, 5).click();
        let c = className("android.widget.CheckBox").depth(14).findOne();
        c.click();
        sleep(2000);
        text('提交').depth(14).findOne().click();
        // 用于弹窗确认点击
        sleep(2000);
        text('提交').depth(12).findOne().click();
        text("提交成功").waitFor();
        // back();
        var i = 1;
        while(true){
            i++;
            sleep(200);
            if(i%50 == 0){
                back();
            }
            if(text("正在进行").exists()){
                break;
            }
        }
    }
    if(text("已填写 >").exists()){
        save_img(true);
        WigtAct.clean_back();
        return true
    }
    if(times == 0){
        save_img(false);
        WigtAct.clean_back();
        return false
    }
    return false
}

function run_cpdaily(){
    this.sign = function(){
        var reTry = 2
        do{
            reTry--;
            try{
                in_cpdaily();
            }catch(e) {
                save_img(false);
            }
        } while(!sign_cpdaily(reTry) && reTry != 0)
    }

    this.err = function(){
        while(true){
            if(text('我知道了').exists()){
                WigtAct.click_wigt(text('我知道了').findOne(2000))
            }

            if(text('跳过').exists()){
                WigtAct.click_wigt(text('跳过').findOne(2000))
            }

            if(id('close_ll').exists()){
                WigtAct.click_wigt(id('close_ll').findOne(2000))
            }

            if(text('以后再说').exists()){
                WigtAct.click_wigt(text('以后再说').findOne(2000))
            }
        } 
    }

}

module.exports = new run_cpdaily()

// module.exports = daily_sign()
