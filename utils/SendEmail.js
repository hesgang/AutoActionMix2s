let getClickableWigt = require('./wigt_action.js')

module.exports = function (){
    app.sendEmail({
        email: "hesgang@foxmail.com",
        text: '截图信息。',
        attachment: '/sdcard/img.png'
    });
    
    a = text('电子邮件').findOne(10000);
    getClickableWigt.clickable_parent(a, 5).click();
    sleep(500);
    setText([0], 'hesgang@foxmail.com');
    
    id('do_attach').findOne().click();
    a = text('文件管理').findOne(10000);
    getClickableWigt.clickable_parent(a, 5).click();
    
    while(!text('img.png').exists()){
        swipe(500,1800,500,800,210);
        sleep(1000);
    }
    a = text('img.png').findOne(2000);
    press(a.bounds().centerX(), a.bounds().centerY(), 100)
    
    a = text('确定').findOne(10000);
    getClickableWigt.clickable_parent(a, 5).click();
    
    
    a = desc('发送').findOne(10000);
    getClickableWigt.clickable_parent(a, 5).click();
}