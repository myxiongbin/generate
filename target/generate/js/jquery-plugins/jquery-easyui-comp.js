/*
 * 
 * 依赖JSON2, 依赖 ajaxjson
 */
(function($) {
	function init(obj) {
		var para = $.data(obj, "comp").options;
		if(para.type=='list'){
			initList(obj);
		}else if(para.type='tree'){
			initTree(obj);
		}
	}
	;
	function initList(obj){
		var para = $.data(obj, "comp").options;
		
		var keyId= para.inputKeyId == ''? para.inputTextId+'_ID':para.inputKeyId; 
			
		var keyFieldName = para.list.keyFieldName ||'id';
		var valueFieldName = para.list.valueFieldName||'text' ;
		var keyTitleName = para.list.keyTitleName ||'编号';
		var valueTitleName = para.list.valueTitleName ||'名称' ;
		var queryPara = para.list.queryPara || {} ;
		var singleSelectImmediaClosePanel = para.singleSelectImmediaClosePanel;
		var singleSelect = para.singleSelect;
		
		var isInputType = para.isInputType ;
		/*
		<div id="p" status="init" style=" width:500px;height:200px;padding:1px;display: none;" border="1">
			<table id="ptable"></table>
		</div>
		*/
		var inputTextId_splited = para.inputTextId.replace(':','\\:');
		var inputText_jobj = $('#'+inputTextId_splited);
		var inputText_panel_jobj = $('#'+inputTextId_splited+"_panel");
		inputText_jobj.attr('_keyId',keyId);

		//多选，变宽
		if(!singleSelect){
			para.width+=30;
		}
		
		//初始化panel 和 input id 的html代码
		if(inputText_panel_jobj.size()==0){
			var w = para.width ;
			var h = para.height ;
			$('body').append('<div id="'+obj.id+'_panel" status="init" style="background:#fafafa;width:'+w+'px;height:'+h+'px;"><table id="'+obj.id+'_panel_table"></table></div>');
			inputText_panel_jobj = $('#'+inputTextId_splited+"_panel");
			
			inputText_jobj.after('<input id="'+keyId+'" value="" style="display:none;" />');
			if(isInputType){
				inputText_jobj.attr('readonly',"readonly");
			}
		}
		
		//初始化 panel 和 table 的obj代码
		//alert(p.attr('status'));
		if(inputText_panel_jobj.attr('status')=='init'){
			positionPanel(para.inputTextId);
			
			inputText_panel_jobj.attr('status','close');

			//多选
			var frozenColumns = [];
			if(!singleSelect){
				frozenColumns.push([{field:'ck',checkbox:true}])
			}
			
			
			$('#'+inputTextId_splited+"_panel_table").datagrid({
				fit: true,
				idField: keyFieldName ,
				singleSelect: para.singleSelect ,
				frozenColumns:frozenColumns,
				columns:[[
					{field: 'a1' , title: keyTitleName ,width:70,
						formatter:function(value,rec){
							return eval("rec."+keyFieldName);
						}
					}   ,	
					{field: 'a2' , title: valueTitleName ,width:85,
						formatter:function(value,rec){
							return eval("rec."+valueFieldName);
						}	
					} 	
				]],
				
				onClickRow : function(rowIndex, rowData) {
					setInputValue();
				},
				onSelectAll : function(rows) {
					setInputValue();
				},
				onUnselectAll : function(rows) {
					setInputValue();
				},
				onSelect : function(_1ed, _1ee) {
					setInputValue();
				},
				onUnselect : function(_1ef, _1f0) {
					setInputValue();
				}
			});
			
			function setInputValue(){
				var keyobjid = keyId.replace(':','\\:');
				var keyobj = $('#'+keyobjid);
				
				var s = $('#'+inputTextId_splited+"_panel_table").datagrid('getSelections');
				var values = [];
				var keys = [];
				for(var i=0; s && i<s.length; i++){
					values.push(eval("s[i]."+valueFieldName));
					keys.push(eval("s[i]."+keyFieldName));
				}
				
				if(isInputType){
					var obj = $('#'+inputTextId_splited);
					obj.val(values.join(','));
				}
				keyobj.val(keys.join(','));	
				
				if(singleSelect && singleSelectImmediaClosePanel){
					$('#'+inputTextId_splited+"_panel").panel('close');
				}
			}
			query( para.url, queryPara,function(data){
				if(data && data.length>0){
					$('#'+inputTextId_splited+"_panel_table").datagrid('loadData',{total:data.length,rows:data});
				}
			});
			
			inputText_panel_jobj.panel('close');
		}
		
		$(document).unbind(".mypanel").bind("mousedown.comp", function(e) {
			var p = $('#'+inputTextId_splited+"_panel");
			p.panel('close');
			p.attr('status','close');
		});
		
		inputText_jobj.unbind(".comp").bind("click.comp",function(e){
			var p = $('#'+inputTextId_splited+"_panel");
			if(p.attr('status')=='close'){
				p.panel('open');
				p.attr('status','orpen');
				//移动位置
				var thisobj = $(this);
				var oset = thisobj.offset();
				var outerheight = thisobj.outerHeight();
				/*p.panel({
						left: oset.left,
						top: oset.top + outerheight -1
					});
					
				
				var screenObj = $(document.documentElement);	// 屏幕对象
				if (para.height > screenObj.height()) {
					para.height = screenObj.height();
					p.panel({
						left: oset.left,
						top: screenObj.offset().top + 3
					});
				} else if ((oset.top + para.height) > screenObj.height()) {
					p.panel({
						left: oset.left,
						top: screenObj.height() - para.height - 5
					});
				} else {
					p.panel({
						left: oset.left,
						top: oset.top + outerheight -1
					});					
				}
				*/
				positionPanel(para.inputTextId);
				p.panel({border : false});
			}else{
				p.panel('close');
				p.attr('status','close');
			}
		})
		.bind("mousedown.comp", function(e) {
			/*
			var p = $('#'+inputTextId_splited+"_panel");
			if(p.attr('status')=='close'){
				p.panel('open');
				p.attr('status','open');
			}else{
				p.panel('close');
				p.attr('status','close');
			}*/
			
		});
		inputText_panel_jobj.unbind(".comp").bind("mousedown.comp", function(e) {
			return false;
		});
	};
	function initTree(obj){
		var para = $.data(obj, "comp").options;
		var treeExpended = $.data(obj, "comp").treeExpended;
		
		var keyId= para.inputKeyId == ''? para.inputTextId+'_ID':para.inputKeyId; 
		
		var root = para.tree.root || {id: 0, text: '根节点', state:'closed', attributes: {}};
		var rootCanChoice = para.tree.rootCanChoice || false;
		var cascadeCheck = para.tree.cascadeCheck || false;
		var queryPara = para.tree.queryPara || {} ;
		var superIdAttrName = para.tree.superIdAttrName;
		var isNodeLeafAttrName = para.tree.isNodeLeafAttrName ;
		var idAttrName = para.tree.idAttrName;
		var textAttrName = para.tree.textAttrName;
		var onlyLeafCheck = para.tree.onlyLeafCheck;
		
		var singleSelectImmediaClosePanel = para.singleSelectImmediaClosePanel;
		var singleSelect = para.singleSelect;
		
		
		var isInputType = para.isInputType ;
		
		var inputTextId_splited = para.inputTextId.replace(':','\\:');
		var inputText_jobj = $('#'+inputTextId_splited);
		var inputText_panel_jobj = $('#'+inputTextId_splited+"_panel");
		inputText_jobj.attr('_keyId',keyId);

		//多选，变宽
		if(!singleSelect){
			para.width+=30;
		}
		
		//初始化panel 和 input id 的html代码
		if(inputText_panel_jobj.size()==0){
			var w = para.width ;
			var h = para.height ;
			$('body').append('<div id="'+obj.id+'_panel" status="init" style="background:#fafafa;width:'+w+'px;height:'+h+'px;"><ul id="'+obj.id+'_panel_tree"></ul></div>');
			inputText_panel_jobj = $('#'+inputTextId_splited+"_panel");
			
			inputText_jobj.after('<input id="'+keyId+'" value="" style="display:none;" />');
			if(isInputType){
				inputText_jobj.attr('readonly',"readonly");
			}
		}
		
		//初始化 panel 和 table 的obj代码
		//alert(p.attr('status'));
		if(inputText_panel_jobj.attr('status')=='init'){
			positionPanel(para.inputTextId);
			
			inputText_panel_jobj.attr('status','close');

			
			$('#'+inputTextId_splited+"_panel_tree").tree({
				data: [root],
				animate: true,
				cascadeCheck: cascadeCheck ,
				checkbox: !singleSelect ,
				onlyLeafCheck: onlyLeafCheck,
				onClick:function(node){
					if(singleSelect)
						setInputValueByClick();
				},
				onCheck : function(_f5, _f6) {
					if(!singleSelect)
						setInputValueByOnCheck();
				},
				onSelect : function(_f8) {
					//if(singleSelect)
					//	setInputValueByOnSelect();
				},
				onBeforeExpand:function(node){
					alert(node.id);
					if(!treeExpended[node.id]){
						var q = queryPara;
						if(superIdAttrName!=''){
							eval("q."+superIdAttrName+"= node.id;");
						}
						query(para.url, q, function(list){
							var retTreeData = [];
							if(list!=null && list.length!=0){
								for(var i=0;i<list.length;i++){
									eval('var tmp = {id: list[i].'+idAttrName+', text: list[i].'+textAttrName+'};');
									if(''+tmp.text=='undefined') tmp["text"]='unknown text ';
									if(eval('!list[i].'+isNodeLeafAttrName+'')){//是否叶子节点
										tmp.state='closed';
									}
									tmp.attributes = list[i];
									//if(isChecked(tmp.id)){
									//	tmp.checked=true;
									//}
									retTreeData.push(tmp);
								}
								treeExpended[node.id]=true;
								 $('#'+inputTextId_splited+"_panel_tree").tree('append',{
									parent: node.target,
									data: retTreeData
								});
								 $('#'+inputTextId_splited+"_panel_tree").tree('expand',node.target);
							}
						});
						return false;
					}
				}
			});
			$('#'+inputTextId_splited+"_panel_tree").tree('expandAll');
			
			function setInputValueByClick(){
				var node = $('#'+inputTextId_splited+"_panel_tree").tree('getSelected');
				setInputValue([node]);
			}
			function setInputValueByOnSelect(){
				var node = $('#'+inputTextId_splited+"_panel_tree").tree('getSelected');
				setInputValue([node]);
			}
			function setInputValueByOnCheck(){
				var s = $('#'+inputTextId_splited+"_panel_tree").tree('getChecked');
				setInputValue(s);
			}
			function setInputValue(s){
				var keyobjid = keyId.replace(':','\\:');
				var keyobj = $('#'+keyobjid);

				var values = [];
				var keys = [];
				for(var i=0; s && i<s.length; i++){
					values.push(s[i].text);
					keys.push(s[i].id);
					if(!rootCanChoice && s[i].id == root.id ){
						values = [s[i].text ];
						keys = [ ];
						break;
					};
				}
				
				if(isInputType){
					var obj = $('#'+inputTextId_splited);
					obj.val(values.join(','));
				}
				keyobj.val(keys.join(','));	
				
				if(singleSelect && singleSelectImmediaClosePanel){
					$('#'+inputTextId_splited+"_panel").panel('close');
				}
			}
			
			
			inputText_panel_jobj.panel('close');
		}
		
		$(document).unbind(".mypanel").bind("mousedown.comp", function(e) {
			var p = $('#'+inputTextId_splited+"_panel");
			p.panel('close');
			p.attr('status','close');
		});
		
		bindCompEvent(obj);
		inputText_panel_jobj.unbind(".comp").bind("mousedown.comp", function(e) {
			return false;
		});
		
	};
	function query(url,para, callback){
		_log("comp");
		$.ajaxjson.post({url : url,
	        queryPara : para,   
			successFunc: function(data){
				callback(data);
			}
		});
	};
	
	//
	function positionPanel(inputTextId) {
		var inputTextId_splited = inputTextId.replace(':','\\:')
		var inputText_panel_jobj = $('#'+inputTextId_splited+"_panel");
		var inputText_jobj = $('#'+inputTextId_splited);
		var offsetObj = inputText_jobj.offset();
		var screenObj = $(document.documentElement);
		
		inputText_panel_jobj.panel({
			left: offsetObj.left,
			top: offsetObj.top + inputText_jobj.outerHeight() - 1,
			style: {
				position : "absolute",
				zIndex : 9001
			}
		});	
		//alert("screenObj.height():"+screenObj.height());
		var outerheight = inputText_jobj.outerHeight();
		if (inputText_panel_jobj.height() > screenObj.height()) {
			//alert(1);
			inputText_panel_jobj.panel({
				left: offsetObj.left,
				top: screenObj.offset().top + 5
				//height: screenObj.height() - 5
			});
		} else if ((offsetObj.top + inputText_panel_jobj.height()) > screenObj.height()) {
			//alert(2);
			//alert("screenObj.height():"+screenObj.height()+" - inputText_panel_jobj.height():"+ inputText_panel_jobj.height());
			inputText_panel_jobj.panel({
				left: offsetObj.left,
				top: screenObj.height() - inputText_panel_jobj.height() - 7
			});
		} else {
			//alert(3);
			inputText_panel_jobj.panel({
				left: offsetObj.left,
				top: offsetObj.top + outerheight -1
			});					
		}
	}
	
	function disabledCompEvent(obj, eventType) {
		$('#' + obj.id).unbind(eventType);
	}
	function activateCompEvent(obj) {
		bindCompEvent(obj);
	}
	
	function refreshData(obj){
		var para = $.data(obj, "comp").options;
		var inputTextId_splited = para.inputTextId.replace(':','\\:');
		var url = para.url;
		var qo = para.list.queryPara;
		
		query( url, qo,function(data){
			if(data && data.length>0){
				$('#'+inputTextId_splited+"_panel_table").datagrid('loadData',{total:data.length,rows:data});
			}
		});
	}
	
	// 绑定事件
	function bindCompEvent(obj) {
		
		var para = $.data(obj, "comp").options;
		var keyId= para.inputKeyId == ''? para.inputTextId+'_ID':para.inputKeyId; 
		var inputTextId_splited = para.inputTextId.replace(':','\\:');
		var inputText_jobj = $('#'+inputTextId_splited);
		inputText_jobj.attr('_keyId',keyId);
		
		inputText_jobj.unbind(".comp").bind("click.comp",function(e){
			var p = $('#'+inputTextId_splited+"_panel");
			if(p.attr('status')=='close'){
				p.panel('open');
				p.attr('status','open');
				//移动位置
				var thisobj = $(this);
				var oset = thisobj.offset();
				var outerheight = thisobj.outerHeight();
				/*
				p.panel({
					left: oset.left ,
					top: oset.top + outerheight - 1
				});
				*/
				positionPanel(para.inputTextId);
				
			}else{
				p.panel('close');
				p.attr('status','close');
			}
		}).bind("mousedown.comp", function(e) {
			/*var p = $('#'+inputTextId_splited+"_panel");
			if(p.attr('status')=='close'){
				p.panel('open');
				p.attr('status','open');
			}else{
				p.panel('close');
				p.attr('status','close');
			}*/			
		});
	}

	$.fn.comp = function(para, args) {
		if (typeof para == "string") {
			return $.fn.comp.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "comp");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				//_9 = $.data(this, "comp", {
				//	options : para
				//});
				$.data(this, "comp", {
					options : $.extend( {}, $.fn.comp.defaults, para),
					treeExpended :{}
				});
				init(this);
			}
		});
	};
	$.fn.comp.methods = {
		disabledCompEvent: function(jq, eventType){
			disabledCompEvent(jq[0], eventType);
		},
		activateCompEvent: function(jq, eventType){
			activateCompEvent(jq[0], eventType);
		},
		refreshData:function(jq, eventType){
			refreshData(jq[0], eventType);
		}
	};
	$.fn.comp.defaults = {
		inputTextId:'',//必填
		inputKeyId:'',//必填
		url:'',//必填
		width: 180,
		height: 260,
		isInputType: true,
		singleSelect: true,
		
		singleSelectImmediaClosePanel: false,//单选时是否立即关闭

		type: 'list', // list , tree
		
		//对象组装需要另外做。
		list: {
			keyFieldName:'id',
			valueFieldName:'text' ,
			keyTitleName:'编号',
			valueTitleName:'名称' 
			
		},
		tree: {
			cascadeCheck: false,
			queryPara: {},//查询参数
			rootCanChoice: false,//根节点可选
			
			superIdAttrName: '',//必填 superId，如 modelObj.superId
			isNodeLeafAttrName: '', //必填 是否是叶子节点  如isLeaf_tree
			idAttrName: '',//必填
			textAttrName: '',//必填
			onlyLeafCheck : false,
			
			root : {id: 0, text: '根节点', state:'closed', attributes: {}}
		},
		onChange: function(data) {
			alert(111)
		}
	};
})(jQuery);