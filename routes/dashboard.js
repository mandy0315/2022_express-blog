var express = require("express");
var router = express.Router();

/* /dashboard/... page. */
router.get("/", function (req, res, next) {
  res.redirect("/dashboard/signup");
});
router.get("/signup", function (req, res, next) {
  res.render("dashboard/signup", { title: "六角部落格|後台登入" });
});
// 分類管理
router.get("/categories", function (req, res, next) {
  res.render("dashboard/categories", { title: "六角部落格|分類管理" });
});
// 文章管理
router.get("/archives", function (req, res, next) {
  res.render("dashboard/archives", { title: "六角部落格|文章管理" });
});
// 編輯頁
router.get("/article", function (req, res, next) {
  res.render("dashboard/article", { title: "六角部落格|文章編輯" });
});

module.exports = router;
