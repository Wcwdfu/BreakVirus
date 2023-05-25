var express = require("express");
var static = require("serve-static");
var router = require("./route/route.js");
var app = express();

app.set("port", process.env.PORT || 8080);
app.set("host", "127.0.0.1");

app.use(static(__dirname));

app.use(express.urlencoded());

app.use(express.json());
app.use(router);

app.listen(app.get("port"), function () {
  console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
});
