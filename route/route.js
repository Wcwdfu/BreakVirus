const express = require("express");
const fs = require('fs');
const router = express.Router();

router.get("/t", function (req, res) {
  res.redirect("src/game.html");
});
router.get("/", function (req, res) {
  fs.readFile("src/data/setting.json",'utf-8', (err, data) => {
    if(err){
      console.error(err);
      return;
    }
  var json = JSON.parse(data);
  
  fs.writeFile("src/data/playing.json",JSON.stringify(json), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving JSON data');
    } else{
      res.redirect("src/tutorial.html");
    }
  });
  });
});
router.post("/save", function (req, res) {
  var body = req.body;
  var path = "src/data/playing.json"
  fs.writeFile(path,JSON.stringify(body), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving JSON data');
    } else {
      res.send('JSON data saved successfully');
    }
  });
});
router.post("/reset",function(req,res){
  var path = "src/data/playing.json";
  fs.writeFile(path,JSON.stringify({}), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving JSON data');
    } else {
      res.send('JSON data saved successfully');
    }
  });
});
router.post("/saveSetting", function (req, res) {

  var body = req.body;
  var path = "src/data/playing.json";

  fs.readFile(path,'utf-8', (err, data) => {
    if(err){
      console.error(err);
      return;
    }

    
  var json = JSON.parse(data);
  json.bgm = body.bgm;
  json.infinite = body.infinite;

  
  fs.writeFile(path,JSON.stringify(json), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving JSON data');
    } else {
      res.send('JSON data saved successfully');
    } 
  });
  });
  
});


router.all("*", function (req, res) {
  res.status(404).send("<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>");
});

module.exports = router;
