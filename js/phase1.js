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

  //paddle
  var paddlex;
  var paddleh;
  var paddlew;
  var is_leftPannel = false;
  var is_rightPannel = false;

  //bricks
  var bricks;
  var NROWS;
  var NCOLS;
  var BRICKWIDTH;
  var BRICKHEIGHT;
  var PADDING;

  var ctx;
  var anim;

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
    ball(x, y, radius);
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

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
        }
      }
    }

    if (is_leftPannel && paddlex > 0) {
      paddlex -= 5;
    }
    if (is_rightPannel && paddlex + paddlew < WIDTH) {
      paddlex += 5;
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

  //Event
  $(document).on("keydown", function (e) {
    if (e.which == 37) {
      is_leftPannel = true;
    } else if (e.which == 39) {
      is_rightPannel = true;
    }
  });

  $(document).on("keyup", function (e) {
    if (e.which == 37) {
      is_leftPannel = false;
    } else if (e.which == 39) {
      is_rightPannel = false;
    }
  });

  $(document).mousemove(onMouseMove);
});
