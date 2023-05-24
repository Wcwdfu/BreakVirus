$(init_game);

var gameStatus; // 게임 상태
var jsonData; // json data
var difficulty; // 0,1,2 -> easy , normal, hard
var life; // 라이프
var score; // 점수
var damage; // 보스전 데미지
var speed;

var WIDTH;
var HEIGHT;
var x = 480;
var y = 480;
var radius = 10;
var dx = 2;
var dy = 4;

var canvasMinX;
var canvasMaxX;

var is_gameover = false;
var is_gamewin = false;

var difficulty_NROWS = [4, 5, 6];
var difficulty_NCOLS = [4, 5, 6];

var backgroundImgs = [
  "img/background/easy1.jpeg",
  "img/background/easy2.png",
  "img/background/normal1.png",
  "img/background/normal2.png",
  "img/background/hard1.png",
  "img/background/hard2.png",
];
var monsterImgs = [
  "img/monster/monster1.png",
  "img/monster/monster2.png",
  "img/monster/monster3.png",
  "img/monster/monster4.png",
];
var paddlex; // 패들 위치 x
var paddleh; // 패들 높이 y
var paddlew; // 패들 너비 w
var paddleMarginBottom = 10; // 패들 바닥으로부터의 거리

var monsterCnt; // 몬스터 수

//bricks
var bricks; // 벽돌 배열
var NROWS; // 벽돌 행
var NCOLS; // 벽돌 열
var BRICKWIDTH; // 벽돌 너비
var BRICKHEIGHT; // 벽돌 높이
var PADDING; // 벽돌 간격

var ctx; // 캔버스 컨텍스트
var anim; // 애니메이션

var bgi = new Image(); // 배경 이미지

//////////////////////////////////////////////////
//-------------------- draw---------------------//
//////////////////////////////////////////////////
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawBall(x, y, r) {
  ctx.fillStyle = "#03158a";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function drawPaddle(x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
  ctx.fill();
}
function drawImg(img, x, y, w, h) {
  ctx.beginPath();
  ctx.drawImage(img, x, y, w, h);
  ctx.closePath();
  ctx.fill();
}
function drawBossHp(hp, x, y) {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Boss HP: " + hp, x, y);
}

function drawBgi(image) {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}
function drawBricks() {
  //draw bricks
  for (i = 0; i < NROWS; i++) {
    for (j = 0; j < NCOLS; j++) {
      if (bricks[i][j] == 1) {
        var image = new Image();
        image.src = "img/phase1/brick.png";
        drawImg(
          image,
          j * BRICKWIDTH,
          i * BRICKHEIGHT,
          BRICKWIDTH - PADDING,
          BRICKHEIGHT - PADDING
        );
      } else if (bricks[i][j] >= 2) {
        var image = new Image();
        var idx = bricks[i][j] - 2;
        image.src = monsterImgs[idx];
        drawImg(
          image,
          j * BRICKWIDTH,
          i * BRICKHEIGHT,
          BRICKWIDTH - PADDING,
          BRICKHEIGHT - PADDING
        );
      }
    }
  }
}
//////////////////////////////////////////////////
//-------------------- init---------------------//
//////////////////////////////////////////////////
function init_paddle() {
  paddlex = WIDTH / 2;
  paddleh = 10;
  paddlew = 75;
}
function init_bgi(difficulty) {
  // status 1, 2
  // difficulty 1,2,3
  // bgi 1,2,3,4,5,6
  // 1-1, 1-2, 2-1, 2-2, 3-1, 3-2
  //  1    2    3    4    5   6
  var level = 0;
  if (gameStatus == 1) level = 2 * difficulty - 1;
  else if (gameStatus == 2) level = 2 * difficulty;
  bgi.src = backgroundImgs[level - 1];
}
function init_bricks() {
  NROWS = difficulty_NROWS[difficulty - 1];
  NCOLS = difficulty_NCOLS[difficulty - 1];
  PADDING = 1;
  BRICKWIDTH = WIDTH / NCOLS;
  BRICKHEIGHT = 40;

  //set counts of monster (difficulty * 3)
  monsterCnt = difficulty * 3;
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
    if (bricks[row][col] != 1) i--;
    var idx = Math.floor(Math.random() * 3) + 2;
    bricks[row][col] = idx;
  }
}
function init_boss() {}
function init_game() {
  //canvas 가져오기
  ctx = $("#canvas")[0].getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();

  canvasMinX = $("#canvas").offset().left;
  canvasMaxX = canvasMinX + WIDTH;

  $.ajax({
    url: "data/data.json",
    dataType: "json",
    success: function (data) {
      jsonData = data;
      gameStatus = jsonData[0].status;
      difficulty = jsonData[0].difficulty;
      life = jsonData[0].life;
      score = jsonData[0].score;
      damage = jsonData[0].damage;
      radius = jsonData[0].radius;
      gameSwitch();
    },
  });
  //animation
}

