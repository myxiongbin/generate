(function($) {
	
	$.ajaxjson = {
			post : function(para){
				var para = para || {};
				
				para = $.extend( {}, $.ajaxjson.defaults, para);
				
				var queryPara = JSON.stringify(para.queryPara); 
				if(para.encodeQueryPara){
					queryPara = encodeURIComponent(queryPara);
				}
				jQuery.ajax( {     
		            type : para.type,     
		            contentType : para.contentType,     
		            url : para.url,
		            data : queryPara,
		            async : para.async, 
		            dataType : para.dataType, 
		            success : function(data) {
						para.successFunc(data);               
		            }, 
		            beforeSend : function(jqXHR,settings) {
		            	para.beforeSend(jqXHR,settings);
		            },
		            complete: function(XHR, TS){
		            	para.complete(XHR, TS);
		            },
		            error : function(xmlHttpRequest, textStatus, errorThrown) {     
		            	//alert(xmlHttpRequest.status);
		                //alert(xmlHttpRequest.readyState);
		                //alert(textStatus);
		        	   	var text = ""+xmlHttpRequest.responseText;
		        	   	var arr =  text.split("__jsondata__");
		        	   	if(arr && arr.length==3){
		        	   		eval("var obj = "+arr[1]+";");
		        	   		obj.msg = decodeURIComponent(obj.msg)
		        	   		para.errorFunc(xmlHttpRequest, textStatus, errorThrown, obj);
		        	   	}else{
		        	   		para.errorFunc(xmlHttpRequest, textStatus, errorThrown, {code:-1, msg:'服务调用出错'});
		        	   	}
		           }
		        }); 
			},
			get : function(para){
				var para = para || {};
				
				para = $.extend( {}, $.ajaxjson.defaults, para);
				
				var queryPara = JSON.stringify(para.queryPara); 
				if(para.encodeQueryPara){
					queryPara = encodeURIComponent(queryPara);
				}
				jQuery.ajax( {     
		            type : para.type,     
		            contentType : para.contentType,     
		            url : para.url,
		            data : queryPara,
		            async : para.async, 
		            dataType : para.dataType, 
		            success : function(data) {
						para.successFunc(data);               
		            }, 
		            beforeSend : function(jqXHR,settings) {
		            	para.beforeSend(jqXHR,settings);
		            },
		            complete: function(XHR, TS){
		            	para.complete(XHR, TS);
		            },
		            error : function(xmlHttpRequest, textStatus, errorThrown) {     
		            	//alert(xmlHttpRequest.status);
		                //alert(xmlHttpRequest.readyState);
		                //alert(textStatus);
		        	   	var text = ""+xmlHttpRequest.responseText;
		        	   	var arr =  text.split("__jsondata__");
		        	   	if(arr && arr.length==3){
		        	   		eval("var obj = "+arr[1]+";");
		        	   		obj.msg = decodeURIComponent(obj.msg)
		        	   		para.errorFunc(xmlHttpRequest, textStatus, errorThrown, obj);
		        	   	}else{
		        	   		para.errorFunc(xmlHttpRequest, textStatus, errorThrown, {code:-1, msg:'服务调用出错'});
		        	   	}
		           }
		        }); 
			}
	}
	;
	function commonError(xmlHttpRequest, textStatus, errorThrown, msgObj){
		alert(msgObj.msg);
	}
	$.ajaxjson.defaults = $.extend({
		type : 'POST', //发送http类型 ： GET/POST
        contentType : 'application/json',  //发送 http 的 contentType    
        url : '',//url地址：必填
        queryPara : {}, //查询参数 
        dataType : 'json', //返回数据类型
        encodeQueryPara: true, // 是否使用 ： decodeURIComponent/encodeURIComponent
		successFunc: function(data){//成功回调函数
        },
        beforeSend : function(jqXHR,settings) {
        },
        complete: function(XHR, TS){
        },
        errorFunc: function(xmlHttpRequest, textStatus, errorThrown, msgObj){// 失败回调函数：msgObj:{ code , msg }
        	commonError(xmlHttpRequest, textStatus, errorThrown, msgObj);
        }
	});
})(jQuery);
