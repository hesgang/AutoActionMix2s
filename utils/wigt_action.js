
function getClickableWigt () {
    this.clickable_child = function (ui_wigt){
        // 查找传入控件的子控件的可点击控件
        if (ui_wigt.clickable()) {
            return ui_wigt;
        }
        for(var i = 0; i < ui_wigt.childCount(); i++){
            var child = ui_wigt.child(i);
            if (child.clickable()){
                return child;
            }
        }
        return null;
    }   

    this.clickable_parent = function (ui_wigt, depth){
        // 查找传入控件的父控件的可点击控件
        if (ui_wigt.clickable()) {
            return ui_wigt;
        }
        if (depth > ui_wigt.depth()){
            depth = ui_wigt.depth();
        }
        while(depth > 0){
            if (ui_wigt.parent().clickable()){
                return ui_wigt.parent()
            }else{
                ui_wigt = ui_wigt.parent();
                depth--;
            }
        }
        return null;
    }
    
    this.click_wigt = function(ui_wigt){
        // 根据控件坐标点击控件
        let x = ui_wigt.bounds().centerX();
        let y = ui_wigt.bounds().centerY();
        press(x, y, 200);
    }

    this.clean_back = function(){
        home();
        sleep(500);
        recents();
        sleep(500);
        id('clearAnimView').findOne().click();
        sleep(1000);
    }
}



module.exports = new getClickableWigt()