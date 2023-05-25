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
  var ix=340;
  var iy=100;
  var vx=2;
  var vy=2;
  var imaglist = ["img/easyboss1.png", "img/easyboss2.png", "img/easyboss3.png", "img/easyboss4.png"];
  var imgindex = 0;
  var bosshp=4;
  // 사운드
  var bosshit=new Audio('sound/bosshit.mp3')
  var bossdie=new Audio('sound/easybossdie.wav')
  // 배경
  var bgi = new Image();
  bgi.src ="img/easybsbg.jpg"

  // 라이프
  var life=3;


  var ctx;
  var anim;

  var images=[];


  imaglist.forEach(function(src,index){
    var img=new Image();
    img.src=src;
    img.onload=function(){
      images[index]=img;
    }
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
    $("#life").text("Life: "+ life);

    if(bosshp>0){
      boss(ix,iy)
    }
    
    x += dx;
    y += dy;
    ix += vx;
    iy += vy;

    //보스충돌감지
      if (bosshp>0 && x>ix+10 && x<ix+290 && y>iy+20 && y<iy+250) {
        dy = -dy;
        dx = -dx;
        vx = -vx;
        vy = -vy;
        if(bosshp==3){
          if(vx<0) vx= 3;
          if(vx>0) vx= -3;
          if(vy<0) vy= 3;
          if(vy>0) vy= -3;
        }
        bosshp--;
        bosshit.play();
        if(bosshp==0){
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
        if(life>1){
          life--;
          ix = 380;
          iy = 100;
          x = 480;
          y = 400;
        }else{
          is_gameover = true;
        }
      }
    }
    //보스움직임제한
    if(ix<0||ix>660){
      vx=  -vx;
    }
    if(iy<0||iy>200){
      vy = -vy;
    }
    if(imgindex>=images.length){
      imgindex=0;
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
  ctx.fillStyle = "black";
  ctx.fillText("Boss HP: "+bosshp, 8, 30);
  }

  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }



  function boss(ix, iy) {
    if (images[imgindex]) {
      var image = images[imgindex];
      ctx.drawImage(image, ix, iy, 300, 300);
     imgindex++;
    }
  }

  function bgimage(){
    ctx.drawImage(bgi,0,0,canvas.width,canvas.height);
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