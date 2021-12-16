/**
 * @author: wangzp
 * @date: 2021-12-16 19:10
 */
(function(){
  var scale = 1;
  var output = document.getElementById("output");
  var video = document.getElementById("video");
  document.getElementById('button').addEventListener('click', captureImage);

  function captureImage() {
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    var img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    output.appendChild(img);
  };
})();