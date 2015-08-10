 // 评论块中 赞
  $(document).on("click",".comments-praise",(function(){
	  var This=$(this);
	  var answerId=$(this).attr("answerId");
    if($(this).attr("zan") == 0) {
    	url="saveMApplaudRel.json";
    	$.ajax({url: url,
    	   async:false, 
    	   dataType:'json',
    	   type: "POST",
    	   data:{'mApplaudRel_answerId':answerId,"type":"2"},
    	   success: function(data){
    	   if(data){
    	    if(data.rs.success==true) {
    	    	This.siblings("h5").children("em").html(data.appluadCount);
    	    	This.children("em").html("取消赞");
    	    	This.attr("zan",1);
    	    }else{
    	    	MOER.alertError(data.rs.message,1);
    	    	if(data.rs.errorCode==4){
    	  	    	This.children("em").html("取消赞");
        	    	This.attr("zan",1);
    	    	}
  
    	       }
    	   }
    	    }});
    }else{
    	url="deleteMApplaudRel.json";
    	$.ajax({url: url,
    	   async:false, 
    	   dataType:'json',
    	   type: "POST",
    	   data:{'mApplaudRel_answerId':answerId},
    	   success: function(data){
    	   if(data){
    	    if(data.rs.success==true) {
    	    	   This.siblings("h5").children("em").html(data.appluadCount);
    	    	   This.children("em").html("赞");
    	    	   This.attr("zan",0);
    	    }else{
    	    	MOER.alertError(data.rs.message,1);
    	    	if(data.rs.errorCode==4){
        	    	This.children("em").html("赞");
     	    	   	This.attr("zan",0);	
    	    	}
    	       }
    	   }
    	}});
    }
  }));
  //评论的回复按钮点下后显示回复弹窗
  $(document).on("click",".comments-reply",(function(){
	  if($(this).parent().parent(".wdcomments-cont").siblings(".wdcomments-text").length < 1){
		  $(this).parent().parent(".wdcomments-cont")
		  .after("<div class='wdcomments-text'><textarea></textarea><button class='comments-textbtn' type='button'>评论</button><a href='javascript:void(0)' id='comments-cancel'>取消</a></div>");
	  }
  }));
//弹窗的确定按钮
  $(document).on("click",".wdcomments-text .comments-textbtn",function(){
	  var This=$(this);
	  //获取相应参数
	  var replypara=$(this).parent().siblings(".wdcomments-cont").find(".comments-reply");
	  var mAnswer_mainAnswerId=replypara.attr("mAnswer_mainAnswerId");
	  var mAnswer_questionId=replypara.attr("mAnswer_questionId");
	  var mAnswer_replyUserId=replypara.attr("mAnswer_replyUserId");
	  var mAnswer_replyId=replypara.attr("mAnswer_replyId");
	  var mAnswer_content=$(this).siblings("textarea").val();
	  if(mAnswer_content==''){
		  MOER.alertError("评论内容不能为空",1);
		  return false;
	  }
	  var answerContent = $(this).parents(".wdfinal-right").find(".wdfinaldesc-cont").text();
      answerContent = answerContent.replace(/&nbsp;/g,"");

	  if(isContainWords(answerContent)){
		  answerContent = filterWord(answerContent);
	  }
      if(answerContent.length > 80){
    	  answerContent = answerContent.substring(0,80);
      }
	  //异步添加评论
	  url="saveAnswerComment.htm";
	$.post(url,{'mAnswer_mainAnswerId':mAnswer_mainAnswerId,'mAnswer_questionId':mAnswer_questionId,'mAnswer_replyUserId':mAnswer_replyUserId,'mAnswer_replyId':mAnswer_replyId,'mAnswer_content':mAnswer_content,'answerContent':answerContent},function(data){
		
		This.parent().parent(".wdcomments-list").after(data);
    	var commentNumerObj=This.parentsUntil(".wdfinal-body").find(".wdcontrol-comments").children("u");
    	commentNumerObj.html(parseInt(commentNumerObj.html())+1);
    	This.parent().remove();
	});

  });
  //评论的加载更多
  $(document).on("click",".wdcomments-more",function(){
	  var This=$(this);
	  var questionId=$(this).attr("mAnswer_questionId");
	  var mAnswer_mainAnswerId=$(this).attr("mAnswer_mainAnswerId");
	  var page=$(this).attr("page");
		//mAnswer_questionId mAnswer_mainAnswerId
  	$.post("showAnswerCommentForMainAnswerPageList.htm",{'mAnswer_questionId':questionId,'mAnswer_mainAnswerId':mAnswer_mainAnswerId,"page":page},function(data){
  		$(".wdlist-comments .wdcomments-list:last").after(data);
		This.remove();
  	}); 
  });
  //删除评论
  $(document).on("click",".comments-delete",function(){
	  var This=$(this);
	  var mAnswer_id=$(this).attr("answerId");
	  url="deleteAnswerComment.json";
	  $.ajax({url: url,
	   async:false,
	   dataType:'json',
	   type: "POST",
	   data:{'mAnswer_id':mAnswer_id},
	   success: function(data){
	   if(data){
	    if(data.success==true) {
	    	MOER.alertSuccess("删除评论成功", 1);
	    	//xiachao
	    	This.parent().parent().parent().remove();
	    }else{
	        MOER.alertError("出错了！", 1);
	       }
	   }
	  }});
  });
  