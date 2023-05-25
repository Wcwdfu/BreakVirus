const express = require("express");
const fs = require('fs');
const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("src/game.html");
});
router.get("/t", function (req, res) {
  res.redirect("src/tutorial.html");
});
router.post("/save", function (req, res) {
  var body = req.body;
  var path = "src/data/play.json"
  fs.writeFile(path,JSON.stringify(body), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving JSON data');
    } else {
      res.send('JSON data saved successfully');
    }
  });
});
router.all("*", function (req, res) {
  res.status(404).send("<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>");
});

module.exports = router;
