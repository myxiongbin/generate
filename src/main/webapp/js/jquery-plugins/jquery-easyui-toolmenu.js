(function($) {
	function init(obj) {
		var para = $.data(obj, "toolmenu").options;
		
		var str = [
			"<div class=\"toolmenu-wrap\">",
				"<div class=\"tmbg-wrap\">",
					"<div class=\"tmbg-left\"></div>",
					"<div class=\"tmbg-center\"></div>",
					"<div class=\"tmbg-right\"></div>",
				"</div>",
				"<div class=\"tmlink-wrap\">",
					"<div class=\"tmlink-top\"></div>",
					"<div class=\"tmlink-bottom\"></div>",
				"</div>",
			"</div>"
		];
		$("#" + obj.id).append(str.join(""));
		$("#" + obj.id + " > div.toolmenu-wrap").css("width", 46 + para.list.length * 80);
		
		var list = para.list;
		for (var i = 0; list && list != null && i < list.length; i++) {
			add(obj, list[i]);
		}
		
		bind(obj);
	};
	
	function add(obj, node) {
		var picStr = "<a menuId=\"" + node.menuId + "\" href=\"javascript:void(0);\" title=\"" + 
			node.text + "\"><img src=\"" + node.src + "\" /></a>";
		var linkStr = [
			"<div class=\"text-link\">",
				"<div class=\"text-linkbg-left\"></div>",
				"<div class=\"text-linkbg-center\" menuId=\"" + node.menuId + 
					"\" title=\"" + node.text + "\">" + node.text + "</div>",
				"<div class=\"text-linkbg-right\"></div>",
			"</div>"
		];
		$("#" + obj.id + " div.tmlink-top").append(picStr);
		$("#" + obj.id + " div.tmlink-bottom").append(linkStr.join(""));
	};
	
	function bind(obj) {
		var para = $.data(obj, "toolmenu").options;
		var list = para.list;
		var mid;
		
		$("#" + obj.id + " div.tmlink-top > a").unbind("mm").bind("mouseover.mm", function() {
			mid = $(this).attr("menuId");
			mouseOver(obj, $(this).attr("menuId"));
		}).bind("mouseout.mm", function() {
			mouseOut(obj, mid);
		}).bind("click.mm", function() {
			for (var i = 0; list && list != null && i < list.length; i++) {
				if (list[i].menuId == mid) {
					if (list[i].handler) {
						list[i].handler.call($(this), mid);
					}
				}
			}
		});
		
		$("#" + obj.id + " div.text-link").unbind("mm").bind("mouseover.mm", function() {
			mid = $(this).find("div.text-linkbg-center").attr("menuId");
			mouseOver(obj, mid);
		}).bind("mouseout.mm", function() {
			mouseOut(obj, mid);
		}).bind("click.mm", function() {
			for (var i = 0; list && list != null && i < list.length; i++) {
				if (list[i].menuId == mid) {
					if (list[i].handler) {
						list[i].handler.call($(this), mid);
					}
				}
			}
		});
	};
	
	function mouseOver(obj, mid) {
		$("#" + obj.id + " div.text-linkbg-center[menuId=\"" + mid + "\"]")
			.removeClass("text-linkbg-center").addClass("text-linkbg-center-over");
	};
	
	function mouseOut(obj, mid) {
		$("#" + obj.id + " div.text-linkbg-center-over[menuId=\"" + mid + "\"]")
			.removeClass("text-linkbg-center-over").addClass("text-linkbg-center");		
	};
	
	$.fn.toolmenu = function(para, args) {
		if (typeof para == "string") {
			return $.fn.toolmenu.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "toolmenu");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				$.data(this, "toolmenu", {
					options : $.extend( {}, $.fn.toolmenu.defaults, para)
				});
				init(this);
			}
		});
	};
	
	$.fn.toolmenu.methods = {
		add: function(jq, para) {
			add(jq[0], para);
		}
	};
	
	// 控件高度106px
	// 控件对于DIV横向居中，垂直方向底部对齐
	// 示例 >> portal.html
	$.fn.toolmenu.defaults = {
		list: []	// menuId: "", src: "", text: "", handler: function(id) {}
	};	
})(jQuery);