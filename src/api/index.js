const host = "https://xxxxxx/api/";

const fetchRequest = (url, method, params = '',loginToken,cookie)=>{

    // let token= global.storage.load({
    //     key:'token'
    // })

    // alert("global.cookie");
    let header = {
        "Content-Type": "application/json;charset=UTF-8",
        "credentials":'include',
        "authorization":
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdGF0aWNfdXNlci1bXSIsImV4cCI6MTU4MzY4MzMxMX0.4F-be8i9x8E7c74-7FdXhVmecZqXn1bCoQvvaHRzqT_TcOxAoPPch5JhERMUvKnUyO667sAZBfjGhTarrSu_3g"
    };
    if(params == ''){

        // if(global.cookie) {
        //     header.cookie = global.cookie.headers.map["set-cookie"];
        // }
        return new Promise(function (resolve) {
            fetch(host + url, {
                method: method,
                headers: header, 
                credentials: 'include', 
                // mode: 'cors',
            }).then((response) => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch( (err) => {
                    reject(err);
                });
        });
    }else if(method=="sendCode"){
        setTimeout(function () {
            fetch(host + url, {
                method: "POST",
                credentials: 'include', 
                headers: header, 
                // mode: 'cors',
                body:JSON.stringify(params),
            }).then((response) => {
                // alert(JSON.stringify(response))
                global.cookie = response;
                
                return response.json();
            }).then((responseData) => {
                    resolve(responseData);
                })
                .catch((err) => {
                    // alert(JSON.stringify(err))
                    reject(err);
                });

        }, 30)
    } else{

        // if(global.cookie) {
        //     header.cookie = global.cookie.headers.map["set-cookie"];
        // }
        // alert(JSON.stringify(header.cookie));
        // global.cookier
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                fetch(host + url, {
                    method: method,
                    headers: header,
                    credentials: 'include', 
                    mode: 'cors',
                    body:JSON.stringify(params),
                }).then((response) =>{
                    global.cookie = response;
                    return response.json();
                }
                )
                .then((responseData) => {
                    // alert("sssss"+JSON.stringify(responseData));
                    resolve(responseData);
                }).catch( (err) => {
                    // alert("dddd"+JSON.stringify(err));
                    reject(err);
                });
            }, 30)
        });
    }
}

export const OrderQuery = async (paramBody)=> {
    
    
    Url = "order/query";

    return fetchRequest(Url,"POST",paramBody,"");
}




export const DailySum = async (paramBody)=> {
    
    Url = "driver/dailySum";

    return fetchRequest(Url,"POST",paramBody,"");
}

export const LogIn = async (data,token)=> {
    
    Url = "driver/login";

    // global.storage.load({
    //     key: 'cookie'
    // }).then(data => {
    // })

    return fetchRequest(Url,"POST",data,token,"");
}

export const Update = async (paramBody)=> {
    
    Url = "order/update";

    return fetchRequest(Url,"POST",paramBody,"");
}


// {
//     "phone": "0834355300"
// }
export const sendCode = async (paramBody)=> {

    Url = "driver/sendCode";

    return fetchRequest(Url,"sendCode",paramBody,"","");
}


//{
//     "name": "James",
//         "latitude": 53.386491,
//         "longitude": -6.187666,
//         "status": "offline",
//         "phone": "0814355399",
//         "driverId": "0834355300",
//         "email": null,
//         "verifyCode":"804644"
// }

//name,verifyCode,status(此时肯定没startShift故必传offline)，phone，driverId必传（phone等于driverId）
export const verifyCode = async (paramBody)=> {

    Url = "driver/verifyCode";

    // global.storage.load({
    //     key: 'cookie'
    // }).then(data => {
    //     // header.cookie = data
    //     alert(JSON.stringify(global.cookie.headers.map["set-cookie"]));
    //     return fetchRequest(Url,"POST",data,token,data);
    // })

    return fetchRequest(Url,"POST",paramBody,"","");
}

//
// status说明：
//
// /**
//  * eg: onCurrent: it means a driver has only touched shift button of current store
//  *     onOthers: it means a driver has only touched shift button of other store
//  *     onAll: both open
//  *     offline: a driver has not touched any shift buttons ,
//  *     as it has not started to work
//  */


// {
//         "status": "offline",
//         "driverId": "0834355300",
// }
// driverId和status 必传
export const startShift = async (paramBody)=> {

    Url = "driver/startShift";

    return fetchRequest(Url,"POST",paramBody,"");
}


// {
//         "status": "offline",
//         "driverId": "0834355300",
// }
// driverId和status 必传
// export const endShift = async (paramBody)=> {
//
//     Url = "driver/endShift";
//
//     return fetchRequest(Url,"POST",paramBody,"");
// }




// {
//         "status": "offline",
//         "driverId": "0834355300"
// }
// driverId和status 必传
export const endShiftOthers = async (paramBody)=> {

    Url = "driver/endShiftOthers";

    return fetchRequest(Url,"POST",paramBody,"");
}



// {
//         "status": "offline",
//         "driverId": "0834355300"
// }
// driverId和status 必传
export const endShiftCurrent = async (paramBody)=> {

    Url = "driver/endShiftCurrent";

    return fetchRequest(Url,"POST",paramBody,"");
}







// {
//         "driverId": "0834355300"
// }
// 惩罚接口
export const punish = async (paramBody)=> {

    Url = "driver/punish";

    return fetchRequest(Url,"POST",paramBody,"");
}




//5b-1接口
// 请求参数：
// {
//     "status": "delivered",
//     "type": "others",
//     "driverModel": {
//     "driverId": "d001"
// },
//     "shopModel": {
//     "shopId": "2321321jb"
// }
// }
//driverId 和 shopId是变量，其余为固定值

//返回：

export const easyDishDelivered = async (paramBody)=> {

    Url = "order/groupByShop";

    return fetchRequest(Url,"POST",paramBody,"");
}


// {
//     "driverId": "0834355300"
// }
export const historyOthers = async (paramBody)=> {

    Url = "driver/historyOthers";

    return fetchRequest(Url,"POST",paramBody,"","");
}



// {
//     "driverId": "0834355300"
// }
export const historyCurrent = async (paramBody)=> {

    Url = "driver/historyOthers";

    return fetchRequest(Url,"POST",paramBody,"","");
}


// 查询条件和小房子订单查询一样（包含司机坐标），无需关注type字段（后端自动补全）
//对应小房子数字查询
//{
//  "status": "new",
//   "type":"current",
//    "driverModel": {
//     "driverId": "d001",
//      "latitude": 53.386491,
//     "longitude": -6.187666,
//      "allowDistance":30
//   },
//   "shopModel":{
//     "shopId":"t001"
//   }
// }
//shopModel 为司机当前工作店铺
export const newOrderCount = async (paramBody)=> {

    Url = "driver/historyOthers";

    return fetchRequest(Url,"POST",paramBody,"","");
}


//查询条件跟小汽车订单查询一样，无需关注status字段（后端自动补全）
//对应小汽车数字查询
export const acceptedCount = async (paramBody)=> {

    Url = "driver/historyOthers";

    return fetchRequest(Url,"POST",paramBody,"","");
}



