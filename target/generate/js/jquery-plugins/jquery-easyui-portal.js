(function($) {
	function init(obj) {
		var para = $.data(obj, "portal").options;
		
		$("#" + obj.id).addClass("obj-style");
		$("#" + obj.id).append("<div class=\"portal-wrap\"></div>");
		
		// 设置外框的宽度：168为dl的宽度
		$("#" + obj.id + " > div.portal-wrap").css("width", para.number * 168);
		
		var list = para.list;
		for (var i = 0; list && list != null && i < list.length; i++) {
			add(obj, list[i]);
		}
		
		bind(obj);
	};
	
	function add(obj, node) {
		var str = [
			"<dl title=\"" + node.text + "\" id=\"" + node.id + "\">",
				"<dt><img src=\"" + node.outPic + "\" /></dt>",
				"<dd>",
					"<div class=\"portal-dd-left\"></div>",
					"<div class=\"portal-dd-center\">" + node.text  + "</div>",
					"<div class=\"portal-dd-right\"></div>",
				"</dd>",
			"</dl>"
       	];
		$("#" + obj.id + " > div.portal-wrap").append(str.join(""));
	};
	
	function bind(obj) {
		var para = $.data(obj, "portal").options;
		var list = para.list;
		$("#" + obj.id + " dl").each(function() {
			$(this).unbind("mm").bind("mouseover.mm", function() {	// 鼠标移入
				for (var i = 0; i < list.length; i++) {
					if ($(this).attr("id") == list[i].id) {
						// 存在则替换
						if (list[i].overPic && list[i].overPic != null) {
							$(this).find("img").attr("src", list[i].overPic);
						}
					}
				}
				$(this).find("div.portal-dd-center").removeClass("portal-dd-center")
					.addClass("portal-dd-center-over");
			}).bind("mouseout.mm", function() {	// 鼠标移除
				for (var i = 0; list && list != null && i < list.length; i++) {
					if ($(this).attr("id") == list[i].id) {
						$(this).find("img").attr("src", list[i].outPic);
					}
				}
				$(this).find("div.portal-dd-center-over").removeClass("portal-dd-center-over")
					.addClass("portal-dd-center");
			}).bind("click.mm", function() {	// 点击事件
				for (var i = 0; list && list != null && i < list.length; i++) {
					if ($(this).attr("id") == list[i].id) {
						if (list[i].handler) {
							//list[i].handler.call($(this), $(this).attr("id"));
							list[i].handler.call($(this), list[i]);
						}
					}
				}
			});
		});
	};
	
	$.fn.portal = function(para, args) {
		if (typeof para == "string") {
			return $.fn.portal.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "portal");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				$.data(this, "portal", {
					options : $.extend( {}, $.fn.portal.defaults, para)
				});
				init(this);
			}
		});
	};
	
	$.fn.portal.methods = {
		add: function(jq, para) {
			add(jq[0], para);
		}
	};
	
	$.fn.portal.defaults = {
		number: 4,	// 每行显示的个数
		list: []	// id: "", text: "", overPic: "", outPic: ""
	};	
})(jQuery);