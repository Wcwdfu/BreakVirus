$(function () {
  //init
  var WIDTH;
  var HEIGHT;
  var x = 480;
  var y = 400;
  var radius = 10;
  var dx = 2;
  var dy = 4;

  var canvasMinX;
  var canvasMaxX;
  var is_gameover = false;
  var is_gamewin = false;

  //paddle
  var paddlex;
  var paddleh;
  var paddlew;

  //bricks
  var bricks;
  var NROWS;
  var NCOLS;
  var BRICKWIDTH;
  var BRICKHEIGHT;
  var PADDING;
  // 보스관련
  var ix = 340;
  var iy = 100;
  var vx = 3;
  var vy = 3;
  var imaglist = [];

  for (var i = 0; i <= 72; i++) {
    var imageName = "hbs" + i + ".png";
    var imagePath = "img/hbs/" + imageName;
    imaglist.push(imagePath);
  }
  var imgindex = 0;
  var bosshp = 10;
  //보스공격
  var bsatk1 = new Image();
  bsatk1.src = "img/nmatk1.png";
  var bsatk2 = new Image();
  bsatk2.src = "img/nmatk2.png";
  var atkx1 = Math.random() * 900;
  var atkx2 = Math.random() * 900;
  var atkx3 = Math.random() * 900;
  var atky1 = 0;
  var atky2 = 0;
  var atky3 = 0;
  var atkdy1 = 4;
  var atkdy2 = 5;
  var atkdy3 = 6;
  // 사운드
  var bosshit = new Audio("sound/bosshit.mp3");
  var bossdie = new Audio("sound/easybossdie.wav");
  var nmbsatk = new Audio("sound/nmbsatk.mp3");
  // 배경
  var bgi = new Image();
  bgi.src = "img/nmbsbg.jpg";

  // 라이프
  var life = 3;

  var ctx;
  var anim;

  // 배경 세팅 관련
  var images = [];

  imaglist.forEach(function (src, index) {
    var img = new Image();
    img.src = src;
    img.onload = function () {
      images[index] = img;
    };
  });

  function init() {
    //canvas 가져오기
    ctx = $("#canvas")[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();

    canvasMinX = $("#canvas").offset().left;
    canvasMaxX = canvasMinX + WIDTH;
    //animation
    anim = requestAnimationFrame(draw);
  }

  function draw() {
    clear();
    bgimage();
    ball(x, y, radius);
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    drawbosshp();
    if (bosshp > 0) {
      boss(ix, iy);
      bsatkimg1();
      atky1 += atkdy1;
    }
    if (bosshp > 0 && bosshp < 6) {
      bsatkimg2();
      atky2 += atkdy2;
    }
    $("#life").text("Life: " + life);

    x += dx;
    y += dy;
    ix += vx;
    iy += vy;

    //보스충돌감지
    if (
      bosshp > 0 &&
      x > ix + 10 &&
      x < ix + 310 &&
      y > iy + 20 &&
      y < iy + 250
    ) {
      dy = -dy;
      dx = -dx;
      vx = -vx;
      vy = -vy;
      if (bosshp == 4) {
        if (vx < 0) vx = 5;
        if (vx > 0) vx = -5;
        if (vy < 0) vy = 5;
        if (vy > 0) vy = -5;
      }
      bosshp--;
      bosshit.play();
      if (bosshp == 0) {
        bossdie.play();
        is_gamewin = true;
      }
    }

    if (x >= WIDTH - radius || x <= 0 + radius) {
      dx = -dx;
    }
    if (y <= 0 + radius) {
      dy = -dy;
    } else if (y >= HEIGHT - radius) {
      if (x > paddlex && x < paddlex + paddlew) {
        dx = -((paddlex + paddlew / 2 - x) / paddlew) * 10;
        dy = -dy;
      } else {
        if (life > 1) {
          life--;
          ix = 380;
          iy = 100;
          x = 480;
          y = 400;
        } else {
          is_gameover = true;
        }
      }
    }
    //보스움직임제한
    if (ix < 0 || ix > 660) {
      vx = -vx;
    }
    if (iy < 0 || iy > 200) {
      vy = -vy;
    }
    //보스배열초기화(그림표시설정)
    if (imgindex >= images.length) {
      imgindex = 0;
    }
    //보스공격y좌표초기화
    if (atky1 > 580) {
      atky1 = 0;
      atkx1 = Math.random() * 900;
      nmbsatk.play();
    }
    if (atky2 > 560) {
      atky2 = 0;
      atkx2 = Math.random() * 900;
      nmbsatk.play();
    }

    if (is_gameover) {
      window.cancelAnimationFrame(anim);
    } else {
      anim = window.requestAnimationFrame(draw);
    }
  }
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////

  function drawbosshp() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Boss HP: " + bosshp, 8, 30);
  }

  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  function boss(ix, iy) {
    if (images[imgindex]) {
      var image = images[imgindex];
      ctx.drawImage(image, ix, iy, 500, 500);
      imgindex++;
    }
  }

  function bgimage() {
    ctx.drawImage(bgi, 0, 0, canvas.width, canvas.height);
  }

  function bsatkimg1() {
    ctx.drawImage(bsatk1, atkx1, atky1, 80, 80);
  }
  function bsatkimg2() {
    ctx.drawImage(bsatk2, atkx2, atky2, 100, 100);
  }

  function ball(x, y, r) {
    ctx.fillStyle = "#03158a";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

  function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
  }

  function init_faddle() {
    paddlex = WIDTH / 2;
    paddleh = 10;
    paddlew = 75;
  }

  function init_bricks() {
    NROWS = 6;
    NCOLS = 5;
    PADDING = 1;
    BRICKWIDTH = WIDTH / NCOLS;
    BRICKHEIGHT = 15;

    bricks = new Array(NROWS);
    for (i = 0; i < NROWS; i++) {
      bricks[i] = new Array(NCOLS);
      for (j = 0; j < NCOLS; j++) {
        bricks[i][j] = 1;
      }
    }
  }
  function onMouseMove(e) {
    if (e.pageX >= canvasMinX && e.pageX <= canvasMaxX) {
      paddlex = e.pageX - canvasMinX - paddlew / 2;
    }
  }
  init();
  init_faddle();
  init_bricks();

  $(document).mousemove(onMouseMove);
});
