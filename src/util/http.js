export function fileExists(fileUrl){
    fetch(fileUrl)
    .then(function(response) {
        return (response.status === 200 || response.status === 400);
    }).catch(function(err) {
        //console.log("Opps, Something went wrong!", err);
        return useFirestore(fileUrl);
    })
}

function _checkImageExists(imageUrl) {
    const imgPromise = new Promise(function imgPromise(resolve, reject) {
        const imageData = new Image();
        imageData.addEventListener('load', function imgOnLoad() {
            resolve(this);
        });
        imageData.addEventListener('error', function imgOnError() {
            reject();
        });
        imageData.src = imageUrl;
    });
    return imgPromise;
}

export function checkImageExists(imageFile) {
  return _checkImageExists(imageFile).then(
    function success(img){
      return (true)
    },
    function failed(){
      return (false)
    }
  );
}

export function checkFirestoreImageExists(imageFile) {
  return useFirestore(imageFile)? true: false;
}

function useFirestore(fileUrl) {
    return (fileUrl.includes("firebase") > 0)
}
