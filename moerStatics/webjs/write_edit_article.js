$(document).ready(function(){
	var content = $("#article_content").html();
	//console.log(content);
	//初始创建编辑框
	//createKindEditor('authorArticle_content',content);
	//var editor = UE.getEditor('editor');
	//editor.setContent(content);
	editor.ready(function() {
	    editor.setContent(content);
	});
});

//保存修改
function saveArticle(){
	editor.execCommand( 'autotypeset' );
//	var content = ke.html();
	var content = editor.getContent();
	if(isEmpty($("#authorArticle_summary").val().replace(/ /gm,""))){
		MOER.alertError("请输入文章摘要！");
		return;
	}else if($("#authorArticle_summary").val().length>300){
		MOER.alertError("摘要不能超过300字！");
		return;
	}else if(content.replace(/ /gm,"")==''){
		MOER.alertError("请输入文章内容！");
		return;
	} 
	MOER.process();
	//过滤敏感词
	content = content.replace(/&nbsp;/g,"");
	if(isContainWords(content)){
		content=filterWord(content);
	}
	$("#authorArticle_summary").on('input propertychange',function(){
		//总长度300
		var maxlen = 300;
		//当前长度
		var nowlen = $(this).val().length;
		//剩余长度 
		var restlen = maxlen-nowlen;
		$("#authorArticle_summary_tip").css("text-indent","260px");
		$("#authorArticle_summary_tip").html("当前已输入"+nowlen+"个字符, 您还可以输入"+restlen+"个字符");
	});
	var articlepreview;
	var preview = content.substring(0,300)+"...";
    var img_index = preview.lastIndexOf('<img');
    if(img_index > 150){
        articlepreview = preview.substring(0, img_index)+"...";
    }else{
        articlepreview = preview;
    }
	var params ={
		authorArticle_content:content,
		authorArticle_summary:$("#authorArticle_summary").val(),
		authorArticle_id:$("#authorArticle_id").val(),
		authorArticle_preview:articlepreview
	};
	$.post('saveEdit.json',params,function(data){
		data = $.parseJSON(data);
		easyDialog.close();
		if(data.success==true){
			//跳转页面
			//location.reload();
			MOER.pubAlert('文章编辑成功！',3);
		}else{
			MOER.alertError(data.message);
		}
	});
}