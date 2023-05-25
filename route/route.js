const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("src/tutorial.html");
});
router.get("/p", function (req, res) {
  res.redirect("src/phase1.html");
});
router.all("*", function (req, res) {
  res.status(404).send("<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>");
});

module.exports = router;
