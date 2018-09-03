export function fileExists(fileUrl){
    fetch(fileUrl)
    .then(function(response) {
        return (response.status === 200 || response.status === 400);
    }).catch(function(err) {
        //console.log("Opps, Something went wrong!", err);
        return useFirestore(fileUrl);
    })
}

function _checkImageExists(imageUrl, callBack) {
    var imageData = new Image();
    imageData.onload = function() {
        callBack(true);
    };
    imageData.onerror = function() {
        callBack(false);
    };
    imageData.src = imageUrl;
}

export function checkImageExists(imageFile) {
    if(useFirestore(imageFile)) {
        return true;
    } else {
        return _checkImageExists(imageFile, function(existsImage) {
            return(existsImage);
        });
    }
}

function useFirestore(fileUrl) {
    return (fileUrl.includes("firebase") > 0)
}