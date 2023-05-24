$(function () {
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext("2d");

  var maxX = canvas.width - 100; // 이미지의 너비를 고려하여 maxX 값을 설정합니다.
  var maxY = canvas.height - 100; // 이미지의 높이를 고려하여 maxY 값을 설정합니다.

  var imagePaths = [
    "easyboss1.png",
    "easyboss2.png",
    "easyboss3.png",
    "easyboss4.png",
  ];
  var currentIndex = 0;

  function loadImage(path) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.src = path;
      image.onload = function () {
        resolve(image);
      };
      image.onerror = function () {
        reject(new Error("Failed to load image: " + path));
      };
    });
  }

  async function startAnimation() {
    var images = await Promise.all(imagePaths.map(loadImage));

    var x = Math.random() * (maxX - 0) + 0; // 초기 x 좌표를 랜덤한 값으로 설정합니다.
    var y = Math.random() * (maxY - 0) + 0; // 초기 y 좌표를 랜덤한 값으로 설정합니다.
    var speedX = (Math.random() - 0.5) * 4; // x 방향 속도를 랜덤한 값으로 설정합니다.
    var speedY = (Math.random() - 0.5) * 4; // y 방향 속도를 랜덤한 값으로 설정합니다.

    setInterval(function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var image = images[currentIndex];
      ctx.drawImage(image, x, y, 200, 200);

      x += speedX;
      y += speedY;

      if (x < 0 || x > 200) {
        speedX = -speedX; // x 방향으로 반대로 이동합니다.
      }
      if (y < 0 || y > 100) {
        speedY = -speedY; // y 방향으로 반대로 이동합니다.
      }

      currentIndex++;
      if (currentIndex >= images.length) {
        currentIndex = 0;
      }
    }, 50);
  }

  startAnimation();
});
