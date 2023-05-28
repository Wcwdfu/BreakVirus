$(init_game);

var life; // 라이프
var score; // 점수
var difficulty; // 0,1,2 -> easy , normal, hard
var damage; // 보스전 데미지
var bgm; // 배경음
var infinite; // 무한모드

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

var bgi = new Image(); // 배경 이미지
var backgroundImgs = [
  "img/backimg/phase1-1.jpg",
  "img/backimg/phase2-1.png",
  "img/backimg/phase3-1.png",
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
}
function init_bgi(difficulty) {
  var level = 0;
  bgi.src = backgroundImgs[difficulty-1];
}
function init_bricks() {
  NROWS = difficulty_NROWS[difficulty - 1];
  NCOLS = difficulty_NCOLS[difficulty - 1];
  PADDING = 1;
  BRICKWIDTH = WIDTH / NCOLS;
  BRICKHEIGHT = 40;

  //set counts of monster (difficulty * 3)
  monsterCnt = difficulty * 4;
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
function init_game() {
  //canvas 가져오기
  ctx = $("#canvas")[0].getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();

  canvasMinX = $("#canvas").offset().left;
  canvasMaxX = canvasMinX + WIDTH;
  
  $.ajax({
    url: "data/playing.json",
    dataType: "json",
    async : false,
    success: function (playingData) {
      if(playingData.difficulty != 1 && playingData.difficulty != undefined){
        difficulty = playingData.difficulty;
        life = playingData.life;
        score = playingData.score;
        damage = playingData.damage;
        radius = playingData.radius;
        paddlew = playingData.paddlew;
        bgm = playingData.bgm;
        infinite = playingData.infinite;
      }else{
        $.ajax({
          url: "data/setting.json",
          dataType: "json",
          async : false,
          success: function (settingData) {
            
            difficulty = settingData.difficulty;
            life = settingData.life;
            score = settingData.score;
            damage = settingData.damage;
            radius = settingData.radius;
            paddlew = settingData.paddlew;
            bgm = settingData.bgm;
            infinite = settingData.infinite;
      
          },
        });
      }
    },
  });


  
  init_html();
  init_phase1();
}

function updateBricks() {
  //Have We Hit a Bricks?
  var row = Math.floor(y / (BRICKHEIGHT + PADDING));
  var col = Math.floor(x / (BRICKWIDTH + PADDING));
  if (row < NROWS) {
    if (bricks[row][col] == 1) {
      score += 1000;
      dy = -dy;
      if(bgm){
        var effectAudio = new Audio("sound/game/brickHit.mp3");
        effectAudio.play();
      }
      
      bricks[row][col] = 0;
    } else if (bricks[row][col] >= 2) {
      score += 2000;
      if(bgm){
        var effectAudio = new Audio("sound/game/monsterHit.mp3");
        effectAudio.play();
      }
      
      monsterCnt--;
      dy = -dy;
      updateItem(bricks[row][col] - 1);
      bricks[row][col] = 0;
    }
  }
}
function updateItem(idx) {
  switch (idx) {
    case 1:
      //TODO : 바 길이 증가
      paddlew += 20;
      break;
    case 2:
      //TODO : 데미지 증가
      damage += 1;
      break;
    case 3:
      //TODO : 라이프 추가
      life += 1;
      break;
    case 4:
      //TODO : 공 크기 증가
      radius += 3;
      break;
    default:
      break;
  }
}
function updateDirection() {
  if (x >= WIDTH - radius || x <= 0 + radius) {
    dx = -dx;
    if(bgm)
    {
      var effectAudio = new Audio("sound/bounce.mp3");
      effectAudio.play();
    }
  }
  if (y <= 0 + radius) {
    dy = -dy;
    if(bgm)
    {
      var effectAudio = new Audio("sound/bounce.mp3");
      effectAudio.play();
    }
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
        if(!infinite)
          is_gameover = true;
      }
    }
  }
}
function updateGameStatus(game) {
  if(infinite)
      $("#life").text("Life: ∞");
    else
      $("#life").text("Life: "+ life);
  $("#score").text("Score: "+ score);

  if (is_gameover) {
    //게임 종료
    window.cancelAnimationFrame(anim);
    //TODO: 종료 페이지로 이동

  } else {
    //잡몹전 일떄
      if (monsterCnt == 0) {
        //잡몹전 우승
        saveData();
        window.location.href = "http://localhost:8080/src/phase2.html";
        window.cancelAnimationFrame(anim);
      } else {
        anim = requestAnimationFrame(game);
      }
  }
}
function saveData(){
  var body = {
    playing: 1,
    difficulty: difficulty,
    life: life,
    score: score,
    damage: damage,
    radius: radius,
    paddlew: paddlew,
    bgm: bgm,
    infinite: infinite
  }
  $.ajax({
    url: "http://localhost:8080/save",
    contentType: 'application/json',
    type: "POST",
    async: false,
    data: JSON.stringify(body),
    success: function (data) {
      console.log("save success");
    },
  });
}
function onMouseMove(e) {
  if (e.pageX >= canvasMinX && e.pageX <= canvasMaxX) {
    paddlex = e.pageX - canvasMinX - paddlew / 2;
  }
}
function init_html() {
  if(difficulty == 1)
  {
    $("#title").text("Easy Phase 1");
  }else if (difficulty == 2)
  {
    $("#title").text("Normal Phase 1");
  }else if (difficulty == 3)
  {
    $("#title").text("Hard Phase 1");
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