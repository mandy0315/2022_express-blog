const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const engine = require("express-ejs-extend");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// view engine setup
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "myblog",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: false, maxAge: 10 * 1000 },
  })
);
app.use(flash());

// router
const mainRouter = require("./routes/main");
const dashboardRouter = require("./routes/dashboard");
const memberRouter = require("./routes/member");
app.use("/", mainRouter);
app.use("/dashboard", dashboardRouter);
app.use("/member", memberRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const path = req.originalUrl;

  res.status(404).render('error', {
    title: '六角部落格|文章不存在',
    path,
    massage: '您所查看的頁面不存在'
  })
});

// error handler
app.use(function (err, req, res, next) {
  err.status = err.status || 500
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status).render("error", {
    title: '六角部落格|程式碼有些問題',
    path,
    massage: '程式碼有些問題，請稍候'
  });
});

module.exports = app;
