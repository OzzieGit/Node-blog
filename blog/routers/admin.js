const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Content = require('../models/Content');

router.use((req, res, next) => {
  if (!req.userInfo.isAdmin) {
    res.send('对不起，只有管理员才能进入后台管理!');
    return;
  }
  next()
})
// 后台首页
router.get('/', (req, res, next) => {
  res.render('admin/index', {
    userInfo: req.userInfo
  })
})
// 用户列表
router.get('/user_index', (req, res, next) => {
  let page = Number(req.query.page || 1);
  let limit = 2;
  let pages = 0;
  User.count().then(count => {
    pages = Math.ceil(count / limit);
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    let skip = (page - 1) * limit;
    User.find().limit(limit).skip(skip).then(users => {
      res.render('admin/user_index', {
        userInfo: req.userInfo,
        users: users,
        page: page,
        pages: pages,
        limit: limit,
        count: count,
        pageUrl:'/admin/user_index'
      })
    })
  })
})

// 分类
router.get('/category_index', (req, res) => {
  let page = Number(req.query.page || 1);
  let limit = 2;
  let pages = 0;
  Category.count().then(count => {
    pages = Math.ceil(count / limit);
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    let skip = (page - 1) * limit;
    Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then(categories => {
      res.render('admin/category_index', {
        userInfo: req.userInfo,
        categories: categories,
        page: page,
        pages: pages,
        limit: limit,
        count: count,
        pageUrl:'/admin/category_index'
      })
    })
  })
})
// 分类添加
router.get('/category_add', (req, res) => {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })
})
// 分类提交保存
router.post('/category_add', (req, res, next) => {
  let name = req.body.name || "";
  if (name == "") {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: "名称还能为空"
    })
  } else {
    Category.findOne({
      name: name
    }).then(rs => {
      if (rs) {
        res.render('admin/error', {
          userInfo: req.userInfo,
          message: "分类已经存在，不能重复添加"
        })
        return Promise.reject();
      } else {
        return new Category({
          name: name
        }).save()
      }
    }).then(newCategory => {
      res.render('admin/success', {
        userInfo: req.userInfo,
        message: "分类保存成功",
        url: '/admin/category_index'
      })
    })
  }
})
// 分类修改
router.get('/category_edit', (req, res, next) => {
  let id = req.query.id || "";
  Category.findOne({
    _id: id
  }).then(category => {
    if (!category) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: "分类信息不存在"
      })
      return Promise.reject();
    } else {
      res.render('admin/category_edit', {
        userInfo: req.userInfo,
        category: category
      })
    }
  })
})
// 分类修改保存
router.post('/category_edit', (req, res, next) => {
  let id = req.query.id || "";
  let name = req.body.name || "";
  Category.findOne({
    _id: id
  }).then(category => {
    if (!category) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: "分类信息不存在"
      })
      return Promise.reject();
    } else {
      if (name == category.name) {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: "修改成功",
          url: "/admin/category_index"
        })
        return Promise.reject();
      } else {
        return Category.findOne({
          _id: { $ne: id },
          name: name
        })
      }
    }
  }).then(sameCategory => {
    if (sameCategory) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: "分类名称已存在"
      })
      return Promise.reject();
    } else {
      return Category.update({
        _id: id
      }, {
          name: name
        })
    }
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: "修改成功",
      url: "/admin/category_index"
    })
  })
})
// 分类删除
router.get('/category_del', (req, res, next) => {
  let id = req.query.id;
  Category.remove({
    _id: id
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: "删除成功",
      url: "/admin/category_index"
    })
  })
})

// 内容
router.get('/content_index', (req, res, next) => {
  let page = Number(req.query.page || 1);
  let limit = 2;
  let pages = 0;
  Content.count().then(count => {
    pages = Math.ceil(count / limit);
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    let skip = (page - 1) * limit;
    Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['category', 'user']).then(contents => {
      console.log(contents)
      res.render('admin/content_index', {
        userInfo: req.userInfo,
        contents: contents,
        page: page,
        pages: pages,
        limit: limit,
        count: count,
        pageUrl:'/admin/content_index'
      })
    })
  })
})
// 内容添加
router.get('/content_add', (req, res, next) => {
  Category.find().then(categories => {
    res.render('admin/content_add', {
      userInfo: req.userInfo,
      categories: categories
    })
  })
})
router.post('/content_add', (req, res, next) => {
  Content.findOne({
    title: req.body.title,
    category: req.body.category
  }).then(rs => {
    if (rs) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: "已有相同标题"
      })
      return Promise.reject();
    } else {
      return new Content({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        user: req.userInfo.id.toString()
      }).save()
    }
  }).then((newContent) => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: "保存成功",
      url: '/admin/content_index'
    })
  })
})

// 内容修改
router.get('/content_edit', (req, res, next) => {
  let id = req.query.id || "";
  Content.findOne({
    _id: id
  }).then(content => {
    if (!content) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: "指定内容不存在"
      })
    } else {
      Category.find().then(categories => {
        res.render('admin/content_edit', {
          userInfo: req.userInfo,
          content: content,
          categories: categories
        })
      })
    }
  })
})

// 内容修改提交
router.post('/content_edit', (req, res, next) => {
  let id = req.query.id;
  Content.update({
    _id: id
  }, {
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content
  }).then(content=>{
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: "保存成功",
      url:"/admin/content_index"
    })
  })
})
// 内容删除
router.get('/content_del', (req, res, next)=>{
  let id = req.query.id || "";
  Content.remove({
    _id: id
  }).then(()=>{
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: "删除成功",
      url:"/admin/content_index"
    })
  })
})

module.exports = router;