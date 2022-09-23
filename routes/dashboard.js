var express = require("express");
var router = express.Router();
const firebaseDB = require("../utils/firebase_admin");
const categoriesRef = firebaseDB.collection("categories");

/* /dashboard/... page. */
router.get("/", function (req, res, next) {
  res.redirect("/dashboard/signup");
});
router.get("/signup", function (req, res, next) {
  res.render("dashboard/signup", { title: "六角部落格|後台登入" });
});
// 分類管理
router.get("/categories", function (req, res, next) {
  const messages = req.flash("info");

  categoriesRef.get().then((snapshot) => {
    let categoriesData = [];
    snapshot.forEach((doc) => categoriesData.push(doc.data()));

    res.render("dashboard/categories", {
      title: "六角部落格|分類管理",
      categoriesData,
      messages,
      hasMessages: messages.length > 0,
    });
  });
});

router.post("/categories/create", function (req, res, next) {
  const data = req.body;

  categoriesRef
    .where("path", "==", data.path)
    .get()
    .then((snapshot) => {
      let paths = [];
      snapshot.forEach((doc) => paths.push(doc.data().path));

      if (paths.length > 0) {
        req.flash("info", "已有相同路徑");
        res.redirect("/dashboard/categories");
      } else {
        let categoryRef = categoriesRef.doc();
        data.id = categoryRef.id; // 事先取得 id

        return categoryRef.set(data);
      }
    })
    .then(() => {
      res.redirect("/dashboard/categories");
      console.log("成功");
    });
});

router.post("/categories/delete/:id", function (req, res, next) {
  const id = req.params["id"];
  categoriesRef
    .doc(id)
    .delete()
    .then(() => {
      req.flash("info", "欄位已刪除");
      res.redirect("/dashboard/categories");
    });
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
