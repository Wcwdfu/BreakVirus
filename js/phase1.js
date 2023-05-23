$(function () {
  //init
  var WIDTH;
  var HEIGHT;
  var x = 150;
  var y = 150;
  var radius = 10;
  var dx = 2;
  var dy = 4;

  var canvasMinX;
  var canvasMaxX;
  var is_gameover = false;
  var difficulty;
  var difficulty_NROWS = [4, 5, 6];
  var difficulty_NCOLS = [4, 5, 6];

  //paddle
  var paddlex;
  var paddleh;
  var paddlew;
  var paddlePaddingBottom = 10;

  //bricks
  var bricks;
  var NROWS;
  var NCOLS;
  var BRICKWIDTH;
  var BRICKHEIGHT;
  var PADDING;

  //monster
  var monsterCnt;

  //ctx
  var ctx;
  var anim;

  function init() {
    //canvas 가져오기
    ctx = $("#canvas")[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();

    canvasMinX = $("#canvas").offset().left;
    canvasMaxX = canvasMinX + WIDTH;
    difficulty = 3;
    //animation
    anim = requestAnimationFrame(draw);
  }

  function draw() {
    clear();
    ball(x, y, radius);
    rect(paddlex, HEIGHT - paddleh - paddlePaddingBottom, paddlew, paddleh);

    //draw bricks
    for (i = 0; i < NROWS; i++) {
      for (j = 0; j < NCOLS; j++) {
        if (bricks[i][j] == 1) {
          rect(
            j * BRICKWIDTH,
            i * BRICKHEIGHT,
            BRICKWIDTH - PADDING,
            BRICKHEIGHT - PADDING
          );
        } else if (bricks[i][j] >= 2) {
          var image = new Image();
          var idx = bricks[i][j] - 1;
          image.src = "img/monster_" + idx + ".png";
          img(
            image,
            j * BRICKWIDTH,
            i * BRICKHEIGHT,
            BRICKWIDTH - PADDING,
            BRICKHEIGHT - PADDING
          );
        }
      }
    }

    x += dx;
    y += dy;

    //Have We Hit a Bricks?
    var row = Math.floor(y / (BRICKHEIGHT + PADDING));
    var col = Math.floor(x / (BRICKWIDTH + PADDING));
    if (row < NROWS) {
      if (bricks[row][col] == 1) {
        dy = -dy;
        bricks[row][col] = 0;
      } else if (bricks[row][col >= 2]) {
        dy = -dy;
        bricks[row][col] = 0;
        //TODO : item 으로 인한 효과
      }
    }

    if (x >= WIDTH - radius || x <= 0 + radius) {
      dx = -dx;
    }
    if (y <= 0 + radius) {
      dy = -dy;
    } else if (y >= HEIGHT - radius - paddlePaddingBottom) {
      if (x > paddlex && x < paddlex + paddlew) {
        dx = -((paddlex + paddlew / 2 - x) / paddlew) * 10;
        dy = -dy;
      } else {
        //Game Over
        is_gameover = true;
      }
    }
    if (is_gameover) {
      window.cancelAnimationFrame(anim);
    } else {
      anim = window.requestAnimationFrame(draw);
    }
  }

  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
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
  function img(img, x, y, w, h) {
    ctx.beginPath();
    ctx.drawImage(img, x, y, w, h);
    ctx.closePath();
    ctx.fill();
  }
  function init_faddle() {
    paddlex = WIDTH / 2;
    paddleh = 10;
    paddlew = 75;
  }

  function init_bricks() {
    NROWS = difficulty_NROWS[difficulty - 1];
    NCOLS = difficulty_NCOLS[difficulty - 1];
    PADDING = 1;
    BRICKWIDTH = WIDTH / NCOLS;
    BRICKHEIGHT = 40;
    //set count of monster (0~5) * difficulty(1~3)
    monsterCnt = Math.floor(Math.random() * 5) * difficulty;
    bricks = new Array(NROWS);
    for (i = 0; i < NROWS; i++) {
      bricks[i] = new Array(NCOLS);
      for (j = 0; j < NCOLS; j++) {
        bricks[i][j] = 1;
      }
    }
    //add monster
    for (i = 0; i < monsterCnt; i++) {
      var row = Math.floor(Math.random() * NROWS);
      var col = Math.floor(Math.random() * NCOLS);
      var idx = Math.floor(Math.random() * 3) + 2;
      bricks[row][col] = idx;
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
