var dict_system_type=8000;
	
	/*
	* 打开对话框：传入div 和 url。注意，对话框要有默认重置函数：dialogDataReset();
	*/
	function dialogOpen(title, dialogDivStr, url, resetData,width,height){
		var needResetData = false;
		try{
			var t = $('#'+dialogDivStr);
			if(t.size()==0) throw e;
			var oldsrc = $('#'+dialogDivStr+'Iframe').attr('src');
			if(oldsrc!=url){
				$('#'+dialogDivStr+'Iframe').attr('src',url);
			}else{
				needResetData = true;
			}
			t.window('open');
		}catch(e){
			$('body').append('<div id="'+dialogDivStr+'" style="display: none;" ><iframe id="'+dialogDivStr+'Iframe" src="'+url+'" width="100%" height="100%" frameborder="0"  /></div>');
			
			if(!width) width = 550;
			if(!height) height = 400;
			var bodywidth = $('body').width();
			var bodyheight = $('body').height();
			if(width>bodywidth) width = bodywidth;
			if(height>bodyheight) height = bodyheight;
			
			$('#'+dialogDivStr).show();
			$('#'+dialogDivStr).window({
				iconCls:'icon-save',
				title: title,	
				width: width,height: height,
				modal: true,
				closed: true,
				closable: true,
				minimizable: false
			});
			$('#'+dialogDivStr).window('open');
		}
		$('#'+dialogDivStr).show();
		
		if(needResetData){
			try{
				if(!resetData || resetData==null){
					//alert(window.frames[dialogDivStr+'Iframe'].contentWindow.dialogDataReset);
					document.getElementById(dialogDivStr+'Iframe').contentWindow.dialogDataReset();
				}else{
					document.getElementById(dialogDivStr+'Iframe').contentWindow.dialogDataReset(resetData);
				}
			}catch(e){}
		}
	}
	//title, dialogDivStr, url, resetData,width,height, maximized:false, forceRefresh:false
	function dialogOpenByPara(para){
		para.url = para.url+(para.url.indexOf('?')!=-1?'&':'?')+"_divId="+para.dialogDivStr;
		//alert(para.url);
		var needResetData = false;
		try{
			var t = $('#'+para.dialogDivStr);
			if(t.size()==0) throw e;
			var oldsrc = $('#'+para.dialogDivStr+'Iframe').attr('src');
			if(para.forceRefresh || oldsrc!=para.url){
				$('#'+para.dialogDivStr+'Iframe').attr('src',para.url);
			}else{
				needResetData = true;
			}
			t.window('open');
		}catch(e){
			$('body').append('<div id="'+para.dialogDivStr+'" style="display: none;" ><iframe id="'+para.dialogDivStr+'Iframe" src="'+para.url+'" width="100%" height="100%" frameborder="0"  /></div>');
			
			if(!para.width) para.width = 550;
			if(!para.height) para.height = 400;
			var bodywidth = $('body').width();
			var bodyheight = $('body').height();
			if(para.width>bodywidth) para.width = bodywidth;
			if(para.height>bodyheight) para.height = bodyheight;
			
			$('#'+para.dialogDivStr).show();
			$('#'+para.dialogDivStr).window({
				iconCls:'icon-save',
				title: para.title,	
				width: para.width,height: para.height,
				modal: true,
				closed: true,
				closable: true,
				minimizable: false,
				maximized: para.maximized?para.maximized:false
			});
			$('#'+para.dialogDivStr).window('open');
		}
		$('#'+para.dialogDivStr).show();
		
		if(needResetData){
			try{
				if(!para.resetData || para.resetData==null){
					//alert(window.frames[dialogDivStr+'Iframe'].contentWindow.dialogDataReset);
					document.getElementById(para.dialogDivStr+'Iframe').contentWindow.dialogDataReset();
				}else{
					document.getElementById(para.dialogDivStr+'Iframe').contentWindow.dialogDataReset(para.resetData);
				}
			}catch(e){}
		}
	}
	//title, dialogDivStr, url, resetData,width,height, maximized:false, forceRefresh:false,titleIcon:'icon-save'
	function dialogOpenByParaNew(para){
		para.url = para.url+(para.url.indexOf('?')!=-1?'&':'?')+"_divId="+para.dialogDivStr;
		//alert(para.url);
		var needResetData = false;
		try{
			var t = $('#'+para.dialogDivStr);
			if(t.size()==0) throw e;
			var oldsrc = $('#'+para.dialogDivStr+'Iframe').attr('src');
			if(para.forceRefresh || oldsrc!=para.url){
				$('#'+para.dialogDivStr+'Iframe').attr('src',para.url);
			}else{
				needResetData = true;
			}
			t.winp('open');
		}catch(e){
			$('body').append('<div id="'+para.dialogDivStr+'" style="display: none;" ><iframe id="'+para.dialogDivStr+'Iframe" src="'+para.url+'" width="100%" height="100%" frameborder="0"  /></div>');
			
			if(!para.width) para.width = 550;
			if(!para.height) para.height = 400;
			var bodywidth = $('body').width();
			var bodyheight = $('body').height();
			if(para.width>bodywidth) para.width = bodywidth;
			if(para.height>bodyheight) para.height = bodyheight;
			
			$('#'+para.dialogDivStr).show();
			if(para.titleIcon == 'no'){
				$('#'+para.dialogDivStr).winp({
					title: para.title,	
					width: para.width,height: para.height,
					modal: true,
					closed: true,
					closable: true,
					minimizable: false,
					maximized: para.maximized?para.maximized:false
				});
			}else{
				$('#'+para.dialogDivStr).winp({
					iconCls:para.titleIcon||'icon-save',
					title: para.title,	
					width: para.width,height: para.height,
					modal: true,
					closed: true,
					closable: true,
					minimizable: false,
					maximized: para.maximized?para.maximized:false
				});
			}
			$('#'+para.dialogDivStr).winp('open');
		}
		$('#'+para.dialogDivStr).show();
		
		if(needResetData){
			try{
				if(!para.resetData || para.resetData==null){
					//alert(window.frames[dialogDivStr+'Iframe'].contentWindow.dialogDataReset);
					document.getElementById(para.dialogDivStr+'Iframe').contentWindow.dialogDataReset();
				}else{
					document.getElementById(para.dialogDivStr+'Iframe').contentWindow.dialogDataReset(para.resetData);
				}
			}catch(e){}
		}
	}
	/*
	 * 验证form的字段是否合法，结合jquery easy ui
	 */
	function validateJQForm(formjq) {
		if ($.fn.validatebox) {
			var box = $(".validatebox-text", formjq);
			if (box.length) {
				box.validatebox("validate");
				box.trigger("blur");
				var _21 = $(".validatebox-invalid:first", formjq).focus();
				return _21.length == 0;
			}
		}
		return true;
	}
	//拷贝对象
	function copyObj(obj, dest, pre){
		for(var name in obj){
			dest[pre+name] = obj[name];
		}
		return dest;
	}
	//刷新grid page
	function clearPageData(gridId){
		var opts = $('#'+gridId).datagrid('options');
		opts.pageNumber = 1;
		$('#'+gridId).datagrid('getPager').pagination({pageNumber:1});
	}
	//清空grid数据
	function clearGridData(gridId){
		$('#'+gridId).datagrid('loadData',{total:0,rows:[]});
	}
	//提示信息
	function showMsg(msg){
		var vtop = getTop();
		
		if(self!=vtop ){
			try{
			vtop.showMsg(msg);
			return ;
			}catch(e){}
		}

		$.messager.show({
				title:'信息',
				fit:true,
				msg:msg,
				timeout:5000,
				showType:'show'
		});

	}
	function showMsgNew(msg){
		var vtop = getTop();
		
		if(self!=vtop ){
			try{
				vtop.showMsgNew(msg);
				return ;
			}catch(e){}
		}
		
		$.winmess.show({
			title:'信息',
			fit:true,
			msg:msg,
			timeout:5000,
			showType:'show'
		});
		
	}
	function decorateLinkbutton(){
		$('a[decorateWait="true"]').linkbutton({});
		$('a[decorateWait="true"]').attr('decorateWait','false');
	}
	function decorateValidatebox(){
		$('input[decorateValidateboxWait="true"]').validatebox({});
		$('input[decorateValidateboxWait="true"]').attr('decorateValidateboxWait','false');
		$('select[decorateValidateboxWait="true"]').validatebox({});
		$('select[decorateValidateboxWait="true"]').attr('decorateValidateboxWait','false');
		$('textarea[decorateValidateboxWait="true"]').validatebox({});
		$('textarea[decorateValidateboxWait="true"]').attr('decorateValidateboxWait','false');
	}
	//不完善，会把全部msg关闭
	function closeMsg(){
		$('.messager-body').winp('close');
	}
	function alertMsg(msg){
		var vtop = getTop();
		if( self==vtop ){
			try{
				$.winmess.alert('信息',msg);
			}catch(e){ alert(msg); }
		}else{
			vtop.alertMsg(msg);
		}
	}
	//获取top对象
	function getTop(){
		return top;
	}
	//时间对象转换
	function Date2Str(d,isLong){
		if(!d || d==null) return "";
		if(typeof(d)=='string') return d;
		var dsp = "-";
		var tsp = ":";
		var ret = [];
		ret.push(d.getFullYear());
		ret.push(dsp);
		ret.push(("00"+(d.getMonth()+1)).slice(-2));
		ret.push(dsp);
		ret.push(("00"+d.getDate()).slice(-2));
		if(isLong){
			ret.push(" ");
			ret.push(("00"+d.getHours()).slice(-2));
			ret.push(tsp);
			ret.push(("00"+d.getMinutes()).slice(-2));
			ret.push(tsp);
			ret.push(("00"+d.getSeconds()).slice(-2));
		}
		return ret.join('');
	}
	function longDate2StrAll(timeStr){
		return (new Date(timeStr)).pattern("yyyy-MM-dd HH:mm:ss.S");
	}
	function longDate2Str(timeStr){
		return (new Date(timeStr)).pattern("yyyy-MM-dd");
	}
	function longDate2StrH(timeStr){
		return (new Date(timeStr)).pattern("yyyy-MM-dd HH");
	}
	function longDate2StrHM(timeStr){
		return (new Date(timeStr)).pattern("yyyy-MM-dd HH:mm");
	}
	
	// 展开或收缩
	function __expand(eastContentWidth) {
		var eastWidth = $("body").layout("panel","east").panel().width();
		var centerWidth = $("body").layout("panel","center").panel().width();		
		//alert("c:" + centerWidth + " e:" + eastWidth);
		
		if (eastWidth <= 1) {
			$("body").layout("panel", "east").panel("resize", {
				width: eastContentWidth,
				left: centerWidth - eastContentWidth
			});
			$("body").layout("panel", "center").panel("resize", {
				width: centerWidth - eastContentWidth
			});
		} else {
			$("body").layout("panel", "east").panel("resize", {
				width: 1,
				left: centerWidth + eastWidth
			});
			$("body").layout("panel", "center").panel("resize", {
				width: centerWidth + eastWidth
			});
		}
		$("body").layout("resize");
	};
	//打开右侧区域
	function openBodyEast(eastContentWidth) {
		//__expand(eastContentWidth);
		var eastWidth = $("body").layout("panel","east").panel().width();
		var centerWidth = $("body").layout("panel","center").panel().width();		
		$("body").layout("panel", "east").panel("resize", {
			width: eastContentWidth,
			left: centerWidth - eastContentWidth
		});
		$("body").layout("panel", "center").panel("resize", {
			width: centerWidth - eastContentWidth
		});
		$("body").layout("resize");
	}
	//关闭右侧区域
	function closeBodyEast() {
		//__expand(null);
		var eastWidth = $("body").layout("panel","east").panel().width();
		var centerWidth = $("body").layout("panel","center").panel().width();	
		
		$("body").layout("panel", "east").panel("resize", {
			width: 1,
			left: centerWidth + eastWidth
		});
		$("body").layout("panel", "center").panel("resize", {
			width: centerWidth + eastWidth
		});
		
		$("body").layout("resize");
	}
	
	//关联表，-》下来菜单
	//	input -> select
	//[rel_1]rel zone
	function resetSingleSelectRelVal(tagetIdName,value){
		var tagetIdNameReplaced = tagetIdName.replace(':','\\:')
		var targetIdObj = $('#'+tagetIdNameReplaced);
		targetIdObj.val(value);
		$('#'+tagetIdNameReplaced+'_select').val(targetIdObj.val());
	}
	//functionName dwr调用方法 如  SmUserDwrCtrl.queryByArgs
	//fcQueryParam dwr 方法的参数
	//idFieldName nameFieldName ，dwr返回的model，对象里面，select需要的 key 和value。。//如  idFieldName=seqId,nameFieldName=loginName
	//tagetIdNameList select的id列表，因为可以同时添加多个select
	//isShowAllList 是否显示 ---请选择---， 值为 true or fasle
	//initValueArr 初始化的值id列表
	function initSingleSelectRel(functionName,fcQueryParam,idFieldName,nameFieldName,tagetIdNameList,isShowAllList,initValueArr){
		for(var j=0;j<tagetIdNameList.length;j++){
			if(tagetIdNameList[j]==null || tagetIdNameList[j]=='')continue;
			var tagetIdName = tagetIdNameList[j];
			var tagetIdNameReplaced = tagetIdName.replace(':','\\:');
			var targetIdObj = $('#'+tagetIdNameReplaced);
			var selectVal = $('#'+tagetIdNameReplaced+'_select').val();
			if(""+selectVal =="undefined"){ 
				var dis = targetIdObj.attr("disabled");
				//style="width:98%"
				targetIdObj.after('<select '+(dis?'disabled':'')+' id="'+tagetIdName+'_select"   onChange="javascript:selectChange(\''+tagetIdName+'\')"></select>');
				targetIdObj.hide();
			}
		}
		eval(functionName)(fcQueryParam,function(list){
			for(var j=0;j<tagetIdNameList.length;j++){
				var tagetIdNameReplaced = tagetIdNameList[j].replace(':','\\:');
				var targetIdObj_select = $('#'+tagetIdNameReplaced+'_select');
				var targetIdObj = $('#'+tagetIdNameReplaced);
				targetIdObj_select.html('');
				var tmpstr = [];
				if(isShowAllList[j])
					tmpstr.push('<option value="">---请选择---</option>');
				for(var i=0;i<list.length;i++){
					tmpstr.push('<option value="'+eval("list[i]."+idFieldName)+'" '+(!isShowAllList[j]&&i==0?"selected":"")+' >'+eval("list[i]."+nameFieldName)+'</option>');
					if(!isShowAllList[j]&&i==0){
						targetIdObj.val(eval("list[i]."+idFieldName) );
					}
				//	alert('<option value="'+eval("list[i]."+idFieldName)+'"   '+(!isShowAllList[j]&&i==0?"selected":"")+' >'+eval("list[i]."+nameFieldName)+'</option>');
				}
				targetIdObj_select.append(tmpstr.join(''));
				targetIdObj_select.change(  function() { 
					//var oldTagName = this.id.substring(0,this.id.length - '_select'.length);
					//$('#'+oldTagName.replace(':','\\:')).val(this.value);
					//targetIdObj.val(targetIdObj_select.val());
					targetIdObj.val(targetIdObj_select.val());
				}); 
				//init value
				if(initValueArr && initValueArr.length == tagetIdNameList.length){
					targetIdObj.val(initValueArr[j]);
					targetIdObj_select.val(initValueArr[j]);
				}else{
					targetIdObj_select.val(targetIdObj.val());
				}
			}
		});
	}
	function selectChange(tagetIdName)
	{
		var tagetIdNameReplaced = tagetIdName.replace(':','\\:')
		var targetIdObj = $('#'+tagetIdNameReplaced);
		var selectVal= $('#'+tagetIdNameReplaced+'_select').val();
		targetIdObj.val(selectVal);
	}
	//[rel_1] end
	
	/////////////图片详细信息
	function _showImagesDialogClose(){
		var dialogDivStr = "showImages__";
		$('#'+dialogDivStr).winp('close')
	}
	function per_showImagesDialog(){
		
	}
	function next_showImagesDialog(){
		
	}
	//展现图片
	function showImages(url,smallurl,width,height){
		var dialogDivStr = "showImages__";
		var imgId = "showImages__imgId";
		var layoutDivId = "showImages__layoutDivId";
		try{
			var t = $('#'+dialogDivStr);
			if(t.size()==0) throw e;
			$('#'+imgId).attr('src',smallurl);
			t.winp('open');
		}catch(e){
			$('body').append('<div id="'+dialogDivStr+'" style="display: none;padding-top:5px;padding-left: 5px;padding-right: 5px;" >'
					+'<div id="'+layoutDivId+'" class="easyui-layout" fit="true"><div align="center" region="center" border="false" style="padding:10px;background:#fff;border:1px solid #ccc;">'
					+'<img id="'+imgId+'" width="500" src="'+smallurl+'" />'
					+'</div><div region="south" border="false" style="text-align:center;height:30px;line-height:30px;padding-top:3px;">'
					+'<a class="easyui-linkbutton" decorateWait="true" href="javascript:void(0)" onclick="javascript:per_showImagesDialog();">上一张</a>'
					+'<a class="easyui-linkbutton" decorateWait="true" href="javascript:void(0)" onclick="javascript:next_showImagesDialog();">下一张</a>'
					+'<a class="easyui-linkbutton" decorateWait="true" iconCls="icon-cancel" href="javascript:void(0)" onclick="javascript:_showImagesDialogClose();">关闭</a>'
					+'</div>'
					+'</div>'
					+'</div>');
			
			if(!width) width = 600;
			if(!height) height = 470;
			var bodywidth = $('body').width();
			var bodyheight = $('body').height();
			if(width>bodywidth) width = bodywidth;
			if(height>bodyheight) height = bodyheight;
			
			$('#'+dialogDivStr).show();
			$('#'+dialogDivStr).winp({
				iconCls:'icon-save',
				title: "图片",	
				width: width,height: height,
				modal: true,
				closed: true,
				closable: true,
				minimizable: false
			});
			$('#'+dialogDivStr).winp('open');
		}
		$('#'+dialogDivStr).show();
		setTimeout(function(){
			$('#'+imgId).attr('src',url);
		},1);
		decorateLinkbutton();
		$('#'+layoutDivId).layout({});
	}
	/////////////////
	
	/*
	function queryData(url,para,loadDataFunc){
		jQuery.ajax( {     
            type : 'POST',     
            contentType : 'application/json',     
            url : url,
            data : JSON.stringify(para),     
            dataType : 'json', 
            success : function(data) {
				loadDataFunc(data);                      
            },     
            error : function(xmlHttpRequest, textStatus, errorThrown) {     
	           	 //alert(xmlHttpRequest.status);
	                //alert(xmlHttpRequest.readyState);
	                //alert(textStatus);
	           	var text = ""+xmlHttpRequest.responseText;
	           	var arr =  text.split("__jsondata__");
	           	if(arr && arr.length==3){
	           		eval("var obj = "+arr[1]+";");
	           		alert(decodeURIComponent(obj.msg));
	           	}else{
	           		alert("服务调用出错");
	           	}
           }     
        }); 
	}
	function postAddData(url,para, callback){
		//alert(JSON.stringify(para));
		jQuery.ajax( {     
            type : 'POST',     
            contentType : 'application/json',     
            url : url,
            data :  JSON.stringify(para),     
            dataType : 'json', 
            success : function(data) {
				callback(data);                      
            },     
            error : function(xmlHttpRequest, textStatus, errorThrown) {     
            	 //alert(xmlHttpRequest.status);
                 //alert(xmlHttpRequest.readyState);
                 //alert(textStatus);
            	var text = ""+xmlHttpRequest.responseText;
            	var arr =  text.split("__jsondata__");
            	if(arr && arr.length==3){
            		eval("var obj = "+arr[1]+";");
            		alert(decodeURIComponent(obj.msg));
            	}else{
            		alert("服务调用出错");
            	}
            }
        }); 
	}
	*/
	

