(function($) {
	var docsArray = null;// 数组的数组 下标 0self --》以此类推
	var iframeKeyArray = [];
	var registerKeyArray = [];//注册方法 {funcNameStr: funcNameStr, keyArr: keyArr}
	/*
	 * 获取top到iframe的docuemnt对象，放入docsArray中，同时获取iframeKeyArray的key路径列表
	 */
	function getDocs(){
		if(docsArray!=null) return docsArray;
		
		docsArray = [];
		
		var _curr = self;
		docsArray.push(_curr);
		while(true){
			var _oldcurr = _curr;
			_curr = _curr.parent;
			docsArray.push(_curr);
			
			var myiframeid = null;
			var list = _curr.document.getElementsByTagName("iframe");
			for (var i = 0; list && list!=null && i < list.length; i++) {
				var iframeobj = null;
				try{
					iframeobj = list[i].contentWindow;
				}catch(e){
					alert('无法使用总线，list[i].contentWindow出错');
				}
				if(_oldcurr == iframeobj){
					var key = list[i].getAttribute("workbus_key");
					if(!key || key==null){
						key = "workbus_key_"+getRandomKey();
						list[i].setAttribute("workbus_key", key);
					}
					iframeKeyArray.push(key);
				}
			}
			if(_curr == top){
				break;
			}
		}
		
		return docsArray;
	};
	/*
	 * 获取parent的obj
	 */
	function getParent(level) {
		var temp = getDocs();
		// 不传参数则直接返回parent
		if (!level) {
			level = 100;
		}
		return temp[temp.length - level < 0 ? 1 : temp.length - level];	// 0为自己1为parent
	};
	/*
	 * 提供服务到 parent
	 */
	function methodSupplyToParent(funcNameStr, level){
		var obj = getParent(level);
		var tmpArr =  getParentIframeKeyArray(level);
		obj.$.workbus._register(funcNameStr, tmpArr);
		return tmpArr;
	};
	/*
	 * 提供服务到 parent 时的 iframe arr
	 */
	function getParentIframeKeyArray(level){
		var temp =  getDocs();
		
		var tmpArr = [];
		for(var i=iframeKeyArray.length -level ; i>=0; i--){
			tmpArr.push(iframeKeyArray[i]);
		}
		return tmpArr;
	};
	/*
	 * 调用注册服务（方法）
	 * para.callbackFuncNameStr 如果有，则一定有 para._keyStr
	 */
	function _invokeRegisterMethod(funcNameStr, para, key){
		
		//alert(funcNameStr+" "+para+" "+key+" "+registerKeyArray);
		var invoked = 0;
		for(var i=0; i< registerKeyArray.length; i++){
			if(registerKeyArray[i].funcNameStr == funcNameStr){
				
				var arr = registerKeyArray[i].keyArr;
				
				if(key && ""+key !="undefined"){
					if(key != arr.join(';')){
						continue;
					}
				}
				
				try{
					// invoke
					//递归调用
					var objs = __invokeMethodArr(arr, 0 , self, null);
					var obj = objs[0];
					
					//注册回调函数
					if(para && para.callbackFuncNameStr && ""+para.callbackFuncNameStr!="undefined" && para.callbackFuncNameStr!=null){
						eval("var pobj = "+para._keyStr+";");
						register(para.callbackFuncNameStr, pobj.key.split(";"));
						//写入回调信息到iframe
						if(objs[1] && objs[1]!=null){
							setInvokeKeyObjToJobj(para.callbackFuncNameStr, $(objs[1]), para._keyStr);
							setInvokeKeyObjToJobj("_workbus_callback", $(objs[1]), para._keyStr);
						}
					}
					
					if(para && ""+para!="undefined" && para!=null){
						eval("obj."+funcNameStr+"(para);");
					}else{
						eval("obj."+funcNameStr+"();");
					}
				}catch(e){}
				
				//break;
				invoked ++;
			}
		}
		if(invoked==0){
			alert('没有找到注册服务：'+funcNameStr);
		}
	};
	/*
	 * 递归调用，获取方法的使用对象，[ document, iframeobj]
	 */
	function __invokeMethodArr(keyArr, index, obj, iframeobj){
		if(!keyArr || keyArr==null || keyArr.length ==0){
			return [obj, iframeobj];
		}
		if(keyArr.length <= index) return [obj, iframeobj];
		
		var list = obj.document.getElementsByTagName("iframe");
		for (var i = 0; list && list!=null && i < list.length; i++) {
			
			var obj2 = null;
			try{
				obj2 = list[i].contentWindow;
			}catch(e){
				alert('无法使用总线，list[i].contentWindow出错');
			}
			var key = list[i].getAttribute("workbus_key");
			if(!key || key==null){
				continue;
			}
			
			if(key == keyArr[index]){
				index++;
				//递归调用
				return __invokeMethodArr(keyArr, index, obj2, list[i]);
			}
		}
		//没有取到
		return [obj, iframeobj];
	};
	/*
	 * 注册一个方法
	 */
	function register(funcNameStr, keyArr){
		//alert("register(funcNameStr, keyArr):"+funcNameStr +"  "+ keyArr.join(','));
		for(var i=0; i<registerKeyArray.length; i++){
			if(funcNameStr ==registerKeyArray[i].funcNameStr && registerKeyArray[i].keyArr.join('')==keyArr.join('')){
				return ;
			}
		}
		registerKeyArray.push({funcNameStr: funcNameStr, keyArr: keyArr});
	};
	/*
	 * 获取自己的iframe对象，如果是top则为null
	 */
	function getSelfIframe(){
		if(self == top ) return null;
		var list = parent.document.getElementsByTagName("iframe");
		for (var i = 0; list && list!=null && i < list.length; i++) {
			var iframeobj = null;
			try{
				iframeobj = list[i].contentWindow;
			}catch(e){
				alert('无法使用总线，list[i].contentWindow出错');
			}
			if(iframeobj == self){
				return list[i];
			}
		}
		alert("没有找到自己的iframe元素");
		return null;
	};
	function getRandomKey(){
		return Math.random()*(100000000000000-1)+1;
	};
	//从指定级别，获取调用的 key 的字符串，用分号隔开
	function getKeyStrToParent(callbackFuncNamsStr, level){
		return callbackFuncNamsStr = "{key:'"+getParentIframeKeyArray(level).join(";")+"',funcNameStr:'"+callbackFuncNamsStr+"',level:"+level+"}";;
	};
	function getInvokeKeyObjFromJobj(funcNameStr, jobj){//获取元素上的key对象
		var objstr = jobj.attr(funcNameStr==null?"_workbus_callback":funcNameStr);
		if(objstr && objstr!=null){
			eval("var p = "+objstr+";");
			return p;
		}
		return null;
	};
	function setInvokeKeyObjToJobj(funcNameStr, jobj, keyStr){//赋值 keystr 到元素上
		jobj.attr(funcNameStr, keyStr);
	};
	///////////////////////////扩展方法begin
	//title, url, id, resetData,width,height, maximized:false, forceRefresh:false, onBeforeClose:function(){}
	function _openWinp(obj, para, level,keyArray ){//
			var needResetData = false;
			try{
				var t = obj.$('#'+para.id);
				if(t.size()==0) throw e;
				var oldsrc = obj.$('#'+para.id+'Iframe').attr('src');
				if(para.forceRefresh || oldsrc!=para.url){
					obj.$('#'+para.id+'Iframe').attr('src',para.url);
				}else{
					needResetData = true;
				}
				t.winp('open');
			}catch(e){
				obj.$('body').append('<div id="'+para.id+'" style="display: none;" ><iframe  id="'+para.id+'Iframe" src="'+para.url+'" width="100%" height="100%" frameborder="0"  /></div>');
				
				if(!para.width) para.width = 550;
				if(!para.height) para.height = 400;
				var bodywidth = obj.$('body').width();
				var bodyheight = obj.$('body').height();
				if(para.width>bodywidth) para.width = bodywidth;
				if(para.height>bodyheight) para.height = bodyheight;
				
				var winppara = {
						iconCls:'icon-save',
						title: para.title,	
						width: para.width,height: para.height,
						modal: true,
						closed: true,
						closable: true,
						minimizable: false,
						maximized: para.maximized?para.maximized:false
					};
				if(para.onBeforeClose && para.onBeforeClose!=null){
					winppara.onBeforeClose = para.onBeforeClose;
				}
				
				obj.$('#'+para.id).show();
				obj.$('#'+para.id).winp(winppara);
				obj.$('#'+para.id).winp('open');
			}
			obj.$('#'+para.id).show();
			
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
			
			var callbackFuncNamsStr = "";
			if(para.callbackFuncNamsStr && para.callbackFuncNamsStr!=null){
				callbackFuncNamsStr = "{key:'"+keyArray.join(";")+"',funcNameStr:'"+para.callbackFuncNamsStr+"',level:"+level+"}";
				obj.$('#'+para.id+'Iframe').attr(para.callbackFuncNamsStr, callbackFuncNamsStr);
				//注册
				obj.$.workbus._register(para.callbackFuncNamsStr, keyArray);
			}
	};
	///////////////////////////扩展方法end
	$.workbus = {
			//调用端
			getTop : function(){
				return getParent(1);
			},
			getWorkzone: function(){
				return getParent(2);
			},
			getParent: function(level){// level==1 getTop ;level==2 getWorkzone
				if(level<1) level = 1;
				return getParent(level);
			},
			methodSupplyToTop: function(funcNameStr){// 返回iframe 的key 路径，从顶往下。
				return methodSupplyToParent(funcNameStr, 1);
			},
			methodSupplyToWorkzone: function(funcNameStr){
				return methodSupplyToParent(funcNameStr, 2);
			},
			methodSupplyToParent: function(funcNameStr, level){
				if(level<1) level = 1;
				return methodSupplyToParent(funcNameStr, level);
			},
			invokeRegisterMethodFromTop: function(funcNameStr, para, keyStr){// para为调用参数， 没有参数可以为空null ,或者不传, (唯一键)keyStr ;串，可以不传
				//有回调，必须绑定，并声称_keyStr
				if(para && para.callbackFuncNameStr && ""+para.callbackFuncNameStr!="undefined" && para.callbackFuncNameStr!=null){
					para._keyStr = getKeyStrToParent(para.callbackFuncNameStr,1);
				}
				getParent(1).$.workbus._invokeRegisterMethod(funcNameStr, para, keyStr);
			},
			invokeRegisterMethodFromWorkzone: function(funcNameStr, para, keyStr){// para为调用参数， 没有参数可以为空null ,或者不传
				//有回调，必须绑定，并声称_keyStr
				if(para && para.callbackFuncNameStr && ""+para.callbackFuncNameStr!="undefined" && para.callbackFuncNameStr!=null){
					para._keyStr = getKeyStrToParent(para.callbackFuncNameStr,2);
				}
				getParent(2).$.workbus._invokeRegisterMethod(funcNameStr, para, keyStr);
			},
			invokeRegisterMethod: function(level, funcNameStr, para, keyStr){// para为调用参数， 没有参数可以为空null ,或者不传
				//有回调，必须绑定，并声称_keyStr
				if(para && para.callbackFuncNameStr && ""+para.callbackFuncNameStr!="undefined" && para.callbackFuncNameStr!=null){
					para._keyStr = getKeyStrToParent(para.callbackFuncNameStr,level);
				}
				getParent(level).$.workbus._invokeRegisterMethod(funcNameStr, para, keyStr);
			},
			getInvokeKeyObjFromJobj: function(funcNameStr, jobj){//获取元素上的key对象看
				return getInvokeKeyObjFromJobj(funcNameStr, jobj);
			},
			setInvokeKeyObjToJobj: function(funcNameStr, jobj, keyStr){//设置key串到 obj上
				return setInvokeKeyObjToJobj(funcNameStr, jobj, keyStr);
			},
			invokeCallBackMethodFromPreIframe: function(funcNameStr, para){// 回调函数  para为调用参数， 没有参数可以为空null ,或者不传
				var iframeobj = getSelfIframe();
				var jobj = $(iframeobj);
				var keyObj = getInvokeKeyObjFromJobj(funcNameStr, jobj);
				if(keyObj!=null){
					getParent(keyObj.level).$.workbus._invokeRegisterMethod(keyObj.funcNameStr, para, keyObj.key);
				}
			},
			invokeCallBackMethodFromPreIframeDefault: function(para){// 使用默认函数名称， 回调函数  para为调用参数， 没有参数可以为空null ,或者不传
				var iframeobj = getSelfIframe();
				var jobj = $(iframeobj);
				var keyObj = getInvokeKeyObjFromJobj("_workbus_callback", jobj);
				if(keyObj!=null){
					getParent(keyObj.level).$.workbus._invokeRegisterMethod(keyObj.funcNameStr, para, keyObj.key);
				}
			},
			getSelfIframe: function(){ // iframe 的 docuemnt.getElementById对象
				//如果需要jquery对象  $(obj) 包装一下即可
				return getSelfIframe();
			},
			getKeyStrToTop: function(callbackFuncNamsStr){// 获取key的str串，分号
				return getKeyStrToParent(callbackFuncNamsStr, 1)
			},
			getKeyStrToWorkzone: function(callbackFuncNamsStr){// 获取key的str串，分号
				return getKeyStrToParent(callbackFuncNamsStr, 2)
			},
			getKeyStrToParent: function(callbackFuncNamsStr, level){// 获取key的str串，分号
				return getKeyStrToParent(callbackFuncNamsStr, level);
			},
			getTopIframeKeyArray: function(){
				return getParentIframeKeyArray(level);
			},
			getWorkzoneIframeKeyArray: function(){
				return getParentIframeKeyArray(level);
			},
			getSelfIframeKeyArray: function(){
				return getParentIframeKeyArray(level);
			},
			getPreIframeKeyArray: function(){
				return getParentIframeKeyArray(level);
			},
			getParentIframeKeyArray: function(level){
				return getParentIframeKeyArray(level);
			},
			//////////////////////宿主端
			//注册到公共通道
			_register: function(funcNameStr, keyArr){
				if(!keyArr || keyArr == null ) {
					alert("keyArr不存在");
				}
				register(funcNameStr, keyArr);
			},
			_invokeRegisterMethod: function(funcNameStr, para, keyStr){// para为调用参数， 没有参数可以为空null ,或者不传
				_invokeRegisterMethod(funcNameStr,para, keyStr);
			},
			//获取以注册服务的列表
			getRegisterArray: function(){
				return registerKeyArray;
			},
			/////////////////////////////扩展方法
			//对话框的参数：title, url, id, resetData,width,height, maximized:false, forceRefresh:false, onBeforeClose:function(){}
			//还有一个回调函数名称： callbackFuncNamsStr: 'callbackXXX'
			openWinp: function(para){// 自己打开
				_openWinp(self, para, getDocs().length, getParentIframeKeyArray(getDocs().length));
			},
			openWinpByPre: function(para){// 通过parent打开
				_openWinp(parent, para, getDocs().length -1, getParentIframeKeyArray(getDocs().length -1));
			},
			openWinpByTop: function(para){// 通过Top打开
				_openWinp(getParent(1), para, 1, getParentIframeKeyArray(1));
			},
			openWinpByWorkzone: function(para){// 通过Workzone打开
				_openWinp(getParent(2), para, 2, getParentIframeKeyArray(2));
			},
			
			closeSelfByPreWinp: function(){ // 如果是winp，关闭自己
				var obj = getSelfIframe();
				if(obj!=null){
					try{
						var o = $(obj);
						var id = o.attr('id');
						var wzid = id.replace("Iframe", "");
						parent.$('#'+wzid).winp('close');
					}catch(e){}
				}
			},
			closeSelfByPreWorkzone: function(){ // 如果是workzone，关闭自己
				var obj = getSelfIframe();
				if(obj!=null){
					try{
						var o = $(obj);
						var index = o.attr('index');
						var id = o.attr('id');
						var wzid = id.replace("_iframe_"+index, "");
						parent.$('#'+wzid).workzone('closeByIndex', index);
					}catch(e){}
				}
			}
	};
	//open 先去注册一下，然后，这里一起调用。
	
	$.workbus.defaults = $.extend({
		
	});
})(jQuery);
