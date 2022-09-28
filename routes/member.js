const express = require("express");
const firebase = require("../connections/firebase_client");
const firebaseDB = require("../connections/firebase_admin");
const router = express.Router();
const auth = firebase.auth();
const userRef = firebaseDB.collection("user");

// 登入頁
router
  .route("/signin")
  .get(function (req, res) {
    const path = req.originalUrl;
    const messages = req.flash("messages");
    const hasMemberId = req.session.uid;
    const memberName = req.session.nickname;
    const saveValues = req.flash("saveValues");

    res.render("dashboard/signin", { 
      title: "六角部落格|會員登入",
      path,
      hasMemberId,
      memberName,
      messages,
      saveValues
    });
  })
  .post(function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const saveValues = {
      email,
      password,
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then((UserCredential) => {
        const userID = UserCredential.user.uid;
        return userRef.doc(userID).get()
      }).then(doc => {
        req.session.uid = doc.id;
        req.session.nickname = doc.data().nickname;
        res.redirect('/dashboard');
      }).catch(err => {
        const errorCode = err.code;
        const errorMsg =
          errorCode === 'auth/user-not-found' ? '您輸入信箱未註冊，請重新確認或註冊' : '你輸入密碼有誤'
        
        req.flash("saveValues", saveValues);
        req.flash("messages",errorMsg)
        res.redirect('/member/signin')
      })
  })

// 登出
router
  .get("/signout",function (req, res) {
    req.session.uid = '';
    req.session.nickname = '';
    res.redirect("/member/signin");
  })

// 註冊頁
router
  .route("/signup")
  .get(function (req, res) {
    const path = req.originalUrl;
    const messages = req.flash("messages");
    const saveValues = req.flash("saveValues");
    const hasMemberId = req.session.uid;
    const memberName = req.session.nickname;

    res.render("dashboard/signup", { 
      title: "六角部落格|會員註冊",
      path,
      hasMemberId,
      memberName,
      messages,
      saveValues,
    });
  })
  .post(function (req, res) {
    const nickname = req.body.nickname;
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    const saveValues = {
      nickname,
      email,
      password,
      confirm_password,
    }

    if(password !== confirm_password){
      req.flash("messages",'兩個密碼輸入不符合')
      req.flash("saveValues",saveValues)
      res.redirect('/member/signup')
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(UserCredential => {
        const userID = UserCredential.user.uid;
        const userInfo = {
          id: userID,
          nickname,
          email,
        }

        return userRef.doc(userID).set(userInfo);
      }).then(() => {
        req.flash('messages','註冊成功請登入會員')
        res.redirect('/member/signin');
      }).catch((error) => {
        const errorMsg = error.message;

        req.flash("messages", errorMsg);
        req.flash("saveValues", saveValues);
        res.redirect('/member/signup');
      });
  })

module.exports = router;