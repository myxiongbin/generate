(function($) {
	var status = 0;  // 0：隐藏，1：显示
	var topObj;  // top对象
	var isSelf;	// top对象是否为本身
	function init(obj) {
		var para = $.data(obj, "tipshow").options;

		topObj = $.workbus.getTop();
		isSelf = topObj == self;
		
		addWrap(obj, para);
		addWinp(obj);
		initTipmessWinp(obj);
		bindTipmessWinp(obj);
		
		var list = para.buttons;
		for (var i = 0; list && list != null && i < list.length; i++) {
			add(obj, list[i]);
		}
		
		$("#" + obj.id + " div.main-text-con").click(function() {
			if (para.message.handler) {
				para.message.handler.call();
			}
		}).mouseover(function() {
			status = 1;
			openTipmessWinp(obj, $(this));
		}).mouseout(function() {
			status = 0;
			outEvent(obj);
		});
		
		//$.workbus.methodSupplyToTop("addWinp");
		//$(topObj.document.body).append("<script>" + eval(addWrap(obj, para)) + "</script>");
	};
	
	// 添加框架
	function addWrap(obj, para) {
		var wrapStr = [
            "<table class=\"tipshow-wrap\"><tr><td>",
				"<div class=\"tipshow-main\">",
					"<div class=\"main-left\"></div>",
					"<div class=\"main-text-left\"></div>",
					"<div class=\"main-text-center\">",
						"<div class=\"main-text-icon\"></div>",
						"<div class=\"main-text-con\" msg=\"" + para.message.msg + "\">",
							"<marquee scrollamount='3' onmouseover='this.stop()' onmouseout='this.start()'>" + 
								para.message.text + "</marquee>",
						"</div>",
					"</div>",
					"<div class=\"main-text-right\"></div>",
					"<div class=\"main-right\"></div>",
					"<div class=\"main-last\"></div>",
				"</div>",
			"</td></tr><tr><td>",	/* 阴影 */
				"<div class=\"tipshow-shadow\">",
					"<div class=\"shadow-left\"></div>",
					"<div class=\"shadow-center\"></div>",
					"<div class=\"shadow-right\"></div>",
				"</div>",
			"</td></tr></table>"];
		$("#" + obj.id).html(wrapStr.join(""));
	};
	
	function addWinp(obj) {
		var winpStr = "<div id=\"" + obj.id + "-winp\" class=\"tipshow-winp\"></div>";
		$("body").append(winpStr);
	};
	
	// 初始化提示窗口
	function initTipmessWinp(obj) {
		$("#" + obj.id + "-winp").winp({
			title: "",
			width: 140,
			height: 200,
			closed: true,
			collapsible: false,
			minimizable: false,
			maximizable: false,
			closable: false
		});
	};
	
	// 窗口鼠标事件
	function bindTipmessWinp(obj) {
		$("#" + obj.id + "-winp").unbind(".mo").bind("mouseover.mo", function() {
			status = 1;
		}).bind("mouseout.mo", function() {
			status = 0;
			outEvent(obj);
		});
	};
	
	// 当status为0时关闭提示窗口
	function outEvent(obj) {
		setTimeout(function() {
			if (status == 0) {
				closeTipmessWinp(obj);
			}
		}, 300);
	};
	
	// 打开提示窗口
	function openTipmessWinp(obj, node) {
		closeTipmessWinp(obj);
		
		var msg = node.attr("msg");
		if ("" + msg != "undefined" && msg != null && msg != "") {
			setValueForTipmessWinp(obj, msg);

			var ofst = getOffset(obj, node);
			$("#" + obj.id + "-winp").winp("open");
			$("#" + obj.id + "-winp").winp("resize", {
				top: ofst.top,
				left: ofst.left
			});
		}
	};
	
	// 关闭提示窗口
	function closeTipmessWinp(obj) {
		$("#" + obj.id + "-winp").winp("close");
	};
	
	// 为提示窗口赋值
	function setValueForTipmessWinp(obj, val) {
		$("#" + obj.id + "-winp").html(val);
	};
	
	// 获取坐标
	function getOffset(obj, node) {
		var data = {};
		
		var left = node.offset().left + 1;
		var top = $("#" + obj.id).offset().top + 30;
		
		var winpObj = $("#" + obj.id + "-winp").winp("options");
		var totalWidth = $("#" + obj.id).offset().left + $("#" + obj.id).width();
		
		// 如果提示框超出组件的右侧则靠右对齐
		if (left + winpObj.width > totalWidth) {
			left = totalWidth - winpObj.width + 5;
		}
		data.left = left;
		data.top = top;
		
		return data;
	};
		
	// 添加按钮
	function add(obj, node) {
		var str;		
		if (node.type == "line") {
			str = "<span class=\"tipshow-sep\">&nbsp;</span>";
		} else {
			// 默认添加类型为按钮
			str = "<a href=\"javascript:void(0);\" decorateWait=\"true\" class=\"easyui-linkbutton\" " +
				"type=\"backt\" iconCls=\"" + node.iconCls + "\" msg=\"" + node.msg + "\">" + 
				node.text + "</a>";
		}
		if (node.position == "before") {
			$("#" + obj.id).find(".main-left").append(str);
		} else {
			// 默认添加位置为after
			$("#" + obj.id).find(".main-right").append(str);
		}
		$("a[decorateWait=\"true\"]").linkbutton({});
		$("a[decorateWait=\"true\"]").attr("decorateWait", "false");

		bindEvent(obj, node);
	};

	// 按钮鼠标事件
	function bindEvent(obj, node) {
		$("#" + obj.id + " a").each(function() {
			if ($(this).text() == node.text) {
				$(this).unbind(".ms").bind("mouseover.ms", function() {
					status = 1;
					openTipmessWinp(obj, $(this));					
				}).bind("mouseout.ms", function() {
					status = 0;
					outEvent(obj);					
				}).bind("click", function() {
					if (node.handler) {
						node.handler.call();
					}					
				});
			}
		});
	};
	
	// 设置消息提示的内容
	function setCenterText(obj, text) {
		$("#" + obj.id + " div.main-text-con").find("marquee").html(text);
	};
	
	$.fn.tipshow = function(para, args) {
		if (typeof para == "string") {
			return $.fn.tipshow.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "tipshow");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				$.data(this, "tipshow", {
					options : $.extend( {}, $.fn.tipshow.defaults, para)
				});
				init(this);
			}
		});
	};
	
	$.fn.tipshow.methods = {
		// 设置消息显示的内容
		setCenterText: function(jq, text) {
			setCenterText(jq[0], text);
		},
		// 添加按钮或分割线
		add: function(jq, para) {
			add(jq[0], para);
		}
	};
	
	// 尺寸："auto" x 54
	// 示例：tipshow.html、tipshow2.html
	$.fn.tipshow.defaults = {
		buttons: [],	// iconCls: "", text: "", handler: function(){}, type: "radio/line", position: "before/after"
		centerText: ""	// 消息提示内容
	};	
})(jQuery);