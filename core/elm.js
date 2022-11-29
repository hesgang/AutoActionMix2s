
const { clean_back } = require('../utils/wigt_action.js');
let WigtAct = require('../utils/wigt_action.js')
let _widgetUtils = singletonRequire('WidgetUtils')
let singletonRequire = require('../lib/SingletonRequirer.js')(runtime, global)
let commonFunctions = singletonRequire('CommonFunction')
let automator = singletonRequire('Automator')
let { logInfo, errorInfo, warnInfo, debugInfo, infoLog, debugForDev, clearLogFile, flushAllLogs } = singletonRequire('LogUtils')
let { _config } = require('../config.js')(runtime, this)
let FloatyInstance = singletonRequire('FloatyUtil')


function run_elm(){
    let doneMissions = new Array(), //记录 sourceNodeId()
    badMissions = new Array(),
    openReTry = true,
    beanReTry = true,
    mainThread = null,
    closeThread = null;

    const startelm = function(){
        var open_flag = app.launchPackage('me.ele');
        let confirm = _widgetUtils.widgetGetOne(/^允许$|^打开$/, 1000)
        if (confirm) {
            debugInfo(confirm);
            if(confirm.clickable()){
                confirm.click();
            }else{
                sleep(1000);
                automator.clickCenter(confirm);
            }
        }
        // 判断软件是否正常打开，首次打开可能较慢，超时等待10秒
        if(open_flag && _widgetUtils.widgetWaiting('我的', '', 10000)){
            aa = _widgetUtils.widgetGetOne('我的', 5000, true).target
            WigtAct.click_wigt(aa);
            if(!_widgetUtils.idWaiting('account_block_setting', '', 5000)){
                if(openReTry){
                    openReTry = false;
                    logInfo('没有进入相应界面，退出后重试一次！');
                    clean_back();
                    startelm();
                }
                logInfo('退出elm程序任务')
            }
        }else{
            // 软件打开失败了，是否安装或者其他原因
            if(openReTry){
                openReTry = false;
                logInfo('软件打开失败，重试一次后将会退出！');
                clean_back();
                startelm();
            }
            logInfo('退出elm程序任务')
            exit();
        }
                
    }

    const do_eating_bean = function(){
        // textMatches(/(.*去完成.*|.*停止.*|.*结束.*|.*运行.*)/).findOne();
        // 寻找领豆豆界面（后期根据图像处理实现）
        text("做任务赚吃货豆").waitFor();
        // var beanF = className("android.view.ViewGroup").depth(4).findOne(5000);
        // for(var i=0; i<beanF.childCount(); i++){
        //     beanF.child(i).click();
        //     sleep(2000);
        //     if(text("做任务赚吃货豆").exists()){
        //         logInfo('进入任务界面成功！')
        //         break;
        //     }
        // }
        var missions = _widgetUtils.widgetGetAll(/(去完成|去逛逛|去浏览)/, 5000, true);
        while(missions != null && missions.target.length > badMissions.length){
            debugInfo('missions长度：'+missions.target.length);
            debugInfo('badmissions长度：'+badMissions.length);
            debugInfo('doneissions长度：'+doneMissions.length);
            // FloatyInstance.setFloatyText('missions长度：'+missions.target.length)
            // FloatyInstance.setFloatyText('badmissions长度：'+badMissions.length)
            // FloatyInstance.setFloatyText('doneissions长度：'+doneMissions.length)
            mission = missions.target[badMissions.length];
            backRetry = 0;
            // 问题任务
            if(commonFunctions.objINlist(mission.parent().sourceNodeId(), doneMissions)){
                logInfo('这个任务执行有问题[-'+ mission.parent().child(0).text() +'-]，跳过');
                // FloatyInstance.setFloatyText('这个任务执行有问题[-'+ mission.parent().child(0).text() +'-]，跳过')
                badMissions.push(mission.parent().sourceNodeId());
                // missions = _widgetUtils.widgetGetAll(/(去完成|去逛逛|去浏览)/, 5000, true);
                continue;
            }
            doneMissions.push(mission.parent().sourceNodeId());
            logInfo('开始执行：' + mission.parent().child(0).text());
            // FloatyInstance.setFloatyText('开始执行：' + mission.parent().child(0).text());
            mission.click();
            if(_widgetUtils.widgetWaiting('浏览15秒', '', 3000)){
                _widgetUtils.widgetWaiting('任务完成', '', 20000);
            }
            if(currentPackage() == 'com.eg.android.AlipayGphone'){
                // 跳转回elm界面
                app.launchPackage('me.ele');
            }
            // 问题控件，无法返回，尝试三次
            while(!_widgetUtils.widgetWaiting("做任务赚吃货豆", '', 3000) && backRetry++ < 3){
                logInfo('再次返回第' + backRetry + '次')
                back();
                if(backRetry == 3){
                    debugInfo('返回3次失败，加入失败任务列表');
                }
            }
            
            missions = _widgetUtils.widgetGetAll(/(去完成|去逛逛|去浏览)/, 5000, true);
            
        }
    }

    const close_window = function(){
        // 休息一下滑动提醒
        threads.start(function () {
            let floty = text('休息一下').findOne(
            _config.timeout_findOne
            )
            if (floty) {
                // 滑动验证
                wig = id("nocaptcha").findOne(_config.timeout_findOne).bounds()
                automator.swipe(wig.centerX(), wig.centerY(), device.width-wig.centerX(), wig.centerY(), 500);
            }
        })

        threads.start(function () {
            let floty = text("身份验证").findOne(
            _config.timeout_findOne
            )
            if (floty) {
                // 重新开始
            }
        })
    }

    this.Executor = function () {
        mainThread = threads.start(function(){
            startelm();
            do_eating_bean();
        })

        closeThread = threads.start(function(){
            while(mainThread.isAlive()){
                if(text("身份验证").exists()){
                    logInfo('触发身份验证，退出后后重新开始');
                    mainThread.interrupt();
                    clean_back();
                    // 退出后重新开始
                    mainThread = threads.start(function(){
                        startelm();
                        do_eating_bean();
                    })
                }
                if(textMatches(/我知道了|知道啦|暂时离开/).exists()){
                    _A = textMatches(/我知道了|知道啦/).findOne(5000);
                    automator.clickCenter(_A)
                }
            }
        })
        
    }

}

// 休息一下界面 text('休息一下')

module.exports = new run_elm();