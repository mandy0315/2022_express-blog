const express = require("express");
const dayjs = require("dayjs");
const striptags = require("striptags");
const router = express.Router();
const firebaseDB = require("../utils/firebase_admin");
const categoriesRef = firebaseDB.collection("categories");
const articlesRef = firebaseDB.collection("articles");

// 後台首頁
router.get("/", function (req, res, next) {
  res.redirect("/dashboard/signup");
});
// 後台登入
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
  const state = req.query.state || "public";
  let categoriesInfo = [];

  categoriesRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        categoriesInfo.push(doc.data());
      });
      return articlesRef.orderBy("update_time").get();
    })
    .then((snapshot) => {
      let articlesInfo = [];
      snapshot.forEach((doc) => {
        if (doc.data()?.status === state) {
          articlesInfo.push(doc.data());
        }
      });
      articlesInfo.reverse(); // 反轉 最新文章在上方

      res.render("dashboard/archives", {
        title: "六角部落格|文章管理",
        articlesInfo,
        categoriesInfo,
        dayjs,
        striptags,
        state,
      });
    });
});
router.post("/archives/delete/:id", function (req, res, next) {
  const id = req.params["id"];
  articlesRef
    .doc(id)
    .delete()
    .then(() => {
      res.send("文章已刪除");
      res.end(); // 結束回應
    });
});

// 文章建立
router
  .route("/article/create")
  .get(function (req, res, next) {
    categoriesRef.get().then((snapshot) => {
      let categoriesInfo = [];
      let articleInfo = {};

      snapshot.forEach((doc) => categoriesInfo.push(doc.data()));
      res.render("dashboard/article", {
        title: "六角部落格|文章編輯",
        categoriesInfo,
        articleInfo,
      });
    });
  })
  .post(function (req, res, next) {
    let data = req.body;
    const articleRef = articlesRef.doc();
    const id = articleRef.id;
    const update_time = dayjs().toJSON();
    data.id = id;
    data.update_time = update_time;

    articleRef.set(data).then(() => {
      res.redirect(`/dashboard/article/${id}`);
    });
  });

router.get("/article/:id", function (req, res, next) {
  const id = req.params.id;
  let articleInfo = {};
  articlesRef
    .doc(id)
    .get()
    .then((doc) => {
      articleInfo = doc.data();
      return categoriesRef.get();
    })
    .then((snapshot) => {
      let categoriesInfo = [];
      snapshot.forEach((doc) => categoriesInfo.push(doc.data()));

      res.render("dashboard/article", {
        title: "六角部落格|文章編輯",
        categoriesInfo,
        articleInfo,
      });
    });
});

router.post("/article/update/:id", function (req, res, next) {
  const id = req.params.id;
  const data = req.body;
  const update_time = dayjs().toJSON();
  data.id = id;
  data.update_time = update_time;

  articlesRef
    .doc(id)
    .update(data)
    .then(() => {
      res.redirect(`/dashboard/article/${id}`);
    });
});
module.exports = router;
