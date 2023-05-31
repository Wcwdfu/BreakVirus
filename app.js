var express = require("express");
var static = require("serve-static");
var session = require("express-session")
var Filestore = require("session-file-store")(session);

var router = require("./route/route.js");

var app = express();

app.set("port", process.env.PORT || 8080);
app.set("host", "127.0.0.1");

app.use(static(__dirname));
app.use(express.static("public"));

app.use(express.urlencoded());

app.use(express.json());
app.use(session({
  // HTTPOnly: true,
  secret: "secret key",
  resave: false,
  saveUninitialized: true,
  store : new Filestore(),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

app.use(router);

app.listen(app.get("port"), function () {
  console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
});