function gameSwitch() {
  switch (gameStatus) {
    case 1:
      init_phase1();
      break;
    case 2:
      init_phase2();
      break;
    default:
      break;
  }
}
function updateBricks() {
  //Have We Hit a Bricks?
  var row = Math.floor(y / (BRICKHEIGHT + PADDING));
  var col = Math.floor(x / (BRICKWIDTH + PADDING));
  if (row < NROWS) {
    if (bricks[row][col] == 1) {
      dy = -dy;
      bricks[row][col] = 0;
    } else if (bricks[row][col] >= 2) {
      dy = -dy;
      updateItem(bricks[row][col] - 1);
      bricks[row][col] = 0;
      //TODO : item 으로 인한 효과
    }
  }
}
function updateItem(idx) {
  //TODO : item 으로 인한 효과
  switch (idx) {
    case 1:
      //TODO : 바 길이 증가
      paddlew += 10;
      break;
    case 2:
      //TODO : 데미지 증가
      damage += 1;
      jsonData[0].damage = damage;
      break;
    case 3:
      //TODO : 라이프 추가
      life += 1;
      jsonData[0].life = life;
      break;
    case 4:
      //TODO : 공 크기 증가
      radius += 3;
      jsonData[0].radius = radius;
      break;
    default:
      break;
  }
}
function updateDirection() {
  if (x >= WIDTH - radius || x <= 0 + radius) {
    dx = -dx;
  }
  if (y <= 0 + radius) {
    dy = -dy;
  } else if (y >= HEIGHT - radius - paddleMarginBottom) {
    if (x > paddlex && x < paddlex + paddlew) {
      dx = -((paddlex + paddlew / 2 - x) / paddlew) * 10;
      dy = -dy;
    } else {
      //Game Over
      if (life > 0) {
        life--;
        x = 480;
        y = 480;
      } else {
        is_gameover = true;
      }
    }
  }
}
function updateGameStatus(game) {
  //게임 종료 조건
  if (is_gameover) {
    //게임 종료
    window.cancelAnimationFrame(anim);
  } else {
    anim = window.requestAnimationFrame(game);
  }
}

function onMouseMove(e) {
  if (e.pageX >= canvasMinX && e.pageX <= canvasMaxX) {
    paddlex = e.pageX - canvasMinX - paddlew / 2;
  }
}
function init_phase1() {
  //phase1 init

  init_paddle();
  init_bricks();
  init_bgi(difficulty);

  //phase1 start
  anim = requestAnimationFrame(phase1);
  $(document).mousemove(onMouseMove);
}
function init_phase2() {
  //phase1 init

  init_paddle();
  init_boss();
  init_bgi(difficulty);

  //phase1 start
  anim = requestAnimationFrame(phase2);
  $(document).mousemove(onMouseMove);
}
//잡몹
function phase1() {
  clear();
  drawBgi(bgi);
  drawBall(x, y, radius);
  drawPaddle(paddlex, HEIGHT - paddleh - paddleMarginBottom, paddlew, paddleh);
  drawBricks();

  x += dx;
  y += dy;

  updateBricks();
  updateDirection();
  updateGameStatus(phase1);
}
//보스전
function phase2() {
  clear();
  drawBgi(bgi);
  drawBall(x, y, radius);
  drawBricks();
  drawPaddle(paddlex, HEIGHT - paddleh - paddleMarginBottom, paddlew, paddleh);

  x += dx;
  y += dy;
  updateBricks();

  updateDirection();
  updateGameStatus(phase2);
}
//TODO init level data.json에서 받아와야함.
