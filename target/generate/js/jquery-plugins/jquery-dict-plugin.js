/*
 * @author Davin 20110830 v0.1
 使用实例
 systemMgrUrl 为 request获得
 引入：<script type="text/javascript" src="${systemMgrUrl}/script/libs/jquery-dict-plugin.js"></script>
	
 js：
		$.dictdata.init({
			dictType:9000,
			field:[{classId:1001,elementId:'isDel',attrName:'isDel'}]
			});
		$.dictdata.init({
			dictType:8000,
			field:[{classId:1002,elementId:'smUserCreateForm:sex'}]
			});
		$.dictdata.init({
			dictType:7000,
			field:[{classId:1002,elementId:'smUserCreateForm:sex2'},
			       {classId:1003,elementId:'isDel2'}]
			});
			
		$.dictdata.wrapper();//延迟加载需要使用这个，比如ajax数据加载完成之后
html：
		<select id="smUserCreateForm:sex" name="sex" />
		<select id="isDel" name="isDel" />
		<select id="smUserCreateForm:sex2" name="sex2" />
		<select id="isDel2" name="isDel2" />
		<div 	ddata="isDel" dvalue="1">11</div><br/>
		<span 	ddata="isDel" dvalue="1">22</span><br/>
		<input 	ddata="isDel" dvalue="1" type="text" value="33" /><br/>
 */
