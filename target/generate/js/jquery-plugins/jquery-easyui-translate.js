/*
 * 
 * 依赖JSON2, 依赖 ajaxjson
 */
/**
 * para:{{
 * 	service_url:服务地址,
 *  qo_attr: 值对应的查询属性名,默认为ids
 *  out_text_attr:返回列表对象中值对应的译文字段，默认为 name
 *  out_key_attr:返回列表对象中值对应的ID，默认为 id
 *  input_tag 翻译对象的标签 ,默认为:ddata
 *  input_value_tag 翻译对象值的标签 ,默认为:dvalue
 *  
 * }]
 */
(function($) {
	var config = [
	              //{translateKey:'',	service_url:'',qo_attr:'',input_tag:'',input_value_tag:'',query_obj:{}}
	              ];
	
	$.translate = {
			init : function(para){
				config = para || [];
			},
			wrapper :function(){
				_wrapper();
			}
	};
	
	function query(url, qo, curr_config, callback){
		$.ajaxjson.post({url : url,
	        queryPara : qo,   
			successFunc: function(data){
				var res = {};
				res.config = curr_config;
				res.data = data;
				callback(res);
			}
		});
	};
	
	function _wrapper(){
		for(var i=0;i<config.length;i++){
			var conf = defaultConf(config[i]);
			var ids = [];
			$('div['+conf.input_tag+'='+conf.translateKey+']').each(function(){
				var v = $(this).attr(conf.input_value_tag);
				ids.push({id:v});
			});
			$('span['+conf.input_tag+'='+conf.translateKey+']').each(function(){
				var v = $(this).attr(conf.input_value_tag);
				ids.push({id:v});
			});
			$('input['+conf.input_tag+'='+conf.translateKey+']').each(function(){
				var v = $(this).attr(conf.input_value_tag);
				ids.push({id:v});
			});
			if(ids == null || ids.length<1) continue;
			var qo = conf.query_obj;
			if(conf.qo_attr!=null && conf.qo_attr!=''){
				qo[conf.qo_attr] = ids;
			}
			query(conf.service_url,qo,conf,showTranslate);
		}
	}
	
	function defaultConf(obj){
		var conf = obj;
		if(conf.input_tag==null || conf.input_tag=='') conf.input_tag = 'ddata';
		if(conf.input_value_tag==null || conf.input_value_tag=='') conf.input_value_tag = 'dvalue';
		if(conf.qo_attr==null || conf.qo_attr=='') conf.qo_attr = 'translates';
		if(conf.out_text_attr==null || conf.out_text_attr=='') conf.out_text_attr = 'name';
		if(conf.out_key_attr==null || conf.out_key_attr=='') conf.out_key_attr = 'id';
		if(conf.service_url ==null || conf.service_url =='') conf.service_url = path+"/TranslateData/getTranslateData.xhtml"
		return conf;
	}
	
	function showTranslate(res){
		var conf = res.config;
		var resData = res.data;
		if(resData == null || resData.length <1 ) return ;
		for(var i = 0 ; i<resData.length; i++){
			var obj = resData[i];
			$('div['+conf.input_tag+'='+conf.translateKey+']['+conf.input_value_tag+'='+obj[conf.out_key_attr]+']').each(function(){
				$(this).html(obj[conf.out_text_attr]);
			});
			$('span['+conf.input_tag+'='+conf.translateKey+']['+conf.input_value_tag+'='+obj[conf.out_key_attr]+']').each(function(){
				$(this).html(obj[conf.out_text_attr]);
			});
			$('input['+conf.input_tag+'='+conf.translateKey+']['+conf.input_value_tag+'='+obj[conf.out_key_attr]+']').each(function(){
				$(this).val(obj[conf.out_text_attr]);
			});
		}
	} 
	
	
})(jQuery);