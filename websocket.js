/*
 * @Author: your name
 * @Date: 2020-06-09 11:11:45
 * @LastEditTime: 2020-06-09 11:28:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \js-\websocket.js
 */ 

//  initWebSocket('地址');
//  sendSock('需要发送的消息','回调函数');
//  接受到的数据看 websocketonmessage;
var global_callback = null;
var websock = null;
var lockReconnect = false; 
var heartCheck = {
    timeout: 55000,        //55s发一次心跳
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            sendSock(`{"actionType":"ping"}`)
            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                websock.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}

// socket初始化
function initWebSocket(url) { //初始化weosocket
    //ws地址
    var wsuri = `${url}`;
    websock = new WebSocket(wsuri);
    websock.onmessage = function (e) {
        // 心跳重置
        heartCheck.reset().start();
        websocketonmessage(e);
    }
    websock.onopen = function () {
        // 心跳重置
        heartCheck.reset().start();
        console.log("ws连接成功!"+new Date());
    }
    
    // 连接关闭
    websock.onclose = function (e) {
        console.log("ws连接关闭...尝试重连......"+new Date() , e.code);
        //连接失败后，尝试重连
        setTimeout(function () {
            initWebSocket(url);
        }, 2000);
    }
    //连接发生错误的回调方法
    websock.onerror = function () {
        console.log("WebSocket连接发生错误，尝试重连中......");
        //连接失败后，尝试重连
        setTimeout(function () {
            initWebSocket(url);
        }, 2000);
    }
}

// 发送消息
function sendSock(agentData, callback) {
    global_callback = callback;
    if (websock.readyState === websock.OPEN) {
        //若是ws开启状态
        websock.send(agentData);
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData, callback);
        }, 1000);
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData, callback);
        }, 1000);
    }
}
//数据接收
function websocketonmessage(e) {
    if (e.data == "actionType参数获取失败") {
        return
    }
    let data = JSON.parse(e.data);

    let type = data.actionType;
    let form;
    switch (type){
        case "init" :
            form = {
                actionType:data.actionType,
                user_id:"0"
            }
            form = JSON.stringify(form)
            sendSock(form,(res)=>{
                console.log(res,"发送成功")
            });
            break;
        case "clout_notice" :

            form = {
                actionType:"clout_notice",
                msg:"xxxx",
                url:"xxxx"
            }
            Notification({
                title: '提示',
                dangerouslyUseHTMLString: true,
                message: `<a href="/Detail/Clout" style="text-decoration: none;color:blue;">${data.msg}</a>`,
                offset: 155
            });
            break;
        default :
            form = JSON.stringify(data);
            sendSock(form,(res)=>{
                console.log(res,"发送成功")
            });
            break;
    }
    if(global_callback!=null&&global_callback!=""&&global_callback!=undefined){
        global_callback(JSON.parse(e.data));
    }
    return JSON.parse(e.data);
}
