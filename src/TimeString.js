function timeOffsetStringInChinese(timeInMS) {
    var second = Math.floor(timeInMS/1000);
    var minutes = Math.floor(second/60);
    var hour = Math.floor(minutes/60);
    var day = Math.floor(hour/24);
    var rv = day + "日";
    if(day === 0) {
        if(hour === 0) {
            if(minutes === 0) {
                rv = second + "秒";
            } else {
                rv = minutes + "分鐘";
            }
        } else {
            rv = hour + "小時"
        }
    } 
    return rv;
}


export default timeOffsetStringInChinese;