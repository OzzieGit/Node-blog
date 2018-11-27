const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Content = require('../models/Content');
let responseData;
router.use((req, res, next) => {
  responseData = {
    code: 200,
    message: ""
  }
  next();
})
// 注册
router.post('/user/register', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({
    username: username
  }).then((userInfo) => {
    if (userInfo) {
      // 已经被注册
      responseData.code = 0;
      responseData.message = "用户名已存在";
      res.json(responseData);
      return;
    }
    // 保存注册信息到数据库
    let user = new User({
      username: username,
      password: password
    });
    return user.save();
  }).then((newUserInfo) => {
    responseData.code = 200;
    responseData.message = "注册成功";
    res.json(responseData)
  })
})
// 登录
router.post('/user/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({
    username: username,
    password: password
  }).then((userInfo) => {
    if (!userInfo) {
      responseData.code = 0;
      responseData.message = '用户名或密码错误';
      res.json(responseData)
      return;
    }
    responseData.code = 200;
    responseData.message = '登录成功';
    responseData.info = {
      id: userInfo._id,
      username: userInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify({
      id: userInfo._id,
      username: userInfo.username,
      isAdmin: userInfo.isAdmin
    }));
    res.json(responseData)
  })
})
// 退出
router.get('/user/logout', (req, res, next)=>{
  req.cookies.set('userInfo', null);
  responseData.code = 200;
  responseData.message = "退出成功";
  res.json(responseData)
})


// 获取全部评论
router.get('/comment/all', (req, res)=>{
  let id = req.query.id;
  Content.findOne({
    _id: id
  }).then(content=>{
    if(req.userInfo.id){
      responseData.code = 200;
      responseData.message = "获取成功";
      responseData.content = content;
    }else{
      responseData.code = 0;
      responseData.message = "没有登录";
      responseData.content = [];
    }
    res.json(responseData)
  })
})
// 评论提交
router.post('/comment/submit', (req, res, next)=>{
  let id = req.body.id;
  let submitData = {
    userName: req.userInfo.username,
    time: new Date(),
    comment: req.body.comment
  }
  Content.findOne({
    _id: id
  }).then(content=>{
    content.comments.push(submitData)
    return content.save();
  }).then(newContent=>{
    responseData.code = 200;
    responseData.message = "评论成功";
    responseData.content = newContent;
    res.json(responseData)
  })
})
module.exports = router;