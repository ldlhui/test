export default MillisecondToDate = (time)=> {  
    time = new Date(time).Format("yyyy-MM-dd hh:mm:ss");
    // var year = <span style="font-family: Arial, Helvetica, sans-serif;">.getFullYear();       //年</span>
    // var month = time.getMonth() + 1;
    // var day = time.getDate();
    var hh = time.getHours();
    var mm = time.getMinutes();
    var str= "";
    if(hh < 10)
        str+= "0";
    str+= hh + ":";
    if(mm < 10)
        str+= "0";
    str+= mm + " ";
    return(str);
    // return hours + ":" + minutes + ":" + seconds;
}  