(function($) {
	
	// 初始化
	function init(obj, parain) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		var oset = $(obj).offset();
		var blankwzId = outId + '_blankwz';
		
		$.extend(para, parain || {});
		
		/* 清空 */
		$('#' + outId + '_tabdiv').each(function() {
			$(this).remove();
		});
		$('#' + blankwzId).each(function() {
			$(this).remove();
		});
		$("#" + para.iframeWorkzoneId + " > iframe").each(function() {
			$(this).remove();
		});
		
		// style='position: absolute; top:" + oset.top + ";left:" + oset.left + ";'
		$("<div id='" + outId + "_tabdiv'></div>").appendTo($('#' + outId));
		
		var str = ['<ul class="indexTab">',
        '<li class="firstLi"></li>',
        '<li class="closeLi">',
        	'<span class="picMouseOut" title="关闭所有选项卡"></span>',
        '</li>',
        '<li class="lastLi"></li>',
      '</ul>'];
		
		var blankul = ['<ul style="display: none;" id="' + blankwzId + '">',
    	'<li class="tabItem" title="" index="0" preMenuId="-1" menuId="-1">',
    		'<div class="wz-icon"></div>',
            '<div class="con"></div>',
            '<div class="picMouseOut"></div>',
        '</li>',
        '<li class="tabItemSide" index="0"></li>',	
     '</ul>'];		
		
		$("#" + outId + "_tabdiv").append(str.join(''));
		
		// 如果不显示关闭按钮
		if ("" + para.haveCloseAllIcon == "false") {
			hideAllCloseIcon(obj);
		}
		
		$(blankul.join('')).appendTo($('#' + outId));
		tabEventBind(obj);

		var list = para.nodes;
		// 默认打开第一个
		if (list && list != null && list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				open(obj, list[i]);
			}
			open(obj, list[0]);
		}
		
	};
	
	// 选项卡绑定
	function tabEventBind(obj, node) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		
		// 关闭单个选项卡
		$('#' + outId + '_tabdiv .indexTab .tabItem .picMouseOut').each(function(index) {
			$(this).unbind(".myworkz").bind("mouseover.myworkz",function() {
				$(this).removeClass('picMouseOut');
				$(this).addClass('picMouseOver');
			}).bind("mouseout.myworkz",function() {
				$(this).removeClass('picMouseOver');
				$(this).addClass('picMouseOut');
			}).bind("click.myworkz",function() {
				var index = $(this).parent().attr('index');
				closeByIndex(obj, index);
			});
		});
		// 鼠标移动事件、关闭所有选项卡
		$('#' + outId + '_tabdiv .indexTab .closeLi .picMouseOut').each(function() {
			$(this).unbind(".myworkz").bind("mouseover.myworkz",function() {
				$(this).removeClass('picMouseOut');
				$(this).addClass('picMouseOver');
			}).bind("mouseout.myworkz",function() {
				$(this).removeClass('picMouseOver');
				$(this).addClass('picMouseOut');
			}).bind("click.myworkz",function() {
				closeAll(obj);
			});												   
		});
		// span单击事件//激活一下
		$('#' + outId+'_tabdiv .indexTab .tabItem .con').unbind(".myworkz").bind("click.myworkz",function() {
			var tmp = $(this);
			var index = tmp.parent().attr('index');
			tabClickEvent(obj, index);			
		});	
	};
	
	// 清空样式
	function clearAllClickStatus(outId) {
		$("#" + outId + "_tabdiv .indexTab ").each(function() {
			$(this).find('.tabItemClick').removeClass('tabItemClick');
		});
		$("#" + outId + "_tabdiv .indexTab > li[class='tabItemLeft']").each(function() {
			$(this).removeClass('tabItemLeft');
			$(this).addClass('tabItemSide');
		});
		$("#" + outId + "_tabdiv .indexTab > li[class='tabItemRight']").each(function() {
			$(this).removeClass('tabItemRight');
			$(this).addClass('tabItemSide');
		});
		$("#" + outId + "_tabdiv .indexTab > li[class='tabItemLast']").each(function() {
			$(this).removeClass('tabItemLast');
			$(this).addClass('tabItemSide');
		});
		$("#" + outId + "_tabdiv .indexTab > li[class='tabItemLastClick']").each(function() {
			$(this).removeClass('tabItemLastClick');
			$(this).addClass('tabItemSide');
		});
		$("#" + outId + "_tabdiv .indexTab > li:first").each(function() {
			$(this).removeClass('firstLiClick');
			$(this).addClass('firstLi');
		});
	};
	
	// 隐藏所有关闭按钮
	function hideAllCloseIcon(obj) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		var ulobj = $('#' + outId + '_tabdiv .indexTab');
		ulobj.find('.closeLi').hide();
		ulobj.find('.lastLi').hide();
	};
	
	// 通过index激活lazy的选项卡
	function activateTabByIndex(obj, index) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		if (para.lazyLoadUrl) {
			var para = $.data(obj, "workzone").options;
			var outId = obj.id;
			var nodeIframe =  $('#' + outId + "_iframe_" + index);
			var url = nodeIframe.attr('lazyUrl');
			nodeIframe.attr('src', url);
		}
		tabClickEvent(obj, index);
	}
	
	// 选项卡点击事件
	function tabClickEvent(obj, index) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		
		//取出当前的index，看看是不是一样
		var oldIndex = $('#' + outId + '_tabdiv .indexTab .tabItemClick').attr('index');
		if("" + oldIndex == "" + index) return ;	
		var u = $('#' + outId + '_tabdiv .indexTab');	// ul
		var cti = $('#' + outId + '_tabdiv .tabItem[index="' + index + '"]');// 当前选项卡li
		clearAllClickStatus(outId);		
		cti.addClass('tabItemClick');		
		var name = cti.attr("title");
		$('#' + outId + '_tabdiv .tabItem[index="' + index + '"] .con').html(name);
		
		// 改变与当前li相邻的前后li的背景图
		if(cti.prev().hasClass('firstLi')) {
			cti.prev().removeClass('firstLi');
			cti.prev().addClass('firstLiClick')
		} else {
			cti.prev().removeClass('tabItemSide');
			cti.prev().addClass('tabItemLeft')
		}
		cti.next().removeClass('tabItemSide');
		cti.next().addClass('tabItemRight');
		// 去除关闭按钮
		$("#" + para.iframeWorkzoneId + " > iframe").hide();
		$("#" + outId + "_iframe_" + index).show();
		
		if (""+para.haveCloseAllIcon == "false") {
		// 如果关闭所有的按钮，需要隐藏
			var closeLiPre =  $('#' + outId + '_tabdiv .indexTab .closeLi').prev();
			if (closeLiPre.hasClass('tabItemRight')) {
				closeLiPre.removeClass('tabItemRight');
				closeLiPre.addClass('tabItemLastClick')
			} else if (closeLiPre.hasClass('tabItemSide')) {
				closeLiPre.removeClass('tabItemSide');
				closeLiPre.addClass('tabItemLast')
			}
		}
		
		/*
		var invokeObj= null;
		try {
			invokeObj = document.getElementById(outId + "_iframe_" + index  ).contentWindow;
		} catch(e) {
			try {
				invokeObj = frames[outId + "_iframe_" + index ];
			} catch(e) {}
		}
		var ifobj = $("#" + outId + "_iframe_" + index);
		para.onClickInvokeIframeMethod.call(invokeObj, index, ifobj.attr('title'), ifobj.attr('menuId'));
		 */
		
		
			var iframeObj = null;
			try {
				iframeObj = document.getElementById(outId + "_iframe_" + index  ).contentWindow;
				//eval("document.getElementById('" + outId + "_iframe_" + index + "').contentWindow." 
				//		+ met + "();");
			} catch(e) {
				//try {
				//	eval("frames['" + outId + "_iframe_" + index + "']." + met + "();");
				//} catch(e) {}
				alert('无法使用getElementById().contentWindow');
			}
			try{
				iframeObj.$('body').layout('resize');
			} catch(e) { }

			var met = para.onClickInvokeIframeMethod;
			if (met != null && met.length != 0) {
				try{
				eval("iframeObj."+met+"();");
				}catch(e){}
			}
		
	};

	// 打开一个选项卡
	function open(obj, node) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;		
		
		//$("#" + node.iframeWorkzoneId + " > iframe").hide();		
		
		var isReturn = false;
		$('#' + outId + '_tabdiv .indexTab .tabItem ').each(function() {
			var title = $(this).attr("title");
			var index = $(this).attr("index");
			
			/* 保证menuId唯一 */
			if("" + node.menuId != "undefined") {
				var menuId = $(this).attr('menuId');
				if("" + node.menuId == "" + menuId) {
					tabClickEvent(obj, index);
					isReturn = true;
				}
			} else {
				if (title == node.title) {
					tabClickEvent(obj, index);
					isReturn = true;
				}
			}			
		});		
		if(isReturn) return ;// 找到相同的，返回
		
		if (para.maxTabNum != -1 && para.maxTabNum == getTabNum(obj)) {
			var met = para.maxTabOverInvokeMethod;
			if (met != null && met.length != 0) {
				eval(met + "();");
			}
			para.waitOpenNodeBecauseMax = node;
			//open default
			if(para.maxTabOverOpenChoiceDialog){
				openWorkzoneChoiceDialog(obj);
			}
			return;
		}
		
		// 新创建一个tab
		var index = -1;
		$('#' + outId + '_blankwz > li').each(function() {
			
			// haveClose为true则显示、否则隐藏
			if ("" + node.haveClose == "false") {
				$(this).find('.picMouseOut').hide();
			} else {
				$(this).find('.picMouseOut').show();
			}
			
			var oindex = $(this).attr('index');
			index  = parseInt(oindex) + 1 ;
			$(this).attr('index', index);
			$(this).attr('title', node.title);
			if("" + node.menuId != "undefined") {	
				$(this).attr('menuId', node.menuId);
			}
			$(this).find('.con').html(node.title);
			if (node.iconCls) {
				$(this).find("div.wz-icon").addClass(node.iconCls);
				$(this).find("div.wz-icon").show();
			}
		});
		var bwz = $('#' + outId + '_blankwz');
		$('#' + outId + '_tabdiv .closeLi').before(bwz.html());		
		$('#' + outId + '_blankwz > li').each(function() {
			$(this).attr('title', "");			
			$(this).attr('menuId', "-1");			
			$(this).find('.con').html("");
			if (node.iconCls) {
				$(this).find("div.wz-icon").removeClass(node.iconCls);
				$(this).find("div.wz-icon").hide();
			}
		});
		
		// 绑定事件
		tabEventBind(obj, node);
		
		var url = node.url;
		if (para.lazyLoadUrl) {
			url = "";
		}
		
		var menuId = -1;
		if("" + node.menuId != "undefined") {	
			menuId = node.menuId;
		}
		
		$("<iframe index='" + index + "' title='" + node.title + "' menuId='" + menuId + "' frameborder='0' width='100%' height='100%' id='" + outId + "_iframe_" 
				+ index + "' src='" + url + "' lazyUrl='" + node.url + "' style='background: #fff;'></iframe>").appendTo("#" + para.iframeWorkzoneId);
		tabClickEvent(obj, index); 
	};
	
	// 通过索引删除
	function closeByIndex(obj, index) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		var nowOpenIndex = $("#" + outId + "_tabdiv .indexTab .tabItemClick ").attr('index');		
		var nextClickIndex = -1;
		if("" + nowOpenIndex == "" + index) {
			var cti = $('#' + outId+'_tabdiv .tabItem[index="' + index + '"]');
			if(cti.prev().hasClass('firstLi') || cti.prev().hasClass('firstLiClick')) {				
				
				// 看看后面有没有
				$('#' + outId+'_tabdiv .indexTab >li[index="' + index + '"]').each(function(index) {
					if(index == 1 && !$(this).next().hasClass('closeLi')) {
						nextClickIndex = $(this).next().attr('index');
					}
				});
			} else {
				//打开前面的tab
				nextClickIndex = cti.prev().attr('index');
			}
		} else {
			nextClickIndex = nowOpenIndex;
		}		
		$( "#" + outId + "_tabdiv .indexTab > li[index='" + index +"']").remove();
		clearAllClickStatus(outId);			
		if(nextClickIndex != -1) {
			tabClickEvent(obj, nextClickIndex);
		}		
		$("#" + outId + "_iframe_" + index).remove();
		
		if (para.defaultOpenedNode != null) {
			if (getTabNum(obj) == 0) {
				open(obj, para.defaultOpenedNode);
			}
		}
	};
	
	// 删除所有
	function closeAll(obj) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		var conf = true;
		if(para.closeAllByTip){
			conf = confirm('关闭所有工作区？');
		}
		if(conf){
			$("#" + para.iframeWorkzoneId + " > iframe").each(function() {
				var index = $(this).attr('index');
				closeByIndex(obj, index);
			});
			if (para.defaultOpenedNode != null) {
				open(obj, para.defaultOpenedNode);
			}
		}
	};
	
	// 获取当前激活状态选项卡的信息
	function getCurrentClickTabNode(obj) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		var node = {};
		var oo = $('#' + outId + '_tabdiv .indexTab').find('.tabItemClick');
		node.title = oo.attr('title');
		node.index = oo.attr('index');
		node.menuId = oo.attr('menuId');
		node.url = $('#' + outId + "_iframe_" + node.index).attr('lazyUrl');
		//$.winmess.alert("当前选项卡属性", "Title = \"" + node.title +"\"<br/>Index = " + node.index + "<br/>MenuId = " 
		//		+ node.menuId + "<br/>URL = \"" + node.url + "\"");
		return node;
	};
	function getAllTabNode(obj) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		
		var nodes = [];
		$("#" + para.iframeWorkzoneId + " > iframe").each(function() {
			var index = $(this).attr('index');
			var node = {};
			node.title = $(this).attr('title');
			node.index = $(this).attr('index');
			node.menuId = $(this).attr('menuId');
			node.url = $(this).attr('lazyUrl');
			nodes.push(node);
		});
		return nodes;
	};
	function getTabNodeByIndex(obj, index) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		
		var node = null;
		$("#" + para.iframeWorkzoneId + " > iframe").each(function() {
			var i = $(this).attr('index');
			if(""+index == ""+i){
				node = {};
				node.title = $(this).attr('title');
				node.index = $(this).attr('index');
				node.menuId = $(this).attr('menuId');
				node.url = $(this).attr('lazyUrl');
				node.id = $(this).attr('id');
			}
		});
		return node;
	};
	function getTabNum(obj) {
		var para = $.data(obj, "workzone").options;
		return $("#" + para.iframeWorkzoneId + " > iframe").length;
	};
	function getWaitOpenNodeBecauseMax(obj){
		var para = $.data(obj, "workzone").options;
		return para.waitOpenNodeBecauseMax;
	}
	function openWorkzoneChoiceDialog(obj) {
		var para = $.data(obj, "workzone").options;
		var outId = obj.id;
		
		var id = outId + '_choice_work_zone';
		var t = $('#'+id);
		if(t.size()==0) {
			// append body div
			var choiceDiv = ["<div id='" + id + "' style='display: none;'>",
				"<div class='easyui-layout' id='"+id+"_layout' fit='true'>",
					"<div region='center' border='false'' style='padding: 5px; overflow: hidden;'>",
						"<form id='"+id+"_form' >",
						"</form>",
					"</div>",
					"<div region='south' border='false' style='height: 34px; line-height: 32px; padding-right: 3px; text-align: right; padding: 5px; overflow: hidden; border-top: 1px solid #99bbe8;'>",
						"<a href='javascript:void(0);' id='"+id+"_btnok' decorateWait='true' type='rectCrystal' iconCls='icon-ok' class='easyui-linkbutton' style='margin-right: 3px;'>确定</a>",
						"<a href='javascript:void(0);' id='"+id+"_btnclose' decorateWait='true' type='rectCrystal' iconCls='icon-cancel' class='easyui-linkbutton'>取消</a>",
					"</div>",
				"</div>",
			"</div>"];
			$('body').append(choiceDiv.join(''));
			$('#'+id).winp({
				width: 340,
				height: 200,
				title : "请选择要替换的工作区",
				collapsible : false,
				minimizable : false,
				maximizable : false,
				closable : true,
				modal: true,
				resizable: true,
				closed: true
			});
			
			$('a[decorateWait="true"]').linkbutton({});
			$('a[decorateWait="true"]').attr('decorateWait','false');
			$('#' + id + '_layout').layout({});
			setTimeout(function(){
				$('#' + id + '_layout').layout('resize');
			},100);
			
			
			
			$('#' + id + '_btnclose').unbind('.btnclose').bind('click.btnclose',function() {
				$("#"+id).winp("close");
			});
			$('#' + id + '_btnok').unbind('.btnclose').bind('click.btnclose',function() {
				var v = $('input:radio[name="'+id+'_radio"]:checked').val();
				$('#'+outId).workzone('closeByIndex', v);
				$('#'+outId).workzone('open', $('#'+outId).workzone('getWaitOpenNodeBecauseMax') );
				$("#"+id).winp("close");
			});
			
		}
		
		//data
		$("#" + id + "_form").html("");
		var nodes = getAllTabNode(obj);
		for (var i = 0; i < nodes.length; i++) {
			var n = nodes[i];
			$("<li style='float: left; width: 150px; list-style: none; overflow: hidden; line-height: 25px;'><input type='radio'" 
					+ (i == 0 ? "checked" : "") + " name='" + id + "_radio' id='" + id + "_radio_" 
					+ n.index + "' value='" + n.index + "' /><label for='" + id + "_radio_" + n.index + "'>" 
					+ n.title + "</label></li>").appendTo($("#" + id + "_form"));
		}
		
		$('#'+id).winp('open');
		$('#'+id).show();
	}
	$.fn.workzone = function(para, args) {
		if (typeof para == "string") {
			return $.fn.workzone.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "workzone");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				$.data(this, "workzone", {
					options : $.extend( {}, $.fn.workzone.defaults, para )			
				});
				init(this);
			}
		});
	};
	
	/**
	 * 方法
	 */
	$.fn.workzone.methods = {
		// 重新加载组件
		reload : function(jq, para) {  // para = defaults
			init(jq[0], para);
		},
		// 通过index点击选项卡
		clickByIndex : function(jq, index) {
			tabClickEvent(jq[0], index);
		},
		// 通过title点击选项卡
		clickByTitle : function(jq, title) {
			var obj = jq[0];
			var index = $('#' + obj.id + '_tabdiv .indexTab .tabItem[title="' + title + '"]').attr('index');
			tabClickEvent(obj, index);
		},
		// 通过menuId点击选项卡
		clickByMenuId : function(jq, menuId) {
			var obj = jq[0];
			var index = $('#' + obj.id + '_tabdiv .indexTab .tabItem[menuId="' + menuId + '"]').attr('index');
			tabClickEvent(obj, index);
		},
		// 通过index激活选项卡
		activateTabByIndex : function(jq, index) {
			activateTabByIndex(jq[0], index);
		},
		// 通过title激活选项卡
		activateTabByTitle : function(jq, title) {
			var obj = jq[0];
			var index = $('#' + obj.id + '_tabdiv .indexTab .tabItem[title="' + title + '"]').attr('index');
			activateTabByIndex(obj, index);
		},
		// 通过menuId激活选项卡
		activateTabByMenuId : function(jq, menuId) {
			var obj = jq[0];
			var index = $('#' + obj.id + '_tabdiv .indexTab .tabItem[menuId="' + menuId + '"]').attr('index');
			activateTabByIndex(obj, index);
		},
		// 添加
		open : function(jq, node) { // node : {menuId: 123, title:'xxxx', url:'', haveClose: true(默认) }  
			open(jq[0], node);
		},
		// 通过index关闭选项卡
		closeByIndex : function(jq, index) {
			closeByIndex(jq[0],index);
		},
		// 通过title关闭
		closeByTitle : function(jq, title) {
			var obj = jq[0];
			var index = $('#' + obj.id + '_tabdiv .indexTab .tabItem[title="' + title + '"]').attr('index');
			closeByIndex(obj, index);
		},
		// 通过menuId关闭
		closeByMenuId : function(jq, menuId) {
			var obj = jq[0];
			var index = $('#' + obj.id + '_tabdiv .indexTab .tabItem[menuId="' +  menuId + '"]').attr('index');
			closeByIndex(obj, index);
		},
		// 关闭当前为激活状态的选项卡
		closeCurrentTab : function(jq) {
			var node = getCurrentClickTabNode(jq[0]);
			closeByIndex(jq[0], node.index);
		},
		// 关闭所有选项卡
		closeAll : function(jq) {
			closeAll(jq[0]);
		},
		// 获取当前为激活状态的选项卡节点信息
		getCurrentClickTabNode: function(jq) { // node : {index: 1, menuId: 123, title:'xxxx', url:'' }
			return getCurrentClickTabNode(jq[0]);
		},
		// 通过index获取节点信息
		getTabNodeByIndex: function(jq, index) { // node : {index: 1, menuId: 123, title:'xxxx', url:'' }
			return getTabNodeByIndex(jq[0], index);
		},
		// 获取所有的节点
		getAllTabNode: function(jq) { // nodes : [{index: 1, menuId: 123, title:'xxxx', url:'' }]
			return getAllTabNode(jq[0]);
		},
		// 获取选项卡的个数
		getTabNum: function(jq) { 
			return getTabNum(jq[0]);
		},
		// 获取超出最大打开数的节点信息
		getWaitOpenNodeBecauseMax: function(jq){
			return getWaitOpenNodeBecauseMax(jq[0]);
		},
		// 当打开的选项卡的个数大于maxTabNum时，打开工作区替换对话框
		openWorkzoneChoiceDialog: function(jq){
			openWorkzoneChoiceDialog(jq[0]);
		}
	};
	
	$.fn.workzone.defaults = {
		iframeWorkzoneId: "",	// 用于显示iframe内容的容器
		nodes: [] , // node : {menuId: 123, title:'xxxx', url:'', haveClose: true(默认) }
		haveCloseAllIcon: true, // 是否显示“关闭所有”按钮(默认显示)
		onClickInvokeIframeMethod: null ,// function(index, title, menuId){		},	// 点击选项卡调用的方法
		defaultOpenedNode: null,  // 默认打开的节点， node : {menuId: 123, title:'xxxx', url:'', haveClose: true(默认) }
		maxTabNum: -1,		// 最大打开个数， -1不限制最大个数
		maxTabOverInvokeMethod: null, // 当前选项卡个数超过maxTabNum个数调用该方法
		maxTabOverOpenChoiceDialog: false, //当前选项卡个数超过maxTabNum个数 是否调用默认工作区替换对话框
		lazyLoadUrl: false,	// 延迟加载所有URL，激活url必须调用activitTab....的方法
		closeAllByTip: true // 关闭所有时自动提示用户
	};
	
})(jQuery);