(function($) {
	
	var _data = {option:{},data:{}};
	var _loading = false;
	var _wrapperQueue = false;
	function _getSystemDictName(classId, entryId, dictType){
		var obj = null;
		try{
			obj = _data.data[""+dictType][""+classId][""+entryId];
		}catch(e){	return classId};
		return obj&&obj!=null?obj:classId;
	}
	;
	function _getSystemDictClassData(classId, dictType){
		var objList = null;
		try{
			objList = _data.data[""+dictType][""+classId];
		}catch(e){};
		return objList;
	}
	;
	function _getSystemDictClassList(classId, dictType){
		var objList = null;
		try{
			objList = _data.data[""+dictType][""+classId+"_l"];
		}catch(e){};
		return objList;
	}
	;
	function _setSystemDictClassData(classId, dictType, classObj ){
		var obj = {};
		obj[""+classId]=classObj;
		__extendData(dictType, obj );
	}
	;
	function _setSystemDictClassList(classId, dictType, classObj ){
		var obj = {};
		obj[""+classId+"_l"]=classObj;
		__extendData(dictType, obj );
	}
	;
	function _appendSelectSystemDict(classId, selectId, needDef,  defValue, defShow, dictType, field){
		var obj = _data.data[""+dictType][""+classId+"_l"];
		var opt = [];
		if(needDef){
			opt.push("<option value='"+(defValue?defValue:'')+"' >"+(defShow?defShow:'---请选择---')+"</option>");
		}
		//for(var name in obj){
		for(var i=0 ; obj && obj!=null && i<obj.length; i++){
			//opt.push("<option value='"+name+"' >"+obj[""+name]+"</option>");
			opt.push("<option value='"+obj[i][0]+"' >"+obj[i][1]+"</option>");
		}
		var tmpel = document.getElementById(selectId.replace('\\:',':'));
		if(!tmpel|| tmpel==null) return;
		if(tmpel.type=="text"){
			var tagetIdName = selectId.replace('\\:',':');
			var tagetIdNameReplaced =  selectId;
			var targetIdObj = $('#'+tagetIdNameReplaced);
			var selectVal = $('#'+tagetIdNameReplaced+'_select').val();
			
			//for input ddata
			//var index = tagetIdName.indexOf(":");
			//if(index==-1) alert(tagetIdName+" do not have ':' ");
			//var ddataValue = tagetIdName.substring(index+1)
			var ddataTag = "ddata_i2s";
			var ddataValue = "true";
			targetIdObj.attr(ddataTag,ddataValue);
			
			if(""+selectVal =="undefined"){ 
				
				//for select ddata
				var ddataTag_attr = "";
				//ddataTag_attr = ddataTag+'="'+ ddataValue+'"';
				
				var style='';
				if(field.style && field.style!=""){
					style = ' style="'+field.style+'" ';
				}
				
				//targetIdObj.after('<select id="'+tagetIdName+'_select" style="width:98%"  onChange="$.dictdata.selectChange(\''+tagetIdName+'\')"></select>');
				//dictcombobox="true"  class="easyui-combobox" editable="false"
				targetIdObj.after('<select  '+ddataTag_attr+' id="'+tagetIdName+'_select" '+style+' '+(tmpel.disabled?'disabled':'')+'  ></select>');
				targetIdObj.hide();
			}
			var tagetIdNameReplaced = selectId;
			var targetIdObj_select = $('#'+tagetIdNameReplaced+'_select');
			var targetIdObj = $('#'+tagetIdNameReplaced);
			targetIdObj_select.html('');
			targetIdObj_select.append(opt.join(''));
			
			var onchangeFuncName = "";
			//判断是否有onchange方法  ---input 合并
			if(field.onchangeFuncName && field.onchangeFuncName!=""){
				onchangeFuncName = field.onchangeFuncName+"();";
			}
			targetIdObj_select.change(  function() { 
				//var oldTagName = this.id.substring(0,this.id.length - '_select'.length);
				//$('#'+oldTagName.replace(':','\\:')).val(this.value);
				targetIdObj.val(targetIdObj_select.val());
				if(onchangeFuncName && onchangeFuncName!=""){
					eval(onchangeFuncName);
				}
			}); 
			//init value
			if(targetIdObj.val()!=""){
				targetIdObj_select.val(targetIdObj.val());
			}else{
				targetIdObj.val(targetIdObj_select.val());
			}
			
		}else{
			$('#'+selectId).html(opt.join(''));
			//判断是否有onchange方法  ---select 直接添加
			if(field.onchangeFuncName && field.onchangeFuncName!=""){
				$('#'+selectId).change(function(){
					eval(field.onchangeFuncName+"();");
				}); 
			}
		}
		
	};
	//当input转为select的时候，需要用到此方法。就是把select值赋值到input
	function _selectChange(tagetIdName)
	{
		var tagetIdNameReplaced = tagetIdName.replace(':','\\:')
		var targetIdObj = $('#'+tagetIdNameReplaced);
		var selectVal= $('#'+tagetIdNameReplaced+'_select').val();
		targetIdObj.val(selectVal);
	}
	function _getTop(){
		return top;
	};
	function _wrapper(){
		_wrapperQueue = false;
		
		if(_loading){
			_wrapperQueue = true;
			return ;
		}
		for(var dt in _data.option){
			var ddataTag = _data.option[""+dt].ddataTag;
			var dvalueTag = _data.option[""+dt].dvalueTag;
			var arr = _data.option[""+dt].field;
			for(var f in arr){
				var an = arr[f].attrName;
				if(!an) continue;
				$('div['+ddataTag+'='+an+']').each(function(){
					var v = $(this).attr(dvalueTag);
					$(this).html(_getSystemDictName(arr[f].classId,v, dt));
				});
				$('span['+ddataTag+'='+an+']').each(function(){
					var v = $(this).attr(dvalueTag);
					$(this).html(_getSystemDictName(arr[f].classId,v, dt));
				});
				$('input['+ddataTag+'='+an+']').each(function(){
					var v = $(this).attr(dvalueTag);
					$(this).val(_getSystemDictName(arr[f].classId,v, dt));
				});
				//$('select['+ddataTag+'='+an+']').each(function(){
				//	var oldTagName = this.id.substring(0,this.id.length - '_select'.length);
				//	$(this).val( $('#'+oldTagName.replace(':','\\:')).val() );
				//});
			}
		}
		
		$('input[ddata_i2s=true]').each(function(){
			var inputObj =  $('#'+this.id.replace(':','\\:'));
			var selectObj =  $('#'+this.id.replace(':','\\:')+"_select");
			if(inputObj.val()!=''){
				selectObj.val(inputObj.val());
			}else{
				inputObj.val(selectObj.val());
			}
		});
			
		/*
		//select[dictcombobox='true']
		$(".easyui-combobox").each(function(index){ 
			var id =  this.id.replace(':','\\:');
			$('#'+id).combobox({});
		});
		*/
	};
	function _init(dictType, field){
		
		var data = _data.data;
		var opts = _data.option[""+dictType];
		
		//从框架上获取url
		var serverUrl = null;
		try{
			serverUrl = getTop().dictdata_getServerUrl();
			if(serverUrl!=null){
				opts.contextPath = serverUrl; 
			}
		}catch(e){}
		
		var url = null;
		if(opts.testUrl!=""){
			url = opts.testUrl ;
		}else{
			url = opts.contextPath + '/'+ opts.pathUrl + '/' + opts.dictType + '/';
		}
		var urlpara = [];
		for(var i=0;i<field.length;i++){
			var classObj = _getTop().$.dictdata.getSystemDictClassData({classId: field[i].classId,dictType: opts.dictType } );
			var classList = _getTop().$.dictdata.getSystemDictClassList({classId: field[i].classId,dictType: opts.dictType } );
			if(classObj!=null && classList!=null){
				_setSystemDictClassData(field[i].classId, opts.dictType, classObj);
				_setSystemDictClassList(field[i].classId, opts.dictType, classList);
			}else{
				urlpara.push(field[i].classId);
				urlpara.push('A');
			}
		}
		if(urlpara.join('').length==0){
			var wqueue = _wrapperQueue;
			
			_appendSelectSystemDictAll(field, dictType);
			
			if(wqueue){
				_wrapper();
			}
		}else{
			
			urlpara.push('.xhtml');
			if(opts.testUrl==""){
				url = url + escape(urlpara.join(''));
			}
			//$.getScript('/TenderWeb/dict/system.jsdo?classId=1002A1003A',function(){
			//	alert('load over');
			//});
			_loading = true;
			$.ajax( {
				type : 'get',
				url: url,
				dataType : "json",
				success: function(data){
					_loading = false;
					var wqueue = _wrapperQueue;

					__extendData(dictType, data.dict[""+dictType]);
					_appendSelectSystemDictAll(field, dictType);
					
					_getTop().$.dictdata.setSystemDictTypeData( {dictType: dictType, dictTypeObj: data.dict[""+dictType] } );
					
					if(wqueue){
						_wrapper();
					}
				},
				error : function() {
					_loading = false;
					_wrapperQueue = false;
					alert("数据字典服务无法连接");
				}
			});
		
		}
	}
	;
	function __extendData(dictType, dictTypeObj ){
		var dt_data = _data.data[""+dictType];
		if(dt_data){
			_data.data[""+dictType] = $.extend(dt_data, dictTypeObj );
		}else{
			_data.data[""+dictType] =  dictTypeObj;
		}
	};
	function _appendSelectSystemDictAll(field, dictType){
		for(var i=0;i<field.length;i++){
			if(!field[i].elementId){
				continue;
			}
			var el = field[i].elementId.replace(':','\\:');
			_appendSelectSystemDict(field[i].classId, el, field[i].needDef,field[i].defValue, field[i].defShow, dictType, field[i]);
		}
	}
	
	/*
	old dict["8000"]= {"1000" : {"1" :"字典","2":"xxx" }, "1001" : {"1" :"字典2","2":"xxx2" }  }
	new dict["8000"]= {"1000" : [["1","字典"],["2","xxx"] ] , "1001" : [["1","字典2"],["2", "xxx2"]]  }
	*/
	/* _data = { 
	 * 		option: {
	 * 			"7000":{	初始化数据 		},
	 * 			"8000":{	初始化数据 		},
	 * 			"9000":{	初始化数据 		},
	 * 				}
	 * 		data: {
	 * 			"7000": {
	 * 						"1000" : {"1" :"字典","2":"xxx" }, 
	 * 						"1001" : {"1" :"字典2","2":"xxx2" },
	 * 						"1000_l" :[[1,"字典"],[2,"xxx" ] //add
	 *					}, 
	 * 			"8000": {
	 * 						"1000" : {"1" :"字典","2":"xxx" }, 
	 * 						"1001" : {"1" :"字典2","2":"xxx2" },
	 * 						"1000_l": [[1,"字典"],[2,"xxx" ] //add
	 *					}, 
	 * 			"9000": {
	 * 						"1000" : {"1" :"字典","2":"xxx" }, 
	 * 						"1001" : {"1" :"字典2","2":"xxx2" }  ,
	 * 						"1000_l":[[1,"字典"],[2,"xxx" ]	//add
	 *					} 
	 * 	}
	 * }
	 * 
	 * 
	 */
	$.dictdata = {
			init : function(para){
				var para = para || {};
				
				var opt_dt = _data.option[""+para.dictType];
				if(opt_dt){
					opt_dt = $.extend(opt_dt, para);
				}else{
					opt_dt = $.extend( {}, $.dictdata.defaults, para);
				}
				_data.option[""+para.dictType] = opt_dt;
				
				_init(para.dictType,para.field);
				
			},
			getDictName : function(obj) {
				return _getSystemDictName(obj.classId, obj.entryId, obj.dictType);
			},
			getSystemDictClassData : function(obj){
				return _getSystemDictClassData(obj.classId, obj.dictType);
			},
			getSystemDictClassList : function(obj){
				return _getSystemDictClassList(obj.classId, obj.dictType);
			},
			setSystemDictClassData : function(obj){
				return _setSystemDictClassData(obj.classId, obj.dictType, obj.valueList);
			},
			setSystemDictClassList : function(obj){
				return _setSystemDictClassList(obj.classId, obj.dictType, obj.valueList);
			},
			setSystemDictTypeData : function(obj){
				return __extendData(obj.dictType, obj.dictTypeObj);
			},
			selectChange : function(tagetIdName){
				return _selectChange(tagetIdName);
			},
			wrapper :function(){
				_wrapper();
			}
	}
	;
	$.dictdata.defaults = $.extend({
		dictType : 8000,
		//新增 onchange事件方法名称   onchangeFuncName:'onXXXTypeChange'
		field : [],//[{classId:1000,elementId:'xxxx:Id', needDef: false,  defValue:'', defShow:'---请选择---', attrName:'sex', onchangeFuncName:'onXXXChange', style:"width:100px;", ] //classId 必选    elementId为空表示只取数据
		contextPath : "/BaseSystemMgr",
		pathUrl : "SmDictData/getJson",
		testUrl : "",
		defValue: '',
		defShow: '---请选择---',
		ddataTag: 'ddata',
		dvalueTag: 'dvalue'
	});
})(jQuery);
function dictdata_getServerUrl(){
	return null;
}
