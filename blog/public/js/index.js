$(function () {

  function showToast(str) {
    var htmlStr = '<div class="toast"><div class="msg"><span>' + str + '</span></div></div>';
    $('body').append(htmlStr);
    $('.toast .msg').width($('.toast .msg span').width());
    setTimeout(function () {
      $('.toast').remove()
    }, 1200)
  }

  var registerBox = $('.register_box');
  var loginBox = $('.login_box');
  var userBox = $('.user_box');
  // 切换到注册面板
  loginBox.find('a').on('click', function () {
    loginBox.hide();
    registerBox.show();
  })
  // 切换到登录面板
  registerBox.find('a').on('click', function () {
    registerBox.hide();
    loginBox.show();
  })
  // 注册
  registerBox.find('span').on('click', function () {
    var username = registerBox.find('input[name="username"]').val();
    var password = registerBox.find('input[name="password"]').val();
    var repassword = registerBox.find('input[name="repassword"]').val();
    if (username == "") {
      showToast("请输入用户名")
    } else if (password == "") {
      showToast("请输入密码")
    } else if (repassword == "") {
      showToast("请输入确认密码")
    } else if (password !== password) {
      showToast("输入密码不一致")
    } else {
      $.ajax({
        url: "/api/user/register",
        type: "POST",
        data: {
          username: username,
          password: password,
          repassword: repassword
        },
        dataType: "json",
        success: function (data) {
          showToast(data.message)
          if (data.code == 200) {
            setTimeout(function () {
              registerBox.find('input[name="username"]').val("");
              registerBox.find('input[name="password"]').val("");
              registerBox.find('input[name="repassword"]').val("");
              loginBox.find('input[name="username"]').val(username);
              loginBox.find('input[name="password"]').val(password);
              loginBox.show();
              registerBox.hide();
            }, 1200)
          }
        }
      })
    }
  })
  // 登录
  loginBox.find('span').on('click', function () {
    var username = loginBox.find('input[name="username"]').val();
    var password = loginBox.find('input[name="password"]').val();
    if (username == "") {
      showToast("请输入用户名")
    } else if (password == "") {
      showToast("请输入密码")
    } else {
      $.ajax({
        url: "/api/user/login",
        type: "POST",
        data: {
          username: username,
          password: password
        },
        dataType: "json",
        success: function (data) {
          showToast(data.message)
          if (data.code == 200) {
            setTimeout(function () {
              window.location.reload()
            }, 1200)
          }
        }
      })
    }
  })
  // 退出
  $('.logout').on('click', function () {
    $.ajax({
      url: '/api/user/logout',
      type: "GET",
      success: function (data) {
        showToast(data.message)
        if (data.code == 200) {
          setTimeout(function () {
            window.location.reload()
          }, 1000)
        }
      }
    })
  })
})