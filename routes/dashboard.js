var express = require("express");
var router = express.Router();

/* /dashboard/... page. */
router.get("/", function (req, res, next) {
  res.redirect("/dashboard/signup");
});
router.get("/signup", function (req, res, next) {
  res.render("dashboard/signup", { title: "Express" });
});
// 文章管理
router.get("/archives", function (req, res, next) {
  res.render("dashboard/archives", { title: "Express" });
});
// 分類管理
router.get("/categories", function (req, res, next) {
  res.render("dashboard/categories", { title: "Express" });
});
// 編輯頁
router.get("/article", function (req, res, next) {
  res.render("dashboard/article", { title: "Express" });
});

module.exports = router;
