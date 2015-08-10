$(document).ready(function(){

  // Start 修改分类标签
  $("#modifyLabel").click(function(){
    $(".wdmodify-head span").remove();
    $(".wdfinal-class a").each(function(n){
      $("#wdcomplete-label").before("<span value='" + $(this).attr('value') + "'>"+ $(this).attr('value') +"<i></i></span>");
    });
    $("#wdmodify-class").show();
    $(".wdfinal-head").hide();
  })
  $("#wdmodify-labels span").click(function(){
    if($(this).hasClass("select") == true){
      return false;
    }
    if($(".wdmodify-head span").length < 5 ){
      $("#wdcomplete-label").before("<span value='" + $(this).attr('value') + "'>"+ $(this).attr('value') +"<i></i></span>");
      $(this).addClass("select");
    }else{
      if($(".wdmodify-head p.font-red").length < 1){
        $("#wdcomplete-label").after("<p class='font-red'>标签数量不能超过5个</p>");
      }
    }
  })
  $(document).on("click",".wdmodify-head span i",function(){
    $("#wdmodify-labels span[value="+ $(this).parent().text() +"]").removeClass("select");
    $("#wdcomplete-label").siblings(".font-red").remove();
    $(this).parent().remove();
  })
  $("#wdcomplete-label").click(function(){
    $(".wdfinal-class").html("");
    $(".wdmodify-head span").each(function(){
      $(".wdfinal-class").append("<a href='' value='" + $(this).attr('value') + "'>" + $(this).attr('value') + "</a>")
    })
    $("#wdmodify-class").hide();
    $(".wdfinal-head").show();
  })
  // End 修改分类标签

  // Start 修改标题
  $("#modifyTitle").click(function(){
    $("#wdmodify-title textarea").html($(".wdfinal-title h1").text());
    $(".wdfinal-title").hide();
    $("#wdmodify-title").show();
  })
  $("#wdcomplete-title").click(function(){
    $(".wdfinal-title h1 a").html($("#wdmodify-title textarea").val());
    $(".wdfinal-title").show();
    $("#wdmodify-title").hide();
  })
  // End 修改标题

  $(".htpraise").click(function(){
    if($(this).hasClass("select") == false){
      $(this).addClass('select');
    }else{
      return false;
    }
  })
  $(".wdfinal-left .htdown").click(function(){
    if($(this).siblings().hasClass("select") == true){
      $(this).siblings().removeClass("select");
    }
  })
});