var express = require("express");
var router = express.Router();

/* main page. */
// 首頁
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
// 文章頁
router.get("/post", function (req, res, next) {
  res.render("post", { title: "Express" });
});

module.exports = router;
