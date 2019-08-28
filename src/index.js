const host = "http://78.129.149.157:80/";

const fetchRequest = (url, method, params = '',resolve)=>{

    // let token= global.storage.load({
    //     key:'token'
    // })

    let header = {
        "Content-Type": "application/json;charset=UTF-8",
        "authorization":"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdGF0aWNfdXNlci1bXSIsImV4cCI6MTU4MzY4MzMxMX0.4F-be8i9x8E7c74-7FdXhVmecZqXn1bCoQvvaHRzqT_TcOxAoPPch5JhERMUvKnUyO667sAZBfjGhTarrSu_3g"
    };

    if(params == ''){
        return new Promise(function (resolve) {
            fetch(host + url, {
                method: method,
                headers: header
            }).then((response) => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch( (err) => {
                    // alert(err);
                    reject(err);
                });
        });
    }else{
        // return fetch(host + url, {
        //     method: method,
        //     headers: header,
        //     body:JSON.stringify(params)
        // })
        //     .then((responseData) => {
        //         alert(responseData);
        //         resolve(responseData);
        //     })
        //     .catch( (err) => {
        //         alert(err);
        //         reject(err);
        //     });
        return new Promise(function (resolve, reject) {
            fetch(host + url, {
                method: method,
                headers: header,
                body:JSON.stringify(params)
            }).then((response) => response.json())
                .then((responseData) => {
                    // alert(JSON.stringify(responseData));
                    resolve(responseData);
                })
                .catch( (err) => {
                    reject(err);
                });
        });
    }
}

export const OrderQuery = async (paramBody)=> {
    
    Url = "order/query";

    return fetchRequest(Url,"POST",paramBody);
}

export const DailySum = async (paramBody)=> {
    
    Url = "driver/dailySum";

    return fetchRequest(Url,"POST",paramBody);
}

export const Update = async (paramBody)=> {
    
    Url = "order/update";

    return fetchRequest(Url,"POST",paramBody);
}
