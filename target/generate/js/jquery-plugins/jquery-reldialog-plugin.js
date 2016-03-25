/*
 * @author Davin 20110830 v0.1
初始化：input的id
		$('#smUserCreateForm\\:reldialog').reldialog({
			url: '${pathHelper.path}/SmUser/tree.xhtml',
			onclickJsFunc:'reldialog__closeTreeSelectRel'
		});
重置
		$('#smUserCreateForm\\:reldialog').reldialog('reset',{id:111,text:'哈哈哈哈'});
关闭
		$('#smUserCreateForm\\:reldialog').reldialog('close');
重置and关闭
		$('#smUserCreateForm\\:reldialog').reldialog('resetAndClose',{id:111,text:'哈哈哈哈'});
 */
(function($) {
	
	var _data = null;
	
	//弹出树形结构begin
	function _close(obj){
		var inputIdStr = obj.id;
		var inputIdStr2 = inputIdStr.replace(':','\\:')
		var inputIdStr3 = inputIdStr.replace(':','__')
		
		var relTreeDiv3 = inputIdStr3+"_relTreeDiv";
		
		$('#'+relTreeDiv3).window('close');
	};
	var isArray = function(obj) {
	    return Object.prototype.toString.call(obj) === '[object Array]';
	};
	function _reset(obj, treeNode){
		var idArr = [];
		var textArr = [];
		if(isArray(treeNode)){
			for(var i=0; i<treeNode.length;i++){
				idArr.push(treeNode[i].id);
				textArr.push(treeNode[i].text);
			}
		}else{
			idArr.push(treeNode.id);
			textArr.push(treeNode.text);
		}
		
		var inputIdStr = obj.id;
		var inputIdStr2 = inputIdStr.replace(':','\\:')
		var inputIdStr3 = inputIdStr.replace(':','__')
		
		var inputShowIdStr = inputIdStr+"_inputshow";
		var inputShowIdStr2 = inputIdStr2+"_inputshow";
		
		var relTreeDiv3 = inputIdStr3+"_relTreeDiv";
		
		$('#'+inputIdStr2).val(idArr.join(';'));
		$('#'+inputShowIdStr2).val(textArr.join(';'));
	};
	function _clear(obj){
		var inputIdStr = obj.id;
		var inputIdStr2 = inputIdStr.replace(':','\\:')
		
		var inputShowIdStr = inputIdStr+"_inputshow";
		var inputShowIdStr2 = inputIdStr2+"_inputshow";
		
		$('#'+inputIdStr2).val("");
		$('#'+inputShowIdStr2).val("");
	};
	function _init(obj){
		var opts = $.data(obj,"reldialog").options;
		
		var inputIdStr = obj.id;
		var divHeight = opts.divHeight;
		var divWidth = opts.divWidth;
		
		var inputIdStr2 = inputIdStr.replace(':','\\:')
		var inputIdStr2_ext = inputIdStr.replace(':','\\\\:')
		var inputIdStr3 = inputIdStr.replace(':','__')
		
		var inputShowIdStr = inputIdStr+"_inputshow";
		var inputShowIdStr2 = inputIdStr2+"_inputshow";
		
		var relTreeDiv3 = inputIdStr3+"_relTreeDiv";
		
		var obj = document.getElementById(relTreeDiv3);
		
		if(!divHeight) divHeight = 300;
		if(!divWidth) divWidth = 250
		var bodyheight = $('body').height();
		var bodywidth = $('body').width();
		if(divHeight > bodyheight) divHeight = bodyheight ;
		if(divWidth > bodywidth) divWidth = bodywidth ;
		
		
		if(!obj || obj==null || ''+obj=='undefined'){
			$('body').append('<div id="'+relTreeDiv3+'" ></div>');
			$('#'+relTreeDiv3).append('<iframe src="" scrolling="auto" width="100%" height="100%" frameborder="0" />');
			
			$('#'+relTreeDiv3).window({
				title: opts.title,	
				width: divWidth -10, height: divHeight -30,
				modal: true,
				closed: true,
				closable: true,
				minimizable: false
			});
		}
		{
			var inputobj = $('#'+inputIdStr2);
			var inputShow = $('#'+inputShowIdStr2);
			var inputShowVal = inputShow.val();
			if(""+inputShowVal =="undefined"){ 
				if(opts.type=='input'){
					inputobj.after('<table border="0" style="width:98%;"><tr><td><input id="'+inputShowIdStr+'" style="width:100%;float:left;" type="text" /></td><td width="21"><input type="button" onclick="$(\'#'+inputIdStr2_ext+'\').reldialog(\'clear\');" value="clear" /></td></tr></table>');
					inputobj.hide();
					inputShow = $('#'+inputShowIdStr2);
					inputShow.attr('readonly','readonly');
				}else {
					inputobj.after('<input id="'+inputShowIdStr+'" type="hidden" />');
				}
			}
			
			inputShow.click( function() {
				_openDialog(inputIdStr,opts);
			}); 
		}
	};
	
	function _openDialog(inputIdStr,opts){
		var divHeight = opts.divHeight;
		var divWidth = opts.divWidth;
		
		var inputIdStr2 = inputIdStr.replace(':','\\:')
		var inputIdStr2_ext = inputIdStr.replace(':','\\\\:')
		var inputIdStr3 = inputIdStr.replace(':','__')
		
		var inputShowIdStr = inputIdStr+"_inputshow";
		var inputShowIdStr2 = inputIdStr2+"_inputshow";
		
		var relTreeDiv3 = inputIdStr3+"_relTreeDiv";
		
		var obj = document.getElementById(relTreeDiv3);
		
		var divobj = $('#'+relTreeDiv3);
		var bodyobj = $('body');
		var inputShow = $('#'+inputShowIdStr2);
		
		//body
		var bodyHeight = bodyobj.height() ;
		var bodyWidth = bodyobj.width() ;
		//input
		var offset = inputShow.offset();
		var inputHeight = inputShow.height();
		//show point
		var leftv = offset.left;
		var topv = offset.top + inputHeight;
		
		if(divHeight > bodyHeight) divHeight = bodyHeight;
		if(divWidth > bodyWidth) divWidth = bodyWidth;

		if(topv + divHeight >= bodyHeight){
			topv = bodyHeight - divHeight;
		}
		divobj.window('move',{left:leftv,top:topv});
		divobj.window('resize',{width: divWidth -10, height: divHeight-30 });
		divobj.window('open');
		
		var oldurl = $('#'+relTreeDiv3+' >iframe').attr('src');
		if(oldurl==""){
			var url = opts.url;
			var index = url.indexOf('?');
			var first = index==-1?'?':'&';
			var other = '&';
			var urlpara = [];
			urlpara.push(first+'checkbox='+opts.urlPara.checkbox);
			urlpara.push(other+'cascadeCheck='+opts.urlPara.cascadeCheck);
			urlpara.push(other+'btnExist='+opts.urlPara.btnExist);
			urlpara.push(other+'dwrCtrlName='+opts.urlPara.dwrCtrlName);
			urlpara.push(other+'dwrMethodname='+opts.urlPara.dwrMethodname);
			
			urlpara.push(opts.urlPara.getParentMethodFunc!=''?(other+'getParentMethodFunc='+opts.urlPara.getParentMethodFunc):'');
				
			$('#'+relTreeDiv3+' >iframe').attr('src',url+urlpara.join(''));
		}
	};
	
	//弹出树形结构end
	
	$.fn.reldialog = function(method, para) {
		if (typeof method == "string") {
			return $.fn.reldialog.methods[method](this,para);
		}
		
		var method = method || {};
		return this.each(function() {
			var data = $.data(this,"reldialog");
			if (data) {
				data.options = $.extend(data.options, method);
			} else {
				var opts = $.extend( {}, $.fn.reldialog.defaults, method);
				$.data(this,"reldialog", {
					options : opts
				});
			}
			_init(this);
		});
	};
	$.fn.reldialog.methods = {
			close : function(jq) {
				jq.each(function() {
					_close(this);
				});
			},
			clear : function(jq){
				jq.each(function() {
					_clear(this);
				});
			},
			reset : function(jq,node){
				jq.each(function() {
					_reset(this,node);
				});
			},
			resetAndClose : function(jq,node){
				jq.each(function() {
					_reset(this,node);
					_close(this);
				});
			},
			getParentMethodFunc : function(jq){
					var opts = $.data(jq[0],"reldialog").options;
					return opts.parentMethod;
			},
			open : function(jq){
				jq.each(function() {
					var opts = $.data(this,"reldialog").options;
					_openDialog(this.id, opts);
				});
			}
	}
	;
	$.fn.reldialog.defaults = $.extend({
		url: null, 
		title: '',
		
		divHeight: 300, 
		divWidth: 250 ,
		
		type: "input",//"button" //
		
		iframeId: "",//可以为空，为空默认制定input+iframe。
		
		urlPara:{
			dwrCtrlName:'SmOrgDwrCtrl'	,//require
			dwrMethodname:'queryByArgs'	,//optional
			checkbox: false,
			cascadeCheck: false,
			btnExist: false,
			getParentMethodFunc:''	//require
		},
		/*
//点击树节点时，自动激发函数名，函数参数固定为node（当前点击的树节点）。如 onclickJsFunc=parent.onclickOrgTree，默认为空
		onclickJsFunc = request.getParameter("onclickJsFunc");
		//是否需要确定按钮，如果需要，直接传入他的回调函数名称，函数参数多选为list，单选为node。如 onclickJsFunc=parent.onclickOrgTree，默认为空
		onclickOkFunc = request.getParameter("onclickOkFunc");
		//是否需要取消按钮，如果需要，直接传入他的回调函数名称，函数参数多选为list，单选为node。如 onclickJsFunc=parent.onclickOrgTree，默认为空
		onclickCancelFunc = request.getParameter("onclickCancelFunc");
		//是否需要关闭按钮，如果需要，直接传入他的回调函数名称，函数参数多选为list，单选为node。如 onclickJsFunc=parent.onclickOrgTree，默认为空
		onclickCloseFunc = request.getParameter("onclickCloseFunc");
		
		//( before: checkbox==true )获取已选数据  方法参数为空，返回值为  [1,2,3],如 getCheckedList=parent.getCheckedList，默认为空
		getCheckedListFunc = request.getParameter("getCheckedListFunc");
		
		//获取root的对象{id: 0, text: 'xxx'};
		String getRootObjFunc = request.getParameter("getRootObjFunc");
		//获取每次查询查询条件，除了superId;
		String getQueryParaFunc = request.getParameter("getQueryParaFunc");
		 */
		parentMethod: {
			getModelAttrName: {id:'modelObj.seqId',name:'modelObj.name',superId:'modelObj.superId',isLeaf:'modelObj.isLeaf',modelObj:'modelObj'},	//获取id及name的属性名称
			onclickJsFunc: "",//函数参数固定为node, 无返回
			onclickOkFunc: "",//函数参数多选为list, 无返回
			onclickResetFunc: "",//参数为node，无返回
			onclickCancelFunc: "",//函数参数多选为list, 无返回
			onclickCloseFunc: "",//函数参数多选为list, 无返回
			getCheckedListFunc: "",//无参数，返回list, 无返回
			getRootObjFunc: "",//无参数，返回object //id:111,text:'xxx'
			getQueryParaFunc: ""//无参数，返回object
		}
		
	});
})(jQuery);
