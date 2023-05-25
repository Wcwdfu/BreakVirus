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
  var easy_boss = false;
  var normal_boss = false;
  var hard_boss = true;
  var hardboss_head1 = false;
  var hardboss_head2 = false;
  var hardboss_head3 = false;

  //paddle
  var paddlex;
  var paddleh;
  var paddlew;
  //switch
  var startgame = false;

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
  var vx = 2;
  var vy = 2;
  var imgindex = 0;
  var mimgindex = 0;
  var mmimgindex = 0;
  var bosshp = 4;
  var headchange = 0;
  // 하드 보스 잡몹
  var ix1 = 340;
  var ix2 = 370;
  var iy1 = 100;
  var iy2 = 100;
  var vx1 = 1;
  var vx2 = 2;
  var vy1 = 2;
  var vy2 = 3;
  var minihp1 = 0;
  var minihp2 = 0;

  var easybosslist = [
    "img/boss/easyboss1.png",
    "img/boss/easyboss2.png",
    "img/boss/easyboss3.png",
    "img/boss/easyboss4.png",
  ];
  var normalbosslist = [
    "img/boss/nmbs1.png",
    "img/boss/nmbs2.png",
    "img/boss/nmbs3.png",
    "img/boss/nmbs4.png",
    "img/boss/nmbs5.png",
    "img/boss/nmbs6.png",
  ];
  //하드보스 이미지설정
  var hardbosslist = [];
  for (var i = 0; i <= 72; i++) {
    var imageName = "hbs" + i + ".png";
    var imagePath = "img/hbs/" + imageName;
    hardbosslist.push(imagePath);
  }

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
  //보스스킬
  var skill1 = new Image();
  skill1.src = "img/skill/skill1.png";
  // 사운드
  var bosshit = new Audio("sound/bosshit.mp3");
  var bossdie = new Audio("sound/easybossdie.wav");
  var nmbsatk = new Audio("sound/nmbsatk.mp3");
  var bomb = new Audio("sound/bomb.mp3");
  // 배경
  var bgi = new Image();
  // 시작이미지
  var startimg = new Image();
  startimg.src = "img/backimg/test.jpg";

  // 라이프
  var life = 3;
  //스코어
  var score = 0;

  var ctx;
  var anim;

  var ebimages = [];
  var nbimages = [];
  var hbimages = [];

  var countdownElement = $("#time");
  var time = 0;

  // 1초마다 카운트 업데이트
  setInterval(function () {
    time++;
    countdownElement.text(time);
  }, 1000);

  easybosslist.forEach(function (src, index) {
    var ebimg = new Image();
    ebimg.src = src;
    ebimg.onload = function () {
      ebimages[index] = ebimg;
    };
  });

  normalbosslist.forEach(function (src, index) {
    var nbimg = new Image();
    nbimg.src = src;
    nbimg.onload = function () {
      nbimages[index] = nbimg;
    };
  });

  hardbosslist.forEach(function (src, index) {
    var hbimg = new Image();
    hbimg.src = src;
    hbimg.onload = function () {
      hbimages[index] = hbimg;
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

    if (easy_boss) {
      anim = requestAnimationFrame(easydraw);
      bgi.src = "img/backimg/phase1-2.png";
    }
    if (normal_boss) {
      anim = requestAnimationFrame(normaldraw);
      bosshp = 10;
      ix = 340;
      iy = 100;
      vx = 3;
      vy = 3;
      bgi.src = "img/backimg/phase2-2.png";
    }
    if (hard_boss) {
      anim = requestAnimationFrame(harddraw);
      bosshp = 20;
      ix = -60;
      iy = -50;
      vx = 1;
      vy = 0;
      hardboss_head1 = true;
      bgi.src = "img/backimg/phase3-2.png";
    }
    startgame = true;
  }

  if (startgame) {
    ctx.drawImage(startimg, 0, 0, canvas.width, canvas.height);
  }

  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기
  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기
  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기  // 이지 보스 모드 이야기
  if (easy_boss) {
    function easydraw() {
      clear();
      bgimage();
      ball(x, y, radius);
      rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
      drawbosshp();

      $("#life").text("Life: " + life);
      $("#score").text("Score: " + score);

      if (bosshp > 0) {
        easyboss(ix, iy);
      }

      x += dx;
      y += dy;
      ix += vx;
      iy += vy;

      //보스충돌감지

      if (
        bosshp > 0 &&
        x > ix + 10 &&
        x < ix + 290 &&
        y > iy + 20 &&
        y < iy + 250
      ) {
        dy = -dy;
        dx = -dx;
        vx = -vx;
        vy = -vy;
        if (bosshp == 3) {
          if (vx < 0) vx = 3;
          if (vx > 0) vx = -3;
          if (vy < 0) vy = 3;
          if (vy > 0) vy = -3;
        }
        bosshp--;
        score += 1200;
        bosshit.play();
        if (bosshp == 0) {
          bossdie.play();
          score += 10000;
          easy_boss = false;
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
            score -= 2000;
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

      if (imgindex >= ebimages.length) {
        imgindex = 0;
      }

      if (is_gameover) {
        window.cancelAnimationFrame(anim);
      } else {
        anim = window.requestAnimationFrame(easydraw);
      }
    }
  }
  //노말 보스 모드 이야기  //노말 보스 모드 이야기  //노말 보스 모드 이야기
  //노말 보스 모드 이야기  //노말 보스 모드 이야기  //노말 보스 모드 이야기
  //노말 보스 모드 이야기  //노말 보스 모드 이야기  //노말 보스 모드 이야기

  if (normal_boss) {
    function normaldraw() {
      clear();
      bgimage();
      ball(x, y, radius);
      rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
      drawbosshp();

      if (bosshp > 0) {
        normalboss(ix, iy);
        bsatkimg1();
        atky1 += atkdy1;
      }
      if (atky2 < 1000 && bosshp < 6) {
        bsatkimg2();
        atky2 += atkdy2;
      }
      $("#life").text("Life: " + life);
      $("#score").text("Score: " + score);

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
        score += 1600;
        bosshit.play();

        if (bosshp == 0) {
          bossdie.play();
          score += 25000;
          middle_boss = false;
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
            score -= 3000;
          } else {
            is_gameover = true;
          }
        }
      }
      //y=0;
      //보스공격충돌감지
      if (
        atkx1 > paddlex - paddlew &&
        atkx1 < paddlex + paddlew &&
        atky1 > 560
      ) {
        if (life > 0) {
          ix = 380;
          iy = 100;
          x = 480;
          y = 400;
          atkx1 = Math.random() * 900;
          atky1 = 0;
          bomb.play();
          life--;
          score -= 3000;
        } else {
          is_gameover = true;
        }
      }
      if (
        atkx2 > paddlex - paddlew &&
        atkx2 < paddlex + paddlew &&
        atky2 > 560
      ) {
        if (life > 0) {
          ix = 380;
          iy = 100;
          x = 480;
          y = 400;
          atkx2 = Math.random() * 900;
          atky2 = 0;
          bomb.play();
          life--;
          score -= 3000;
        } else {
          is_gameover = true;
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
      if (imgindex >= nbimages.length) {
        imgindex = 0;
      }
      //보스공격y좌표초기화
      if (bosshp > 0 && atky1 > 580) {
        atky1 = 0;
        atkx1 = Math.random() * 900;
        nmbsatk.play();
      }
      if (bosshp > 0 && atky2 > 560) {
        atky2 = 0;
        atkx2 = Math.random() * 900;
        nmbsatk.play();
      }

      if (is_gameover) {
        window.cancelAnimationFrame(anim);
      } else {
        anim = window.requestAnimationFrame(normaldraw);
      }
    }
  }
  // 노말보스 공격
  function bsatkimg1() {
    ctx.drawImage(bsatk1, atkx1, atky1, 80, 80);
  }
  function bsatkimg2() {
    ctx.drawImage(bsatk2, atkx2, atky2, 100, 100);
  }

  //하드 보스 모드 이야기  //하드 보스 모드 이야기  //하드 보스 모드 이야기
  //하드 보스 모드 이야기  //하드 보스 모드 이야기  //하드 보스 모드 이야기
  //하드 보스 모드 이야기  //하드 보스 모드 이야기  //하드 보스 모드 이야기

  if (hard_boss) {
    function harddraw() {
      clear();
      if (hardboss_head3) {
        bgi.src = "img/backimg/phase3-2a.png";
      } else {
        bgi.src = "img/backimg/phase3-2.png";
      }
      bgimage();
      ball(x, y, radius);
      rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
      drawbosshp();
      if (hardboss_head2) drawskill1();
      if (bosshp > 0) {
        hardboss(ix, iy);
        if (minihp1 > 0) {
          mob1();
          ix1 += vx1;
          iy1 += vy1;
        }
        if (minihp2 > 0) {
          mob2();
          ix2 += vx2;
          iy2 += vy2;
        }
        bsatkimg1();
        atky1 += atkdy1;
      }
      if (bosshp > 0 && hardboss_head1) {
        bsatkimg2();

        atky2 += atkdy2;
      }
      $("#life").text("Life: " + life);
      $("#score").text("Score: " + score);

      x += dx;
      y += dy;
      ix += vx;
      iy += vy;

      //보스충돌감지
      if (
        bosshp > 0 &&
        x > ix + 200 &&
        x < ix + 300 &&
        y > iy + 210 &&
        y < iy + 310
      ) {
        dx = -dx;
        dy = -dy;
        vx = -vx;
        bosshp--;
        headchange++;
        score += 2500;
        bosshit.play();
        if (headchange == 3 && hardboss_head1) {
          hardboss_head1 = false;
          hardboss_head2 = true;
          ix = 245;
          iy = -150;
          minihp1 = 1;
          minihp2 = 1;
          headchange = 0;
        }
        if (headchange == 3 && hardboss_head2) {
          hardboss_head2 = false;
          hardboss_head3 = true;
          ix = 570;
          iy = -110;
          headchange = 0;
        }
        if (headchange == 3 && hardboss_head3) {
          hardboss_head3 = false;
          hardboss_head1 = true;
          ix = -60;
          iy = -50;
          headchange = 0;
        }
        if (bosshp == 0) {
          bossdie.play();
          score += 60000;
          hard_boss = false;
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
            score -= 5000;
            if (hardboss_head1) {
              ix = -60;
              iy = -50;
              x = 480;
              y = 400;
            }
            if (hardboss_head2) {
              ix = 245;
              iy = -150;
              x = 480;
              y = 400;
            }
            if (hardboss_head3) {
              ix = 570;
              iy = -110;
              x = 480;
              y = 400;
            }
          } else {
            is_gameover = true;
          }
        }
      }
      //보스공격충돌감지
      if (
        atkx1 > paddlex - paddlew &&
        atkx1 < paddlex + paddlew &&
        atky1 > 560
      ) {
        if (life > 0) {
          x = 480;
          y = 400;
          atkx1 = Math.random() * 900;
          atky1 = 0;
          bomb.play();
          life--;
          score -= 5000;
        } else {
          is_gameover = true;
        }
      }
      if (
        atkx2 > paddlex - paddlew &&
        atkx2 < paddlex + paddlew &&
        atky2 > 560
      ) {
        if (life > 0) {
          x = 480;
          y = 400;
          atkx2 = Math.random() * 900;
          atky2 = 0;
          bomb.play();
          life--;
          score -= 5000;
        } else {
          is_gameover = true;
        }
      }
      //보스움직임제한
      if (hardboss_head1) {
        if (ix < -80 || ix > -40) {
          vx = -vx;
        }
      }
      if (hardboss_head2) {
        if (ix < 215 || ix > 275) {
          vx = -vx;
        }
      }
      if (hardboss_head3) {
        if (ix < 530 || ix > 610) {
          vx = -vx;
        }
      }

      if (iy < -70 || iy > -30) {
        vy = -vy;
      }
      //보스배열초기화(그림표시설정)
      if (imgindex >= hbimages.length) {
        imgindex = 0;
      }
      //몹배열초기화
      if (mimgindex >= ebimages.length) {
        mimgindex = 0;
      }
      if (mmimgindex >= nbimages.length) {
        mmimgindex = 0;
      }
      //보스공격y좌표초기화
      if (bosshp > 0 && atky1 > 580) {
        atky1 = 0;
        atkx1 = Math.random() * 900;
        nmbsatk.play();
      }
      if (bosshp > 0 && atky2 > 560) {
        atky2 = 0;
        atkx2 = Math.random() * 900;
        nmbsatk.play();
      }

      if (is_gameover) {
        window.cancelAnimationFrame(anim);
      } else {
        anim = window.requestAnimationFrame(harddraw);
      }
    }
  }

  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////

  function drawbosshp() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Boss HP: " + bosshp, 8, 30);
  }

  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  // 이지 보스 그래픽
  function easyboss(ix, iy) {
    if (ebimages[imgindex]) {
      var ebimage = ebimages[imgindex];
      ctx.drawImage(ebimage, ix, iy, 300, 300);
      imgindex++;
    }
  }
  // 노말 보스 그래픽
  function normalboss(ix, iy) {
    if (nbimages[imgindex]) {
      var nbimage = nbimages[imgindex];
      ctx.drawImage(nbimage, ix, iy, 300, 300);
      imgindex++;
    }
  }
  // 하드 보스 그래픽
  function hardboss(ix, iy) {
    if (hbimages[imgindex]) {
      var hbimage = hbimages[imgindex];
      ctx.drawImage(hbimage, ix, iy, 500, 500);
      imgindex++;
      if (bosshp < 14) imgindex++;
      if (bosshp < 7) imgindex++;
    }
  }
  //잡몹 그래픽
  function mob1(ix1, iy1) {
    if (ebimages[mimgindex]) {
      var mini1 = ebimages[mimgindex];
      ctx.drawImage(mini1, ix1, iy1, 200, 200);
      mimgindex++;
    }
  }
  function mob2(ix2, iy2) {
    if (nbimages[mmimgindex]) {
      var mini2 = nbimages[mmimgindex];
      ctx.drawImage(mini2, ix2, iy2, 100, 100);
      mmimgindex++;
    }
  }
  function drawskill1() {
    ctx.drawImage(skill1, 840, 10, 100, 80);
  }

  function bgimage() {
    ctx.drawImage(bgi, 0, 0, canvas.width, canvas.height);
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
      if (!hardboss_head2) {
        paddlex = e.pageX - canvasMinX - paddlew / 2;
      } else {
        var cursorX = e.pageX - canvasMinX;
        paddlex = canvasMaxX - cursorX - paddlew / 2;
      }
    }
  }

  init();
  init_faddle();
  init_bricks();

  $(document).mousemove(onMouseMove);
});
