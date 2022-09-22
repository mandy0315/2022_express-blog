const express = require("express");
const router = express.Router();
const firebaseDB = require("../utils/firebase_admin");
const firebase = require("../utils/firebase_admin");
// console.log("firebase", firebase);
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
