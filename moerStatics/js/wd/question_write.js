// 监控input、textarea输入
//  (function($){
//    $.fn.watch = function(callback){
//      return this.each(function(){
//        //缓存以前的值
//        $.data(this,'originVal',$(this).val());
//        //event
//        $(this).on('keyup paste',function(){
//            var originVal = $(this,'originVal');
//            var currentVal = $(this).val();
//            if (originVal !== currentVal){
//              $.data(this,'originVal',$(this).val());
//              callback(currentVal);
//            };
//        });
//      });
//    };
//  })(jQuery);
  function validate(){
    var titleLength = $("#wdpopup-title").val().length;
		var titleLast = $("#wdpopup-title").val().charAt((titleLength-1));
		if(titleLast == "?" || titleLast == "？"){
			$("#wdpopup-title").siblings(".wdpopup-error").hide();
		}else{
			$("#wdpopup-title").siblings(".wdpopup-error").show();
			return false;
		}
  };
  $(document).on("blur","#wdpopup-title",function(){
    validate();
    var t = setTimeout(function(){
    	$(".wdpopup-dropdown").hide();
    },500);
  });
$(document).on("keyup paste","#wdpopup-title",function(){
	var titleLength = $("#wdpopup-title").val().length;
    var titleLast = $("#wdpopup-title").val().charAt((titleLength-1));
    if(titleLast == "?" || titleLast == "？"){
    	$(".wdpopup-dropdown").hide();
    	return false;
    }
	var relatedList = "";
	var tvalue = $(this).val();
	if(tvalue == ""){
		$(".wdpopup-dropdown").hide();
		return false;
	}
	$.post("searchQuestion.json",{"keyword":tvalue},function(data){
		data = eval('(' + data + ')');
		if(data.code == 0){
			$(".wdpopup-dropdown").show();
			var result =  data.result;
			if(result.length < 1){
				$(".wdpopup-dropdown").hide();
			}else{
				$.each(result,function(i){
					relatedList += "<li>";
					relatedList += "<a href='showQuestionDetail.htm?mQuestion_id="+ result[i].questionId +"'>";
					relatedList += result[i].questionTitle;
					if(result[i].answerCount != 0){
						relatedList += "<span>"+ result[i].answerCount +"个回答</span>";
					}
					relatedList += "</a></li>";
				});
				$("#wdpopup-dropdown").html(relatedList);
			}
		}else{
			$(".wdpopup-dropdown").hide();
		}
	});
});
//  $(document).on("watch","#wdpopup-problem",function(value){
//    $("#wdpopup-remainnum").html(10000-value.length);
//  });
  $(document).on("click","#wdpopup-list span",function(){
    if($(this).hasClass("select") == false){
      if($(this).siblings(".select").length < 5){
        $(this).addClass("select");
      }else{
        $(this).parent().next().show();
      }
    }else{
      $(this).removeClass("select");
      $(this).parent().next().hide();
    }
  });
  $(document).on("keyup paste","#wdpopup-stock",function(){
	  $.post('stock_findVstock.json','stockCode_code='+$(this).val(),function(data){
		if(!isEmpty(data)){
			data = $.parseJSON(data);
			var codes = "";
			if(data.length>0){
				$.each(data,function(i,n){
					codes+=("<li stockName='"+n.stockCode_name.trim()+"' stocknum='"+n.stockCode_no.trim()+"' id='stocknum_"+n.stockCode_no.trim()+"'>"+n.stockCode_name.trim()+"("+n.stockCode_no.trim()+")"+"</li>");
				});
				$("#wdpopup-select").html(codes);
				$(".wdpopup-select").show();
			}else{
				$("#wdpopup-select").html("");
				$(".wdpopup-select").hide();
			}
		}
	  });
  });
  $(document).on("click","#wdpopup-select li",function(){
    $(".wdpopup-select").hide();
    $("#wdpopup-stock").val("");
    if($("#wdpopup-span span").length < 10){
      $(this).remove();
      var stockNum = $(this).attr("stocknum");
      var stockName= $(this).attr("stockName");
      if(stockNum != ""){
    	  var flag=true;
    	$("#wdpopup-span span").each(function(i){
    			if($(this).attr("value")==stockNum){
    				flag=false;
    				MOER.alertError("这个股票已经添加",0.5);
    				return false;
    			}
    	 });
    	if(!flag){
    		return false;
    	}
        $("#wdpopup-span").append("<span value='" + stockNum + "'><u>" + stockName + "</u><i></i></span>");
      }
    }else{
      $("#wdpopup-span").next().show();
    }
  });
  $(document).on("click","#wdpopup-span span i",function(){
    $(this).parent().remove();
    $("#wdpopup-span").next().hide();
  });
	$(document).on("click","#wdpopup-submit",function(){
	  var mQuestion_id=$("#mQuestion_id").val();
	  var mQuestion_title = $("#wdpopup-title").val(); //标题
	  if(isContainWords(mQuestion_title)){
		  mQuestion_title = filterWord(mQuestion_title);
	  }
	  var mQuestion_description = wdpopupProblem.getContent(); //问题内容
	  if(isContainWords(mQuestion_description)){
		  mQuestion_description = filterWord(mQuestion_description);
	  }
	  var mQuestion_relatedStock="0"; //相关股票代码
	  var mQuestion_topicId = ""; //相关话题
	  var mQuestion_isAnonymous; //是否匿名
	  var length=$("#wdpopup-span span").length;
	  if(length>0){
	      mQuestion_relatedStock="";
	    $("#wdpopup-span span").each(function(i){
	      if(i === length - 1){
	        mQuestion_relatedStock+= $(this).attr("value");
	      }else{
	        mQuestion_relatedStock+= $(this).attr("value")+",";
	      }
	    });
	  }
	  var length=$("#wdpopup-list .select").length;
	  $("#wdpopup-list .select").each(function(i){
	    if (i === length - 1){
	      mQuestion_topicId += $(this).attr("topicId");
	    }else{
	      mQuestion_topicId += $(this).attr("topicId")+",";
	    }
	  });
	  if($("#wdpopup-anonymous").is(":checked")){
	    mQuestion_isAnonymous = 1;
	  }else{
	    mQuestion_isAnonymous = 0;
	  };
	  validate();
	  url="pubMQuestion.json";
	  $.ajax({url: url,
			async:false,
			dataType:'json',
			type: "POST",
			data:{'mQuestion_title':mQuestion_title,'mQuestion_id':mQuestion_id,'mQuestion_description':mQuestion_description,'mQuestion_relatedStock':mQuestion_relatedStock,'mQuestion_topicId':mQuestion_topicId,"mQuestion_isAnonymous":mQuestion_isAnonymous},
			success: function(data){
				if(data){
					if(data.rs.success==true) {
						window.location.href="showQuestionDetail.htm?mQuestion_id="+(data.questionId);
					}else{
						MOER.alertError(data.rs.message,1);
					}
				}
			}
		});
	});
  function saveMQuestionDraft(){
	  wdpopupProblem.execCommand('autotypeset');
	  var mQuestion_id=$("#mQuestion_id").val();
	  var mQuestion_title = $("#wdpopup-title").val(); //标题
	  var mQuestion_description = wdpopupProblem.getContent(); //问题内容
	  mQuestion_description = mQuestion_description.replace(/&nbsp;/g,""); 
	  mQuestion_description = mQuestion_description.replace(/(^＼s*)|(＼s*$)/g,"");
	  var mQuestion_relatedStock="0"; //相关股票代码
	  var mQuestion_topicId = ""; //相关话题
	  var mQuestion_isAnonymous; //是否匿名
	   
	  	var length=$("#wdpopup-span span").length;
	  	if(length>0){
	  		mQuestion_relatedStock="";
	  	  	$("#wdpopup-span span").each(function(i){
	  	  		if(i === length - 1){
	  	  			mQuestion_relatedStock+= $(this).attr("value");
	  	  		}else{
	  	  			mQuestion_relatedStock+= $(this).attr("value")+",";
	  	  		}
	  	    	
	  	    });
	  	}
	    var length=$("#wdpopup-list .select").length;
	    $("#wdpopup-list .select").each(function(i){
	    	if (i === length - 1){
	    		mQuestion_topicId += $(this).attr("topicId");
	    	}else{
	    		mQuestion_topicId += $(this).attr("topicId")+",";
	    	}
	    });
	    if($("#wdpopup-anonymous").is(":checked")){
	    	mQuestion_isAnonymous = 1;
	    }else{
	    	mQuestion_isAnonymous = 0;
	    };
	    url="saveMQuestionDraft.json";
	    $.ajax({url: url,
	     async:false,
	     dataType:'json',
	     type: "POST",
	     data:{'mQuestion_title':mQuestion_title,'mQuestion_id':mQuestion_id,'mQuestion_description':mQuestion_description,'mQuestion_relatedStock':mQuestion_relatedStock,'mQuestion_topicId':mQuestion_topicId,"mQuestion_isAnonymous":mQuestion_isAnonymous},
	     success: function(data){}});
  }

  $(document).on("click",".wdpopup-cancel,.wdpopup-off",function(){
	saveMQuestionDraft();
  	$("#question_writeLocation").empty();
  	$(".wdpopup").remove();
	UE.delEditor();
  });