const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Content = require('../models/Content');

let data = {};
router.use((req, res, next) => {
  data = {
    userInfo: req.userInfo,
    categories: []
  }
  Category.find().then((categories) => {
    data.categories = categories;
    next();
  })

})

// 首页
router.get('/', (req, res) => {
  data.page = Number(req.query.page || 1);
  data.category = req.query.category || "";
  data.limit = 2;
  data.pages = 0;
  let where = {};
  if (data.category) {
    where.category = data.category;
  }
  Content.where(where).count().then(count => {
    data.count = count;
    data.pages = Math.ceil(data.count / data.limit);
    data.page = Math.min(data.page, data.pages);
    data.page = Math.max(data.page, 1);
    let skip = (data.page - 1) * data.limit;
    Content.where(where).find().sort({ _id: -1 }).limit(data.limit).skip(skip).populate(['category', 'user']).then(contents => {
      data.contents = contents;
      res.render('index', data)
    })
  })
})

// view
router.get('/view', (req, res)=>{
  let id = req.query.id || "";
  data.category = req.query.category || "";
  Content.findOne({
    _id: id
  }).populate(['category', 'user']).then(content=>{
    data.content = content;
    content.views++;
    content.save();
    res.render('view',data)
  })
})
module.exports = router;