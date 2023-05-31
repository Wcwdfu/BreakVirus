$(window).on('load',init_game);

var life; // 라이프
var score; // 점수
var difficulty; // 1,2,3 -> easy , normal, hard
var damage; // 보스전 데미지
var bgm; // 배경음
var infinite; // 무한모드

var WIDTH;
var HEIGHT;
var x = 500;
var y = 400;
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
var startimg=new Image();
loadImage("img/backimg/start.png", function (image) {
  startimg = image;
});

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

//TEST 바 이미지 공 이미지
var barChain = new Image();
barChain.src = "img/figure/chain.png";

var paddlex; // 패들 위치 x
var paddleh; // 패들 높이 y
var paddlew; // 패들 너비 w

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

//오디오 로드
function loadAudio(audioSrc, callback) {
  if(bgm){
  var audio = new Audio();
  audio.src = audioSrc;
  audio.addEventListener('canplaythrough', function() {
    // 로드 완료 시 콜백 호출
    callback(audio);
  });
}
}

// 이미지 로드
function loadImage(imageSrc, callback) {
  var image = new Image();
  image.src = imageSrc;
  image.addEventListener('load', function() {
    // 로드 완료 시 콜백 호출
    callback(image);
  });
}


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

//바 수정
function drawPaddle(img, x, y, w, h) {
  ctx.beginPath();
  //ctx.rect(x,y, w, h);
  ctx.drawImage(img, x, y, w, h);
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
        var img = new Image();
        img.src = "img/phase1/brick.png";
        drawImg(
          img,
          j * BRICKWIDTH,
          i * BRICKHEIGHT,
          BRICKWIDTH - PADDING,
          BRICKHEIGHT - PADDING
        );
      } else if (bricks[i][j] >= 2) {
        var img = new Image();
        var idx = bricks[i][j] - 2;
        img.src = monsterImgs[idx];
        // loadImage(monsterImgs[idx], function (image) {
        //   img = image;
        // });
        drawImg(
          img,
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
  loadImage(backgroundImgs[difficulty-1], function (image) {
    bgi = image;
  });
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
    var idx = Math.floor(Math.random() * 4) + 2;
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
    url: "/getSessionData",
    type: "GET",
    async : false,
    success: function (playingData) {
        difficulty = playingData.level;
        life = playingData.life;
        score = playingData.score;
        damage = playingData.damage;
        radius = playingData.radius;
        paddlew = playingData.paddlew;
        bgm = playingData.bgm;
        infinite = playingData.infinite;
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
      loadAudio("sound/game/brickHit.mp3", function (audio) {
        audio.play();
      });
      
      bricks[row][col] = 0;
    } else if (bricks[row][col] >= 2) {
      score += 2000;
      loadAudio("sound/game/monsterHit.mp3", function (audio) {
        audio.play();
      });
      updateMessage(bricks[row][col] - 2);
      
      monsterCnt--;
      dy = -dy;
      updateItem(bricks[row][col] - 1);
      bricks[row][col] = 0;
    }
  }
}
function updateMessage(idx){
  switch (idx) {
    case 0:
    $("#message").text("paddle width up");
      break;
    case 1:
      $("#message").text("damage up");
      break;
    case 2:
      $("#message").text("life up");
      break;
    case 3:
      $("#message").text("ball size up");
      break;
    default:
      break;
  }
}

function updateItem(idx) {
  switch (idx) {
    case 1:
      paddlew += 20;
      break;
    case 2:
      damage += 1;
      break;
    case 3:
      life += 1;
      break;
    case 4:
      radius += 3;
      break;
    default:
      break;
  }
}


function updateDirection() {
  if (x >= WIDTH - radius || x <= 0 + radius) {
    dx = -dx;

    loadAudio("sound/bounce.mp3", function (audio) {
      audio.play();
    });
  }
  if (y <= 0 + radius) {
    dy = -dy;

    loadAudio("sound/bounce.mp3", function (audio) {
      audio.play();
    });
  } else if (y >= HEIGHT - radius) {
    if (x > paddlex && x < paddlex + paddlew) {
      dx = -((paddlex + paddlew / 2 - x) / paddlew) * 10;
      dy = -dy;
      loadAudio("sound/bounce.mp3", function (audio) {
        audio.play();
      });
    } else {
      loadAudio("sound/oops.mp3", function (audio) {
        audio.play();
      });
      //Game Over
      if(infinite){
        x = 500;
        y = 400;
        
        
      }else{
        if (life > 1) {
          life--;
          x = 500;
          y = 400;
        } else {
          if(!infinite)
            is_gameover = true;
        }
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
    saveData();
    window.location.href = "score.html";
  } else {
    //잡몹전 일떄
      if (monsterCnt == 0) {
        //잡몹전 우승
        saveData();
        window.location.href = "phase2.html";
        window.cancelAnimationFrame(anim);
      } else {
        anim = requestAnimationFrame(game);
      }
  }
}
function saveData(){
  var body = {
    "level": difficulty,
    "life": life,
    "score": score,
    "damage": damage,
    "radius": radius,
    "paddlew": paddlew,
    "bgm": bgm,
    "infinite": infinite
  }
  $.ajax({
    url: "/save",
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

   //배경 넣기

   if(difficulty == 1)
   {
     document.body.style.backgroundImage = "url('img/backimg/background1.png')";
   } else if(difficulty == 2 ) {
     document.body.style.backgroundImage = "url('img/backimg/background2.png')";
   } else {
     document.body.style.backgroundImage = "url('img/backimg/background3.png')";
   }
 
   // document.body.style.backgroundImage = "url('img/backimg/background1.png')";
   document.body.style.backgroundSize = "cover";
   document.body.style.backgroundRepeat = "no-repeat";
 
   var position = 0;
   var speed = 1; // 이동 속도 조정
   var windowWidth = window.innerWidth; // 창의 가로 크기
 
   function moveBackground() {
     position -= speed;
     if (position <= -windowWidth) {
       position = 0;
     }
     document.body.style.backgroundPosition = position + "px 0";
   }
 
   setInterval(moveBackground, 100);
    
}
function init_phase1() {
  //phase1 init

  init_paddle();
  init_bricks();
  init_bgi(difficulty);

  anim = requestAnimationFrame(phase1);

  setTimeout(function () {
    window.cancelAnimationFrame(anim);
    drawImg(startimg,0,0,WIDTH,HEIGHT);
  });
  
  $('#canvas').click(function(){  
    anim = requestAnimationFrame(phase1);
    $('#canvas').unbind('click');
  });

  //phase1 start
  $(document).mousemove(onMouseMove);
}
//잡몹
function phase1() {
  clear();
  drawBgi(bgi);
  drawBall(x, y, radius);
  drawPaddle(barChain, paddlex, HEIGHT - paddleh, paddlew, paddleh);
  drawBricks();

  x += dx;
  y += dy;

  updateBricks();
  updateDirection();
  updateGameStatus(phase1);
}