/* add by zb 20121213 start */
	/**
	 * 打开winp对话框
	 * @param field 标识ID
	 * @param url iframe的url路径
	 * @param para winp的初始化参数
	 */
	function openDialog(field, url, para) {
		var iframe = $("<iframe/>", {
			src : url,
			width : "100%",
			height : "100%",
			frameborder : 0
		});
		if (!$("#" + field).length) {
			$("<div/>", {id : field}).addClass("dialog-content").html(iframe).appendTo("body");
			$("#" + field).winp(para);
		} else {
			$("#" + field).find("iframe").attr("src", url);
			$("#" + field).winp("open");
		}
	}
	/**
	 * 关闭winp对话框
	 * @param field 标识ID，省略“#”
	 * @return
	 */
	function closeDialog(field) {
		$("#" + field).winp("close");
	}
/* add by zb 20121213 end */
	
	/**
	 * 工作区全屏
	 * @param id link-button按钮标识
	 * @param EW east展开后的宽度
	 * @param WW west展开后的宽度
	 * @param SH south展开后的高度
	 * @param NH north展开后的高度
	 * @return
	 */
	function workzoneFullScreen(id, EW, WW, SH, NH) {
		/* 获取东西南部四个对象 */
		var east = $("body").layout("panel", "east");
		var west = $("body").layout("panel", "west");
		var south = $("body").layout("panel", "south");
		var north = $("body").layout("panel", "north");
		
		if (east.panel().width() > 1 || west.panel().width() > 1 || north.panel().height() > 1 || south.panel().height() > 1) {
			east.panel("resize", {width: 0.1});
			west.panel("resize", {width: 1});
			south.panel("resize", {height: 0.1});
			north.panel("resize", {height: 0.1});
			$("#" + id).find("span.l-btn-text").text("退出全屏");
		} else {
			east.panel("resize", {width: EW});
			west.panel("resize", {width: WW});
			south.panel("resize", {height: SH});
			north.panel("resize", {height: NH});
			$("#" + id).find("span.l-btn-text").text("全屏");
		}
		//expandLeftMenuBar(1, WW);
		$("body").layout("resize");
	};