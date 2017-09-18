function geoString(lon1, lat1) {
    var d = convertDDToDMS(lat1, false)+ "+" + convertDDToDMS(lon1, true); 
    return d;
}

function convertDDToDMS(deg, lng){
    var d = parseInt(deg,10);
    var minfloat  = Math.abs((deg-d) * 60); 
    var m = Math.floor(minfloat);
    var secfloat = (minfloat-m)*60;
    var s = Math.round(secfloat); 
    d = Math.abs(d);

    if (s===60) {
        m++;
        s=0;
    }
    if (m===60) {
        d++;
        m=0;
    }

    var rv = d.toString() + "°" + m.toString() + "'" + s.toString() + '"' + deg<0?lng?'W':'S':lng?'E':'N';
    console.log("DMS: " + rv + " d " + d);
    return rv;
}
export default geoString;