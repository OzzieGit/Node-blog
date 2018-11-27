$(function () {
  var id = $('.comment input#contentId').val();
  var comments = [];
  var limit = 10;
  var pages = 0;
  var page = 1;
  var start = (page - 1) * limit;
  var end = start + limit;
  $.ajax({
    url: "/api/comment/all",
    data: {
      id: id
    },
    dataType: "json",
    success: function (data) {
      // console.log(data.data.comments)
      if (data.code == 200) {
        comments = data.content.comments.reverse();
        showComment();
      }
    }
  })
  // 评论
  $('.comment .submit').on('click', function () {
    var comment = $('.comment textarea').val();
    if (comment == "") {
      showToast("请输入评论内容")
    } else {
      $.ajax({
        url: "/api/comment/submit",
        type: "POST",
        data: {
          comment: comment,
          id: id
        },
        dataType: "json",
        success: function (data) {
          showToast(data.message)
          if (data.code == 200) {
            $('.comment textarea').val("");
            comments = data.content.comments.reverse();
            showComment();
          }
        }
      })
    }
  })
  // 上一页&&下一页
  $('.comment_pager').delegate('a', 'click', function () {
    if ($(this).parent().hasClass('prev')) { //上一页
      page--;
    } else {//下一页
      page++;
    }
    showComment()
  })
  function showComment() {
    if (comments.length == 0) {
      $('.comment_list').html('<li><p class="not">当前还没有评论~~</p></li>');
      $('.comment_pager').hide();

    } else {
      var htmlStr = "";
      pages = Math.ceil(comments.length / limit);
      if (page >= pages) {
        page = pages;
        $('.comment_pager .next').html('<span>没有了</span>')
      } else {
        $('.comment_pager .next').html('<a href="javascript:">下一页</a>')
      }
      if (page <= 1) {
        page = 1;
        $('.comment_pager .prev').html('<span>没有了</span>')
      } else {
        $('.comment_pager .prev').html('<a href="javascript:">上一页</a>')
      }
      start = (page - 1) * limit;
      end = Math.min(comments.length, start + limit);
      for (var i = start; i < end; i++) {
        htmlStr += '<li><div><span class="comment_user">' + comments[i].userName + '</span><span class="time">' + showDate(comments[i].time) + '</span></div><p>' + comments[i].comment + '</p></li>'
      }
      $('.comment_pager').show().find('.show_page').text(page + "/" + pages);
      $('.content .comment_count').text(comments.length);
      $('.comment .comment_count i').text(comments.length);
      $('.comment_list').html(htmlStr);
    }
  }
  function showDate(time) {
    var date = new Date(time);
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDay() + '日' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  }
  function showToast(str) {
    var htmlStr = '<div class="toast"><div class="msg"><span>' + str + '</span></div></div>';
    $('body').append(htmlStr);
    $('.toast .msg').width($('.toast .msg span').width());
    setTimeout(function () {
      $('.toast').remove()
    }, 1200)
  }
})