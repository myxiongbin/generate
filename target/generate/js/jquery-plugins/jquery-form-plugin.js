/**
 * $.form("#fromId").getJSON(); 
 * $.form("#fromId").setJSON(obj);
 * $.form("#formId").clear(); 
 * $.form("#fromId").sleep();
 * $.form("#fromId").wakeup();
 * $("#id").addOptions(opts,textName,valueName);
 */

if (jQuery) (function($){

	
	jQuery.fn.extend( {

		/**
		 * 得到JSON对象
		 */
		getJSON : function() {
			//TODO 对查询出的结果进行分组 1.有前缀的以第一个前缀为分组 2.没有前缀的各自为一组
			var vRet = {};//返回对象
			var vMap = {};
			//用form先过滤掉一些非法的id
			jQuery.form(this).each(function(){
				if( this.id.match(/.+:.+/) ) {//有前缀
					var vPrefix = this.id.replace(/:.*$/,"");//取得前缀
					(vMap[vPrefix]=vMap[vPrefix]?vMap[vPrefix]:[]).push(this);
				} else {//没前缀
					vMap[this.id]=[this];
				}//if
			});
			for( var pro in vMap ) {
				$.each(vMap[pro],function(i,dField){
					var aPath = dField.id.split(/:/);
					var vRec = vRet;
					$.each(aPath,function(ii,nn){
						if( ii == aPath.length - 1 ) {
							//如果是末梢节点，则直接取值
							vRec[nn] = _getFormFieldValue(dField);
						} else {
							//如果是中途节点，则赋值
							vRec = vRec[nn]?vRec[nn]:(vRec[nn]={});
						}//if
					});
				});
			}//for
			return vRet;
		},
		
		/**
		 * 给表单赋值
		 */
		setJSON : function(vObj){
			if( !vObj ) {
				return this;
			}//if
			jQuery.form(this).each(function(){
				var aPath = this.id.split(/:/);
				var vRec = vObj;
				var dField = this;
				jQuery.each(aPath,function(i,n){
					if( i == aPath.length - 1 ) {
						_setFormFieldValue(dField,vRec[n], vRec, n);
					} else {
						vRec = vRec[n];
						if( undefined === vRec ) {
							return false;
						}//if
					}//if
				});
			});
			return this;
		},
		
		
		/**
		 * 清空表单
		 */
		clear : function() {
			return jQuery.form(this).each(function(){
				_setFormFieldValue(this);
			});
		},
		
		/**
		 * 休眠
		 */
		sleep : function() {
			return jQuery.form(this).each(function(){
				_sleepOrWakeupFormField(this,true);
			});
		},
		
		/**
		 * 唤醒
		 */
		wakeup : function() {
			return jQuery.form(this).each(function(){
				_sleepOrWakeupFormField(this,false);
			});
		},
		
		
		/**
		 * 表单
		 */
		form : function() {
			return jQuery.form(this);
		},
		
		addOptions : function(opts,text,value) {
			if(opts!=null&&opts.length>0){
				for(var i=0; i<opts.length; i++){
					$("<option value='"+opts[i][value]+"'>"+opts[i][text]+"</option>").attr(opts[i]).appendTo(this);
				}
			}
			return this;
		}
	
	});//jQuery.fn.extend

	
	/**
	 * 休眠或唤醒单个元素
	 * @param dField
	 * @param vFlag
	 * @return
	 */
	function _sleepOrWakeupFormField(dField,vFlag) {
		switch(dField.tagName.toUpperCase()) {
		case "INPUT":
			switch( dField.type.toUpperCase() ) {
			case "RADIO":
				jQuery(":radio[name='"+dField.name+"']").attr("disabled",vFlag);
				break;
			case "CHECKBOX":
				jQuery(":checkbox[name='"+dField.name+"']").attr("disabled",vFlag);
				break;
			default:
				jQuery(dField).attr("disabled",vFlag);
				break;
			}//switch
			break;
		default:
			jQuery(dField).attr("disabled",vFlag);
			break;
		}//switch
	}//_sleepOrWakeupFormField
	
	/**
	 * 从表单区域中取值
	 * @param dField
	 * @return
	 */
	function _getFormFieldValue(dField) {
		var value = undefined;
		
		//判断是否是easy ui 的combox
		if($(dField).attr("class").indexOf("combo")!=-1){
			var idstr_reped = dField.id.replace(':','\\:');
			var multiple = $('#'+idstr_reped).combo('options').multiple;
			value = $('#'+idstr_reped).combo(multiple?'getValues':'getValue');
			return value;
		}
		
		switch(dField.tagName.toUpperCase()) {
		case "BUTTON":
			break;
		case "LABEL":
			value = jQuery(dField).text();
			break;
		case "SPAN" :
			value = jQuery(dField).html();
			break;
		case "INPUT":
			switch( dField.type.toUpperCase() ) {
			case "BUTTON":
				break;
			case "RADIO":
				$(":radio[name='"+dField.name+"']:checked").each(function(){
					value = this.value;
					return false;
				});
				break;
			case "CHECKBOX":
				var aValues = [];
				jQuery(":checkbox[name='"+dField.name+"']:checked").each(function(){
					aValues.push(this.value);
				});
				value = aValues.length?aValues:value;
				break;
			default:
				value = $(dField).val();
				break;
			}//switch
			break;
		default ://默认情况下是对value属性进行赋值
			try{
				value = jQuery(dField).val();
			}catch(e){}
			break;
		}//switch
		//-----------------这里执行转换---------------------
		//-对日期的转换
		var dateFormat = dField.attributes.getNamedItem("dateFormat");
		//if( dField.dateFormat && typeof(value) === "string" ) {
		if( dateFormat!=null && typeof(value) === "string" ) {
			if (!value){
				return null;
			}
			//如果当前Field有dateFormat属性，则表明他企图是一个日期型
			value = Date.parseDate(value,dateFormat.value);//dField.dateFormat);
		}//if
		//------------------------------------------------
		return value;
	}//_getFormFieldValue
	
	function _setFormFieldValue(dField, value, Rec, n) {
		var isClear = undefined === value;
		value = (value!=0 && !value)?"":value;
		//-----------------这里执行转换---------------------
		//-对日期的转换
		//if( !isClear && value && typeof(value) === "object" && value instanceof Date ) { // value instanceof Date 在google浏览器不生效
		var dateFormat = dField.attributes.getNamedItem("dateFormat");
		if( !isClear && value && typeof(value) === "object" && dateFormat!=null ) {
			//如果当前Field有dateFormat属性，则表明他企图是一个日期型
			var vFormat = dateFormat.value;//dField.dateFormat?dField.dateFormat:"Y-m-d H:i:s";
			//alert(vFormat);
			value = value.dateFormat(vFormat);
			//alert(value);
		}//if
		if( !isClear && value && typeof(value) === "number" && dateFormat!=null ) {
			value = (new Date(value)).dateFormat(dateFormat.value);
		}//if
		//------------------------------------------------
		//判断是否是easy ui 的combox
		if($(dField).attr("class").indexOf("combo")!=-1){
			var idstr_reped = dField.id.replace(':','\\:');
			var multiple = $('#'+idstr_reped).combo('options').multiple;
			$('#'+idstr_reped).combo(multiple?'setValues':'setValue',value);
			if(value==""){
				$('#'+idstr_reped).combo('setText','');
			}else{
				var showText = "";
				try{
					showText = multiple?Rec[n+"_name"].join(','):Rec[n+"_name"];
				}catch(e){
					showText = multiple?Rec[n].join(','):Rec[n];
				}
				$('#'+idstr_reped).combo('setText',showText);
			}
			return ;
		}
		//------------------------------------------------
		switch(dField.tagName.toUpperCase()) {
		case "BUTTON":
			break;
		case "LABEL":
			jQuery(dField).text(value);
			break;
		case "SPAN" :
			jQuery(dField).html(value);
			break;
		case "SELECT":
			if( isClear ) {
				jQuery(dField).find("option:first").attr("selected",true);
			} else {
				jQuery(dField).val(value);
			}//if
			break;
		case "INPUT":
			switch( dField.type.toUpperCase() ) {
			case "BUTTON":
				break;
			case "RADIO":
				jQuery(":radio[name='"+dField.name+"']").each(function(){
					jQuery(this).attr("checked",false);
					if(!isClear && this.value == value) {
						jQuery(this).attr("checked",true);
					}//if
				});
				break;
			case "CHECKBOX":
				$(":checkbox[name='"+dField.name+"']").each(function(){
					$(this).attr("checked",false);
					if( !isClear ) {
						value = value instanceof Array?value:[""+value];//弄成一个数组
						for( var i=0; i<value.length; i++ ) {
							value[i] = ""+value[i];
						}//if
						if( jQuery.inArray(this.value,value) >= 0) {
							jQuery(this).attr("checked",true);
						}//if
					}//if
				});
				break;
			default:
				value = jQuery(dField).val(value);
				break;
			}//switch
			break;
		default ://默认情况下是对value属性进行赋值
			value = jQuery(dField).val(value);
			break;
		}//switch
	}//_setFormFieldValue
	
	
	
	
	jQuery.extend( {

		/**
		 * $.form 找出所有注册的子元素
		 */
		form : function(vSelector) {
			var aSelect = [];
			var $result = jQuery(vSelector).each(
				function() {
					//这里需要[id^=':'],[id='']的原因是过滤掉类似admin:user,admin:username的情况;id必须存
					aSelect.push(this.id?"[id^='"+this.id+":'],[id='"+this.id+"']":null);
				});
			//如果aSelect有值,则表明vSelector找到了东西,否则直接返回$result
			return aSelect.length?jQuery(aSelect.join(",")).filter(function(){
				return undefined === jQuery("[id^='"+this.id+":']")[1];//过滤掉formId
			}):$result;
		}
	});//jQuery.extend
	
})(jQuery);
