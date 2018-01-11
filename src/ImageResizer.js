function imageResizer(file, maxWidth, maxHeight, callback) {
    // Create a file reader
    var reader = new FileReader();
    reader.onload = function(e) {
        console.log("Image onload");
    // Create an image
        var img = new Image();        
        img.src = e.target.result;
        img.onload = function() {
            var width = img.width;
            var height = img.height;
            console.log("Image resizer:" + width + "," + height);
            if (width > height) {
                if (width > maxWidth) {
                    height = height * maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = width * maxHeight / height;
                    height = maxHeight;
                }
            }
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(callback, "image/jpeg", 0.8);
        }
    }
    // Load files into file reader
    reader.readAsDataURL(file)
}

export default imageResizer;