(function($) {
///////////////////////////扩展方法begin
	//title, url, id, resetData,width,height, maximized:false, forceRefresh:false, onBeforeClose:function(){}
	function _openWinp(para){//
			var needResetData = false;
			try{
				var t = $('#'+para.id);
				if(t.size()==0) throw e;
				var oldsrc = $('#'+para.id+'Iframe').attr('src');
				if(para.forceRefresh || oldsrc!=para.url){
					$('#'+para.id+'Iframe').attr('src',para.url);
				}else{
					needResetData = true;
				}
				t.winp('open');
			}catch(e){
				$('body').append('<div id="'+para.id+'" style="display: none;" ><iframe  id="'+para.id+'Iframe" src="'+para.url+'" width="100%" height="100%" frameborder="0"  /></div>');
				
				if(!para.width) para.width = 550;
				if(!para.height) para.height = 400;
				var bodywidth = $('body').width();
				var bodyheight = $('body').height();
				if(para.width>bodywidth) para.width = bodywidth;
				if(para.height>bodyheight) para.height = bodyheight;
				
				para.modal = true;
				para.closed = true;
				para.closable = true;
				para.minimizable = false;
				
				$('#'+para.id).show();
				$('#'+para.id).winp(para);
				$('#'+para.id).winp('open');
				
			}
			$('#'+para.id).show();
			$('#'+para.id).winp('open');
			
			if(needResetData){
				try{
					if(!para.resetData || para.resetData==null){
						//alert(window.frames[id+'Iframe'].contentWindow.dialogDataReset);
						document.getElementById(para.id+'Iframe').contentWindow.dialogDataReset();
					}else{
						document.getElementById(para.id+'Iframe').contentWindow.dialogDataReset(para.resetData);
					}
				}catch(e){}
			}
			
			var callbackFuncNameStr = "";
			if(para.callbackFuncNameStr && para.callbackFuncNameStr!=null){
				$('#'+para.id+'Iframe').attr(para.callbackFuncNameStr, para._keyStr);
				$('#'+para.id+'Iframe').attr("_workbus_callback", para._keyStr);
				eval("var karr = "+para._keyStr+";");
				//注册
				$.workbus._register(para.callbackFuncNameStr, karr.key.split(";"));
			}
	};
	$.winphelper = {
			/////////////////////////////扩展方法
			openWinp: function(para){// 自己打开
				_openWinp(para);
			},
			closeSelfByPreWinp: function(){ // 如果是winp，关闭自己
				var obj = $.workbus.getSelfIframe();
				if(obj!=null){
					try{
						var o = $(obj);
						var id = o.attr('id');
						var wzid = id.replace("Iframe", "");
						parent.$('#'+wzid).winp('close');
					}catch(e){}
				}
			}
	};
	//title, url, id, resetData(自动调用：dialogDataReset),width,height, maximized:false, forceRefresh:false, onBeforeClose:function(){}
	//还有一个回调函数名称： callbackFuncNameStr: 'callbackXXX'
	$.winphelper.defaults = $.extend( {}, $.fn.winp.defaults, {
		id:'', //必选 对话框的id
		url: '', //必选，对话框的url
		callbackFuncNameStr: null, //关闭对话框时要调用的回调函数(通过workbus调用时传入）
		forceRefresh: false, // 强行刷新url
		resetData: null, //更新数据
		_keyStr: null , //回调函数的 对象数据串，可以从workbus获得 ，或者通过workbus调用此方法  "{key:'key001;key002;key003',funcNameStr:'callbackFunc',level:1}"; 
	});
	
})(jQuery);
