export function fileExists(fileUrl){
    fetch(fileUrl)
    .then(function(response) {
        return (response.status == 200 || response.status == 400);
    }).catch(function(err) {
        //console.log("Opps, Something went wrong!", err);
        return useFirestore(fileUrl);
    })

}

export function useFirestore(fileUrl) {
    return (fileUrl.includes("firebase") > 0)
}