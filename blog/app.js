// 应用程序的启动文件
const express = require('express');
const swig = require('swig');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cookies = require('cookies');
const app = express();
// 设置静态文件托管
app.use('/public', express.static(__dirname + '/public'))
// 定义模板引擎
app.engine('html', swig.renderFile);
// 设置模板文件存放的目录
app.set('views', './views');
// 注册模板引擎
app.set('view engine', 'html');
// 取消模板引擎的缓存
swig.setDefaults({ cache: false });
// body-parser设置
app.use(bodyParser.urlencoded({ extended: true }))
//设置cookies
app.use((req, res, next)=>{
  req.cookies = new cookies(req, res);
  req.userInfo = {};
  if(req.cookies.get('userInfo')){
    try{
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))
    }catch(e){
      next();
    }
  }
  next()
})
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))
mongoose.connect("mongodb://localhost:27018/blog", (err) => {
  if (err) throw err;
  console.log("MongoDB OK");
  app.listen(8080);
})
