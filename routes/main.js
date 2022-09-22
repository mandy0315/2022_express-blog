var express = require("express");
var router = express.Router();

/* main page. */
// 首頁
router.get("/", function (req, res, next) {
  res.render("index", { title: "六角部落格|首頁" });
});
// 文章頁
router.get("/post", function (req, res, next) {
  res.render("post", { title: "六角部落格|文章內頁" });
});

module.exports = router;
