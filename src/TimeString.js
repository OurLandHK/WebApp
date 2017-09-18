function timeOffsetStringInChinese(timeInMS) {
    var second = timeInMS/1000;
    var minutes = second/60;
    var hour = minutes/60;
    var day = hour/24;
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