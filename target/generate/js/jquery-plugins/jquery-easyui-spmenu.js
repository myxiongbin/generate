(function($) {
	// 初始化
	function init(obj) {
		var para = $.data(obj, "spmenu").options;
		
		var str = ["<div class=\"spmenu-border-wrap\">",
		"<div class=\"spmenu-top\">",
			"<div class='spmenu-top-left'></div>",
			"<div class='spmenu-top-center'>",
				"<div class='spmenu-title-icon'></div>",
				"<div class='spmenu-title-text'></div>",
			"</div>",
			"<div class='spmenu-top-right'></div>",
		"</div>",
		"<div class=\"spmenu-middle\">",
			"<div class=\"spmenu-middle-left\">",
				"<div class=\"spmenu-left-top\"></div>",
				"<div class=\"spmenu-left-bottom\"></div>",
			"</div>",
			"<div class=\"spmenu-middle-center\"></div>",
			"<div class=\"spmenu-middle-right\">",
				"<div class=\"spmenu-expand\"></div>",
				"<div class=\"spmenu-right-top\"></div>",
				"<div class=\"spmenu-right-bottom\"></div>",
			"</div>",
		"</div>",
		"<div class=\"spmenu-bottom\"></div>",
	"</div>"];
		
		if ("" + para.border == "true") {
			$("#" + obj.id).append(str.join(""));
		}
		if ("" + para.expand == "true") {
			initExpand(obj);
		}
		if ("" + para.title.show == "true") {	// 显示title
			$(obj).find("div.spmenu-title-icon").addClass(para.title.iconCls || para.titleIconCls);
			$(obj).find("div.spmenu-title-text").html(para.title.text || para.titleText);
		} else {
			$(obj).find("div.spmenu-top").height(0);
			$(obj).find("div.spmenu-middle").css("top", "0");
		}
		
		// 初始化循环添加菜单选项
		var firstMenuList = [];
		for (var i = 0; i < para.nodes.length; i++) {
			//add(obj, para.nodes[i]);
			if ("" + para.nodes[i].parentMenuId == "undefined" || "" + para.nodes[i].parentMenuId == "0") {
				para.nodes[i].parentMenuId = "0";
				add(obj, para.nodes[i]);
				firstMenuList.push(para.nodes[i]);
			}
		}
		
		for(var j = 0; firstMenuList && firstMenuList != null && j < firstMenuList.length; j++) {
			appendMenuToParent(obj, firstMenuList[j]);
		}
		
		openDefaultMenu(obj);
		
		// 动态改变二级菜单所在DIV的高度
		$(window).resize(function() {
			setTimeout(function() {
				reloadMenuListWrap(obj);
				if ("" + para.expand == "true") {
					positionExpand(obj);
				}
			}, 200);
		});
	};
	
	function initExpand(obj) {
		positionExpand(obj);
		bindExpand(obj);
		$("#" + obj.id + " div.spmenu-expand").addClass("spmenu-expand-bg1");
		$("#" + obj.id + " div.spmenu-expand").show();
	};
	
	function positionExpand(obj) {
		var totalHeight = $("#" + obj.id + " div.spmenu-middle-right").height();
		var expandHeight = $("#" + obj.id + " div.spmenu-expand").height();
		$("#" + obj.id + " div.spmenu-expand").css("top", totalHeight / 2 - (expandHeight / 2));
	};
	
	function bindExpand(obj) {
		var para = $.data(obj, "spmenu").options;
		$("#" + obj.id + " div.spmenu-expand").unbind("click").bind("click", function() {
			if (para.onClickExpand) {
				// 回调
				para.onClickExpand.call();
				if ($(this).hasClass("spmenu-expand-bg1")) {
					$(this).removeClass("spmenu-expand-bg1").addClass("spmenu-expand-bg2");
				} else {
					$(this).removeClass("spmenu-expand-bg2").addClass("spmenu-expand-bg1");
				}
			}
		});
	};
	
	// 递归向父级菜单中添加子菜单
	function appendMenuToParent(obj, pnode){
		var para = $.data(obj, "spmenu").options;
		var clist = getMenusByParentMenuId(obj, pnode.menuId);
		
		for(var j = 0; clist && clist != null && j < clist.length; j++){
			add(obj, clist[j]);
			appendMenuToParent(obj, clist[j] );
		}
	};
	
	// 通过父级菜单ID找到对应的子菜单列表
	function getMenusByParentMenuId(obj, parentMenuId) {
		var para = $.data(obj, "spmenu").options;
		var children = [];
		for (var i = 0; i < para.nodes.length; i++) {
			if(para.nodes[i].parentMenuId == parentMenuId){
				children.push(para.nodes[i]);
			}
		}
		return children;
	};
	
	// 重新加载二级菜单所在DIV的高度
	function reloadMenuListWrap(obj) {
		var para = $.data(obj, "spmenu").options;
		var menuObjHeight = $("#" + obj.id).height();
		var firstMenuHeight = $("#" + obj.id + " div.first-menu-wrap").height();
		var firstMenuCount = $("#" + obj.id + " div.first-menu-wrap").length;
		if ("" + para.border == "true") {
			var borderTopHeight = $("#" + obj.id + " div.spmenu-top").height();
			var borderBottomHeight = $("#" + obj.id + " div.spmenu-bottom").height();
			$("#" + obj.id + " div.menu-list-wrap").css("height", menuObjHeight 
					- (firstMenuHeight * firstMenuCount + borderTopHeight + borderBottomHeight));
		} else {
			$("#" + obj.id + " div.menu-list-wrap").css("height", menuObjHeight 
					- (firstMenuHeight * firstMenuCount));
		}
	};
	
	// 清空一级菜单的样式
	function clear(obj) {
		$("#"+ obj.id +" div").each(function() {
			if ($(this).hasClass("first-title-left-press")) {
				$(this).removeClass("first-title-left-press").addClass("first-title-left-normal");
			}
			if ($(this).hasClass("first-title-center-press")) {
				$(this).removeClass("first-title-center-press").addClass("first-title-center-normal");
			}
			if ($(this).hasClass("first-title-right-press")) {
				$(this).removeClass("first-title-right-press").addClass("first-title-right-normal");
			}
			if ($(this).hasClass("first-title-img-click")) {
				$(this).removeClass("first-title-img-click").addClass("first-title-img");
			}
		});
		$("#" + obj.id + " div.menu-list-wrap").each(function() {
			$(this).slideUp("fast");
		});
	};
	
	// 绑定一级菜单
	function bindEventFirstMenu(obj) {
		$("#" + obj.id + " div.first-menu-wrap").each(function() {
			$(this).unbind(".fm").bind("mouseover.fm", function() {
				firstMenuOver($(this));
			}).bind("mouseout.fm", function() {
				firstMenuOut($(this));
			}).bind("click.fm", function() {
				if ($(this).next("div.menu-list-wrap").css("display") == "none") {
					clear(obj);
					openFirstMenu($(this));
				}
			});
		});
	};
	
	// 点击菜单时打开一级菜单
	function openFirstMenu(firstMenuWrap) {
		firstMenuWrap.find(".first-title-left-hover").removeClass("first-title-left-hover").addClass("first-title-left-press");
		firstMenuWrap.find(".first-title-center-hover").removeClass("first-title-center-hover").addClass("first-title-center-press");
		firstMenuWrap.find(".first-title-right-hover").removeClass("first-title-right-hover").addClass("first-title-right-press");
		firstMenuWrap.find(".first-title-img").removeClass("first-title-img").addClass("first-title-img-click");
		firstMenuWrap.next("div.menu-list-wrap").slideDown("fast");		
	}
	
	// 通过菜单编号打开一级菜单选项
	function openFirstMenuByMenuId(obj, menuId) {
		var firstMenuWrap = $("#" + obj.id + " div.first-menu-wrap[menuId=\"" + menuId + "\"]");
		firstMenuWrap.find(".first-title-left-normal").removeClass("first-title-left-normal").addClass("first-title-left-press");
		firstMenuWrap.find(".first-title-center-normal").removeClass("first-title-center-normal").addClass("first-title-center-press");
		firstMenuWrap.find(".first-title-right-normal").removeClass("first-title-right-normal").addClass("first-title-right-press");
		firstMenuWrap.find(".first-title-img").removeClass("first-title-img").addClass("first-title-img-click");
		setTimeout(function() {
			firstMenuWrap.next("div.menu-list-wrap").slideDown("fast");
		}, 1);
	}
	
	// 鼠标移入
	function firstMenuOver(divObj) {
		divObj.find(".first-title-left-normal").removeClass("first-title-left-normal").addClass("first-title-left-hover");
		divObj.find(".first-title-center-normal").removeClass("first-title-center-normal").addClass("first-title-center-hover");
		divObj.find(".first-title-right-normal").removeClass("first-title-right-normal").addClass("first-title-right-hover");
	}
	
	// 鼠标移除
	function firstMenuOut(divObj) {
		divObj.find(".first-title-left-hover").removeClass("first-title-left-hover").addClass("first-title-left-normal");
		divObj.find(".first-title-center-hover").removeClass("first-title-center-hover").addClass("first-title-center-normal");
		divObj.find(".first-title-right-hover").removeClass("first-title-right-hover").addClass("first-title-right-normal");
	}
	
	// 初始化一级菜单
	function initFirstMenu(obj, menuId) {
		var para = $.data(obj, "spmenu").options;
		if (!menuId || menuId == null) {
			for (var i = 0; i < para.nodes.length; i++) {
				//add(obj, para.nodes[i]);
				if ("" + para.nodes[i].parentMenuId == "undefined" || "" + para.nodes[i].parentMenuId == "0") {
					menuId = para.nodes[i].menuId;
					break;
				}
			}
		}
		clear(obj);
		openFirstMenuByMenuId(obj, menuId);
	}; 
	
	// 判断是否存在相同的menuId
	function alreadyExist(obj, node) {
		var is = false;
		$("#" + obj.id + " *").each(function() {
			if ($(this).attr("menuId") == node.menuId) {
				alert("存在相同的menuId，添加失败");
				is = true;
			}
		});		
		return is;
	};
	
	// 添加一级菜单
	function addFirstMenu(obj, node) {
		var para = $.data(obj, "spmenu").options;
		
		if ("" + node.closed == "undefined") {
			node.closed = "true";
		}
		var str= [
		    "<div class=\"first-menu-wrap\" parentMenuId=\"0\" closed=\"" + node.closed + "\" menuId=\"" + node.menuId + "\" title=\"" + node.title + "\">",
		        "<div class=\"first-title-left-normal\"></div>",
		      	    "<div class=\"first-title-center-normal\">",
		      		    "<div class=\"first-title-text\">" + node.title + "</div>",
		      		    "<div class=\"first-title-img\"></div>",
		      	    "</div>",
	      	    "<div class=\"first-title-right-normal\"></div>",
      	    "</div>",
	      	"<div class=\"menu-list-wrap\">",
	      	    "<ul class=\"menu-list\"></ul>",
      	    "</div>"];
		
		if ("" + para.border == "true") {
			$("#" + obj.id + " div.spmenu-middle-center").append(str.join(""));
		} else {
			$("#" + obj.id).append(str.join(""));
		}
		
		// 添加的类型
		if (node.type == "iframe") {
			var con = "<iframe src=\"" + node.src + "\" frameborder=\"0\" width=\"100%\" height=\"100%\"></iframe>";
			$("#" + obj.id + " div[menuId=\"" + node.menuId + "\"]").next("div.menu-list-wrap").html(con);
		}
		
		// 有图标的情况
		if (node.iconCls && node.iconCls != "") {
			var iconStr = [
               "<div class=\"first-title-ico\">",
      			    "<div class=\"first-title-ico-pos " + node.iconCls + "\"></div>",
      		    "</div>"];
			$("#" + obj.id + " div[menuId=\"" + node.menuId + "\"]").find(".first-title-text").before(iconStr.join(""));
		}
		setTimeout(function() {
			reloadMenuListWrap(obj);
			bindEventFirstMenu(obj);
		}, 1);
	};
	
	// 添加菜单选项
	function add(obj, node) {
		if (!alreadyExist(obj, node)) {
			if ("" + node.parentMenuId == "undefined" || "" + node.parentMenuId == "0" || node.parentMenuId == null || node.parentMenuId == "") {
				addFirstMenu(obj, node);
			} else {
				if ("" + node.closed == "undefined") {
					node.closed = "true";
				}
				var str = "<li closed=\"" + node.closed + "\" parentMenuId=\"" + node.parentMenuId + "\" src=\"" + node.src + "\" menuId=\"" + node.menuId + "\" title=\""
					+ node.title + "\" attributes=\"" + node.attributes + "\"><a href=\"javascript:void(0);\" iconCls='" + node.iconCls + "' class=\"child-menu-leaf\"><span>" + node.title 
					+ "</span></a></li><ul class=\"menu-list\"></ul>";
				
				// 获取parentMenuId的li对象
				var menuObj = $("#" + obj.id + " *[menuId=\"" + node.parentMenuId + "\"]");
				
				/* 是否为二级菜单 */
				if (menuObj.next().hasClass("menu-list-wrap")) {
					menuObj.next("div.menu-list-wrap").find("ul:first").append(str);
				} else {
					var mm = $("#" + obj.id + " *[menuId=\"" + node.parentMenuId + "\"]").find("a");
					if (mm.hasClass("child-menu-leaf")) {
						mm.removeClass("child-menu-leaf").addClass("child-menu-normal");						
					}
					menuObj.next("ul.menu-list").append(str);
				}
				initMenuItem(obj);
				bindEventMenuItem(obj);
			}			
			return true;
		}
		return false;
	};
	
	// 通过菜单ID获取菜单对象
	function getMenuById(obj, menuId) {
		var para = $.data(obj, "spmenu").options;
		for (var i = 0; i < para.nodes.length; i++) {
			if(para.nodes[i].menuId == menuId){
				return para.nodes[i];
			}
		}
		return null;
	};
	
	// 绑定菜单选项
	function bindEventMenuItem(obj) {
		var para = $.data(obj, "spmenu").options;
		
		$("#" + obj.id + " ul.menu-list li > a").each(function() {
			$(this).unbind(".lk").bind("click.lk", function() {
				if ($(this).hasClass("child-menu-normal")) {
					openMenuItem($(this));
				} else if ($(this).hasClass("child-menu-click")) {
					closeMenuItem($(this));
				} else if ($(this).hasClass("child-menu-leaf")) {
					if (para.onClickLeafMenu) {
						var mid = $(this).parent().attr("menuId");						
						para.onClickLeafMenu.call(obj, getMenuById(obj, mid));
					}
				}
			}).bind("mouseover.lk", function() {
				$(this).find("span:first").addClass("span-over");
			}).bind("mouseout.lk", function() {
				$(this).find("span:first").removeClass("span-over");
			});
		});
	};
	
	// 关闭菜单选项
	function closeMenuItem(aObj) {
		aObj.parent().next("ul.menu-list").hide();
		aObj.removeClass("child-menu-click").addClass("child-menu-normal");
	};
	
	// 打开菜单选项
	function openMenuItem(aObj) {
		aObj.parent().next("ul.menu-list").show();
		aObj.removeClass("child-menu-normal").addClass("child-menu-click");
	};
	
	// 重新加载叶子节点
	function reloadLeafMenu(aObj) {
		if (aObj.parent().next("ul.menu-list").html() == "") {
			var iconCls = "" + aObj.attr("iconCls");
			if (aObj.hasClass("child-menu-click")) {
				aObj.removeClass("child-menu-click").addClass("child-menu-leaf");
				if (iconCls != "undefined") {
					aObj.addClass(iconCls);
				} else {
					aObj.addClass("child-menu-leaf-bg");
				}
			} else if (aObj.hasClass("child-menu-normal")) {
				aObj.removeClass("child-menu-normal").addClass("child-menu-leaf");
				if (iconCls != "undefined") {
					aObj.addClass(iconCls);
				} else {
					aObj.addClass("child-menu-leaf-bg");
				}
			}
		}
	}
	
	// 初始化菜单选项
	function initMenuItem(obj) {
		var para = $.data(obj, "spmenu").options;
		$("#" + obj.id + " ul.menu-list li > a").each(function() {
			
			if ($(this).parent().attr("closed") == "false") {
				openMenuItem($(this));
			} else {
				closeMenuItem($(this));
			}
			reloadLeafMenu($(this));
			
			/* 隐藏和显示 */
			if ($(this).hasClass("child-menu-click")) {
				$(this).parent().next("ul.menu-list").show();
			} else if ($(this).hasClass("child-menu-normal")) {
				$(this).parent().next("ul.menu-list").hide();
			}
			
		});
	};
	
	// 打开默认的菜单
	function openDefaultMenu(obj) {
		var mlist = [];	// menuId列表
		$("#" + obj.id + " div.first-menu-wrap").each(function() {
			if ($(this).attr("closed") == "false") {
				mlist.push($(this).attr("menuId"));
			}
		});
		var mid;
		if (mlist && mlist != null && mlist.length > 0) {
			for (var i = 0; i < mlist.length; i++) {
				mid = mlist[i];
				break;
			}
		} else {
			mid = $("#" + obj.id + " div.first-menu-wrap:first").attr("menuId");
		}
		
		initFirstMenu(obj, mid);
		initMenuItem(obj);
	}
	
	// 通过菜单编号删除菜单选项
	function removeByMenuId(obj, menuId) {
		var mm = $("#" + obj.id + " *[menuId=\"" + menuId + "\"]"); // li
		if (mm.html() != null) {
			mm.next().remove();
			mm.remove();
			
			//para.nodes.remove(node);
			
			reloadMenuListWrap(obj);
			//bindEventMenuItem(obj);
		} else {
			alert("找不到menuId： " + menuId);
		}
		
		/* 删除时优先显示closed为false的菜单选项，如果有多个则显示第一个，否则显示当前菜单列表的第一个 */
		openDefaultMenu(obj);
	};
	
	$.fn.spmenu = function(para, args) {
		if (typeof para == "string") {
			return $.fn.spmenu.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "spmenu");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				$.data(this, "spmenu", {
					options : $.extend( {}, $.fn.spmenu.defaults, para)
				});
				init(this);
			}
		});
	};
	
	$.fn.spmenu.methods = {
		// 添加菜单选项
		add: function(jq, node) {	// node: default
			if(add(jq[0], node)){
				var para = $.data(jq[0], "spmenu").options;
				para.nodes.push(node);
			}
		},
		// 通过menuId删除菜单选项
		removeByMenuId: function(jq, menuId) {
			removeByMenuId(jq[0], menuId);
		},
		// 通过menuId激活一级菜单（目前仅支持激活一级菜单、不常用）
		activateByMenuId: function(jq, menuId) {	// menuId可为空，默认取第一个
			initFirstMenu(jq[0], menuId);
		}
	};
	
	$.fn.spmenu.defaults = {
		// 点击叶子节点触发事件
		onClickLeafMenu: function(node) {
		},
		// 点击展开/收缩按钮触发事件
		onClickExpand: function() {
		},
		/**
		 * 1 parentMenuId: "0"	父级菜单ID为0则当前菜单为一级菜单
		 * 2 menuId: "1"		当前菜单ID
		 * 3 title: "title"		菜单标题
		 * 4 iconCls: "icon-save"	一级菜单图标
		 * 5 src: ""	当type为iframe时的路径
		 * 6 type: "tree/iframe"	显示的类型
		 * 7 closed: true	设为true表示该节点的子节点默认为隐藏状态
		 * 8 attributes: {}	自定义属性
		 */
		nodes: [],		// 菜单节点数组
		border: false,	// 是否显示边框
		expand: false,	// 是否显示收缩按钮
		title: {},
		titleText: "菜单目录",
		titleIconCls: ""
	};
})(jQuery);