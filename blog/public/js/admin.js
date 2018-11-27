$(function(){
  function showToast(str) {
    var htmlStr = '<div class="toast"><div class="msg"><span>' + str + '</span></div></div>';
    $('body').append(htmlStr);
    $('.toast .msg').width($('.toast .msg span').width());
    setTimeout(function () {
      $('.toast').remove()
    }, 1200)
  }
  $('.cancel').click(function(){
    var id = $(this).attr('data-id');
    $.ajax({
      url:'/admin/user_index/cancel',
      type:"POST",
      data:{
        id:id
      },
      success:function(data){
        showToast(data.message)
        if(data.code == 200){
          setTimeout(function(){
            window.location.reload();
          },1000)
        }
      }
    })
  })
  $('.add').click(function(){
    var id = $(this).attr('data-id');
    $.ajax({
      url:'/admin/user_index/add',
      type:"POST",
      data:{
        id:id
      },
      success:function(data){
        showToast(data.message)
        if(data.code == 200){
          setTimeout(function(){
            window.location.reload();
          },1000)
        }
      }
    })
  })
})