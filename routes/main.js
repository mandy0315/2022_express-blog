const express = require("express");
const router = express.Router();
const firebaseDB = require("../utils/firebase_admin");
const categoriesRef = firebaseDB.collection("categories");
const articlesRef = firebaseDB.collection("articles");
const dayjs = require("dayjs");
const striptags = require("striptags");
const pagination = require("../public/js/pagination");

// 首頁
router.get("/", function (req, res, next) {
  const path = req.originalUrl;
  articlesRef
    .orderBy("update_time")
    .get()
    .then((snapshot) => {
      let articlesInfo = [];
      snapshot.forEach((doc) => {
        if (doc.data()?.status === "public") {
          articlesInfo.push(doc.data());
        }
      });
      articlesInfo.reverse(); // 反轉 最新文章在上方

      // 分頁
      const result = pagination({
        articlesInfo,
        currectPage: parseInt(req.query.page || 1),
        perPage: 3,
      });
      // 分頁結束

      res.render("archives", {
        title: "六角部落格|首頁",
        path,
        articlesInfo: result.data,
        page: result.page,
        dayjs,
        striptags,
      });
    });
});

// 文章頁
router.get("/posts", function (req, res, next) {
  const path = req.originalUrl;
  articlesRef
    .orderBy("update_time")
    .get()
    .then((snapshot) => {
      let articlesInfo = [];
      snapshot.forEach((doc) => {
        if (doc.data()?.status === "public") {
          articlesInfo.push(doc.data());
        }
      });
      articlesInfo.reverse(); // 反轉 最新文章在上方

      // 分頁
      const result = pagination({
        articlesInfo,
        currectPage: parseInt(req.query.page || 1),
        perPage: 3,
      });
      // 分頁結束

      res.render("archives", {
        title: "六角部落格|文章列表",
        path,
        articlesInfo: result.data,
        page: result.page,
        dayjs,
        striptags,
      });
    });
});
router.get("/post/:id", function (req, res, next) {
  const id = req.params.id;
  let categoriesInfo = [];
  const path = req.originalUrl;

  categoriesRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => categoriesInfo.push(doc.data()));
      return articlesRef.doc(id).get();
    })
    .then((doc) => {
      const articleInfo = doc.data();
      res.render("post", {
        title: "六角部落格|文章內頁",
        path,
        categoriesInfo,
        articleInfo,
        dayjs,
        striptags,
      });
    });
});

// 分類頁
router.get("/categories", function (req, res, next) {
  let categoriesInfo = [];
  const path = req.originalUrl;

  categoriesRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        categoriesInfo.push(doc.data());
      });
      return articlesRef.get();
    })
    .then((snapshot) => {
      let articlesInfo = [];
      let filterArticlesInfo = {};

      snapshot.forEach((doc) => {
        if (doc.data()?.status === "public") {
          articlesInfo.push(doc.data());
        }
      });

      categoriesInfo.forEach((categorie) => {
        const arr = articlesInfo.filter((article) => article.category === categorie.name);
        if (arr.length > 0) {
          filterArticlesInfo[categorie.id] = arr;
        }
      });
      res.render("categories", {
        title: "六角部落格|分類",
        path,
        categoriesInfo,
        filterArticlesInfo,
      });
    });
});
router.get("/categories/:kind", function (req, res, next) {
  const kind = req.params.kind;
  const path = req.originalUrl;

  articlesRef
    .orderBy("update_time")
    .get()
    .then((snapshot) => {
      let articlesInfo = [];

      snapshot.forEach((doc) => {
        const status = doc.data()?.status
        const category = doc.data()?.category.toLowerCase()

        if (status === "public" && category === kind) {
          articlesInfo.push(doc.data());
        }
      });
      articlesInfo.reverse();

      // 分頁
      const result = pagination({
        articlesInfo,
        currectPage: parseInt(req.query.page || 1),
        perPage: 3,
      });
      // 分頁結束

      res.render("archives", {
        title: `六角部落格|${kind} 列表`,
        path,
        articlesInfo: result.data,
        page: result.page,
        dayjs,
        striptags,
      });
    });
});

module.exports = router;
