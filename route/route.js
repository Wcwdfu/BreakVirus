const express = require("express");
const fs = require('fs');
const router = express.Router();
router.get("/test1/:difficulty", function (req, res) {
  req.session.difficulty = parseInt(req.params.difficulty);
  req.session.bgm = true;
  req.session.infinite = false;
  req.session.score = 0;
  req.session.life = 10;
  req.session.damage = 1;
  req.session.radius = 10;
  req.session.paddlew = 75;
  res.redirect("/src/phase1.html");
});
router.get("/test2/:difficulty", function (req, res) {
  req.session.difficulty = parseInt(req.params.difficulty);
  req.session.bgm = true;
  req.session.infinite = false;
  req.session.score = 0;
  req.session.life = 10;
  req.session.damage = 3;
  req.session.radius = 10;
  req.session.paddlew = 75;
  res.redirect("/src/phase2.html");
});

router.get("/getSessionData", function (req, res) {
  res.json(200,req.session);
});

router.get("/", function (req, res) {
  req.session.difficulty =1;
  req.session.bgm = true;
  req.session.infinite = false;
  req.session.score = 0;
  req.session.life = 3;
  req.session.damage = 1;
  req.session.radius = 10;
  req.session.paddlew = 75;
  
  res.redirect("src/tutorial.html");
});

router.get("/:difficulty", function (req, res) {
  req.session.difficulty = parseInt(req.params.difficulty);
  res.redirect(200,"src/phase1.html");
});
router.post("/save", function (req, res) {
  var body = req.body;

  req.session.difficulty = body.difficulty;
  req.session.bgm = body.bgm;
  req.session.infinite = body.infinite;
  req.session.score = body.score;
  req.session.life = body.life;
  req.session.damage = body.damage;
  req.session.radius = body.radius;
  req.session.paddlew = body.paddlew;
  res.sendStatus(200);
});
router.post("/reset",function(req,res){

  req.session.difficulty = 1;
  req.session.score = 0;
  req.session.life = 3;
  req.session.damage = 1;
  req.session.radius = 10;
  req.session.paddlew = 75;
  res.sendStatus(200);
});
router.get("/getSetting", function (req, res) {
  var body = {
    "bgm": req.session.bgm,
    "infinite": req.session.infinite
  }
  res.json(200,body);
});
router.post("/saveSetting", function (req, res) {
  var body = req.body;

  req.session.bgm = body.bgm;
  req.session.infinite = body.infinite;

  res.sendStatus(200);  
});


router.all("*", function (req, res) {
  res.status(404).send("<h1>404 ERROR - 페이지를 찾을 수 없습니다.</h1>");
});

module.exports = router;
