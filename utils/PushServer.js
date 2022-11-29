
function ServerChan(key) {
    this.key = key;
    this._base = "https://sc.ftqq.com/";
}

/*
text：消息标题，最长为256，必填。
desp：消息内容，最长64Kb，可空，支持MarkDown。
返回值: 类型JSON
成功：{"errno":0,"errmsg":"success","dataset":"done"}
失败：{"errno":1024,"errmsg":"bad pushtoken"}
*/
ServerChan.prototype.send = function(text, desp) {
    let url = [this._base, this.key, ".send"].join("");
    return http.post(url, {
        "text": text,
        "desp": desp || "",
        "channel": '9'
    });
}




/** 导出类 */
module.exports = ServerChan;

