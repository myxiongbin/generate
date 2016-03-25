(function($) {
	function init(obj) {
		var para = $.data(obj, "loginlayer").options;
		
		// 初始化隐藏登陆框
		$("#" + obj.id).hide();
		
		// 添加框架
		var frame = "<div class='ll-shade'></div><div class='ll-wrap'></div>";
		$("#" + obj.id).append(frame);
		
		// 添加内容
		var contentObj = $("#" + para.contentId);
		$("#" + obj.id + " div.ll-wrap").append(contentObj);
		contentObj.addClass("ll-content");
		contentObj.css({
			top: para.position.top,
			left: para.position.left
		});
		
		bindEvent(obj, para);
	};
	
	/**
	 * 绑定事件
	 */
	function bindEvent(obj, para) {
		$("#" + obj.id).keydown(function(e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == 13) {
				para.onSubmit.call($(this), getData(obj));
			}
		});
		
		$(window).resize(function() {
			setTimeout(function() {
				position(obj);
			}, 200);
		});
	};
	
	/**
	 * 打开
	 */
	function open(obj) {
		$("#" + obj.id).show();
		position(obj);
	};
	
	/**
	 * 关闭
	 */
	function close(obj) {
		$("#" + obj.id).hide();
	};
		
	/**
	 * 获取数据
	 */
	function getData(obj) {
		var formId = $("#" + obj.id + " form:first").attr("id");
		var json = $("#" + formId).getJSON();
		var data = eval("json." + formId);
		return data;
	};
	
	/**
	 * 框架定位，实现居中显示
	 */
	function position(obj) {
		var w = $(document.body).width();
		var h = $(document.body).height();
		var wrap = $("#" + obj.id + " > div.ll-wrap");
		wrap.css({
			left: (w - wrap.width()) / 2,
			top: (h - wrap.height()) / 2 - 20
		});
	};
	
	$.fn.loginlayer = function(para, args) {
		if (typeof para == "string") {
			return $.fn.loginlayer.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "loginlayer");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				$.data(this, "loginlayer", {
					options : $.extend( {}, $.fn.loginlayer.defaults, para)
				});
				init(this);
			}
		});
	};
	
	$.fn.loginlayer.methods = {
		// 打开登录窗口
		open: function(jq) {
			open(jq[0]);
		},
		// 关闭
		close: function(jq) {
			close(jq[0]);
		},
		// 获取数据
		getData: function(jq) {
			return getData(jq[0]);
		}
	};
	
	$.fn.loginlayer.defaults = {
		onSubmit: undefined,  // 回车触发提交表单事件
		contentId: "",  // 登陆框包含内容的元素ID
		top: 0,  // 包含元素相对于登录框的位置
		left: 0
	};	
})(jQuery);