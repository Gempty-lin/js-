// 封装promist请求
/*
    postData(url,{

    }).then(res =>{

    }).catch(res =>{
        
    })

    Promise.all([postData(url,data),postData(url,data)]).then(value => {
        console.log(value); // 打印-返回值合并数组
    });
*/
let postData = (url,data) => {
    return new Promise((resolve,reject) => {
        $.ajax({
            url : url,
            data : data,
            type : 'post',
            success:function(res){  
                resolve(JSON.parse(res))
            },
            error:function(res){
                reject(console.error(`请求失败,原因：${JSON.stringify(res)}`))
            }
        })
    })
}


// layui alert返回值
// 返回值格式res:[{TradeNo:"",Code:1},{TradeNo:"",Code:26}]
function res_alert(data_string,code_1){
    var Code_1 = code_1 ? code_1 : "操作成功"
    var res = JSON.parse(data_string).res;
    var tips_msg = "";
    var res_cn = [ 
        "异常",""+Code_1+"","操作异常","单据状态发生改变","单据未锁定","单据被他人锁定","单据已客审","单据已货审","单据已打印","单据已发货",
        "单据已是锁定状态","单据已是解锁状态","单据内产品为空","单据主信息为空","单据发货仓库为空","单据供应商为空","单据未启用","单据已是启用状态","不存在的单据,刷新后重试","单据未客审",
        "单据不处于等通知发货状态","单据处于等通知发货状态","单据预计发货时间为空","单据内产品商编或规编为空","存在未启用商品或商品资料不存在","订单存在退款单",
        "操作失败,请重试","类型不匹配","单据已提交","单据已入库","单据未提交","单据未入库","入库数大于采购数减已入库数","单据不是可发货状态","单据不是可以退回客审的状态","单据不是新建状态",
        "入库单已存在采购单内的产品","单据已审核","单据已完结","单据已打印","单据未审核","未打印","SessionKey为空","授权失败","授权失败,请检查SessionKey","完全生成配送单","已被他人修改",
        "已存在配送单中","未货审状态","未打印状态","商品资料不存在","商编规编已存在","京东商编规编已存在","唯品会商编规编已存在","组合中的产品不存在",
        "重复添加组合","库存记录不存在","库存不足","平台验证失败","已发货状态","不是可发货状态","平台响应异常","存在相同数据","未发货","退货未审核","退款未审核",
        "补件未审核","退货已审核","退款已审核","补件已审核","换货已审核","不需退款","不需退货","不需补件","不需换货","换货未审核","不需要入库操作",
    ]

    var Code_arr = []
    for (var i = 0; i < 84; i++) {
        Code_arr[i] = {trade:"",Num:0};
    }
    
    for (var i = 0; i < res.length; i++) {
        if (res[i].Code) {
            Code_arr[res[i].Code].Num++;
            Code_arr[res[i].Code].trade += res[i].TradeNo+","
        }
    }
    
    for (var i = 0; i < Code_arr.length; i++) {
        if (Code_arr[i].Num) {
            if (res_cn[i]) {
                var trade_msg = Code_arr[i].trade.split(",");
                tips_msg += res_cn[i]+":"+ Code_arr[i].Num + "条</br>"
                for (var j = 0; j < trade_msg.length-1; j++) {
                    tips_msg += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+trade_msg[j]+"</br>"
                }
            }else{
                tips_msg += "res " + i + ":"+Code_arr[i].Num+" 条</br>"
                for (var j = 0; j < trade_msg.length-1; j++) {
                    tips_msg += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+trade_msg[j]+"</br>"
                }
            }
        }
    }
    layer.alert(`${tips_msg}`)
}

// layui msg返回值
// 返回值格式res:1
function res_msg(res,code_1) {
    var Code_1 = code_1 ? code_1 : "操作成功"
    var res_cn = [ 
        "异常",""+Code_1+"","操作异常","单据状态发生改变","单据未锁定","单据被他人锁定","单据已客审","单据已货审","单据已打印","单据已发货",
        "单据已是锁定状态","单据已是解锁状态","单据内产品为空","单据主信息为空","单据发货仓库为空","单据供应商为空","单据未启用","单据已是启用状态","不存在的单据,刷新后重试","单据未客审",
        "单据不处于等通知发货状态","单据处于等通知发货状态","单据预计发货时间为空","单据内产品商编或规编为空","存在未启用商品或商品资料不存在","订单存在退款单",
        "操作失败,请重试","类型不匹配","单据已提交","单据已入库","单据未提交","单据未入库","入库数大于采购数减已入库数","单据不是可发货状态","单据不是可以退回客审的状态","单据不是新建状态",
        "入库单已存在采购单内的产品","单据已审核","单据已完结","单据已打印","单据未审核","未打印","SessionKey为空","授权失败","授权失败,请检查SessionKey","完全生成配送单","已被他人修改",
        "已存在配送单中","未货审状态","未打印状态","商品资料不存在","商编规编已存在","京东商编规编已存在","唯品会商编规编已存在","组合中的产品不存在",
        "重复添加组合","库存记录不存在","库存不足","平台验证失败","已发货状态","不是可发货状态","平台响应异常","存在相同数据","未发货","退货未审核","退款未审核",
        "补件未审核","退货已审核","退款已审核","补件已审核","换货已审核","不需退款","不需退货","不需补件","不需换货","换货未审核","不需要入库操作",
    ]
    var res = JSON.parse(res).res;
    layer.msg(""+res_cn[res]+"")
}