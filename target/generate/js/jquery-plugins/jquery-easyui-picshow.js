(function($) {
	function init(obj) {
		var opts = $.data(obj, "picshow").options;
		var list = opts.nodes;
		if (list && list.length) {
			var len = list.length;
			var html = "";
			for (var i = 0; i < len; i++) {
				//add(obj, list[i]);
				var node = list[i];
				html += [
	         		"<li title='" + node.title + "' style='width:" + opts.width + "px;height:" + opts.height + "px;'>",
	         			"<img src='" + node.url + "' />",
	         		"</li>"
	         	].join("");
			}
			$("ul.pf-content", obj).html(html);
			if (len) showFirstImg(obj);
			showPage(obj);
		}
		if (!opts.onClickPhoto) {
			addViewToTop(obj);
		}
	}
	
	// 获取top页面的body
	function tbody() {
		return !top.document ? null : $(top.document.body);
	}
	
	// 添加图片
	function add(obj, node) {
		var opts = $.data(obj, "picshow").options;
		var para = {};
		var addobj = $("<li/>", {
			title : node.title || ""
		}).css({
			width : opts.width,
			height : opts.height
		}).append($("<img/>", {
			src : node.url
		}));
		$("ul.pf-content", obj).append(addobj);
		if (getTotal(obj) == 1) {
			showFirstImg(obj);
		}
		showPage(obj);
	}
	
	// 通过索引删除图片
	function remove(obj, index) {
		var ul = $("ul.pf-content", obj);
		var currIndex = getIndex(obj);
		var total = getTotal(obj);
		if (total == 0) {
			alert("删除失败，相框中暂无图片");
			return false;
		}
		if (index == undefined) {
			// 如果不传index，则默认删除当前显示的图片
			index = getIndex(obj);
		}
		if (currIndex == index && total > 1) {
			switcher(obj, "next");
		}
		ul.children().eq(index).remove();
		showPage(obj);
		if (getTotal(obj) == 0) {
			$("span.pf-default", obj).show();
		}
	}
	
	// 删除所有图片
	function removeAll(obj) {
		if (getTotal(obj) == 0) {
			return false;
		}
		$("ul.pf-content", obj).children().remove();
		showPage(obj);
		$("span.pf-default", obj).show();
	}
	
	// 相框事件绑定
	function bindEvents(obj) {
		var prev = $("span.pf-prev", obj);
		// hover:
		// 1、避免进入子元素时触发父元素的mouseout事件
		// 2、避免移出子元素时触发父元素的mouseover事件
		$("div.pf-main", obj).hover(
			function() {if (getTotal(obj) > 1) prev.next().andSelf().show();},
			function() {prev.next().andSelf().hide();}
		);
		prev.click(function() {switcher(obj, "prev");});
		prev.next().click(function() {switcher(obj, "next");});
		$(obj).delegate("img", "click", function() {
			var opts = $.data(obj, "picshow").options;
			if (opts.onClickPhoto) {
				opts.onClickPhoto.call($(this), $(this).attr("src"));
			} else {
				openView(obj);
			}
		});
	}
	
	// 图片切换
	function switcher(obj, step) {
		var opts = $.data(obj, "picshow").options;
		var cont = $("ul.pf-content", obj);
		var curr = $("li[show='true']", cont);
		var temp;
		if (step == "prev") {
			temp = curr.prev();
			if (!temp.length) {
				temp = cont.find("li:last");
			}
		} else {
			// 默认下一张
			temp = curr.next();
			if (!temp.length) {
				temp = cont.find("li:first");
			}
		}
		curr.removeAttr("show");
		curr.fadeOut(opts.speed);
		temp.attr("show", true);
		temp.fadeIn(opts.speed);
		showPage(obj);
	}
	
	// 显示第一张图片
	function showFirstImg(obj) {
		var opts = $.data(obj, "picshow").options;
		var total = getTotal(obj);
		if (total > 0) {
			$(obj).find("span.pf-default").hide();
			var temp = $(obj).find("li:eq(0)", ".pf-content");
			temp.attr("show", true);
			temp.fadeIn(opts.speed);
		}
	}
	
	// 显示分页信息
	function showPage(obj) {
		var opts = $.data(obj, "picshow").options
		if (!opts.showPage) {
			return false;
		}
		var index = getIndex(obj) + 1;
		var total = getTotal(obj);
		$(obj).find("div.pf-page").html(index + "/" + total);
	}
	
	// 获取当前图片索引值
	function getIndex(obj) {
		return $(obj).find("li[show='true']", ".pf-content").index();
	}
	
	// 获取图片总数
	function getTotal(obj) {
		return $("ul.pf-content", obj).children().length;
	}
	
	// 向top页面添加视图层
	function addViewToTop(obj) {
		var view = tbody().children("div.pf-view");
		if (!view.length) {
			$("<div class='pf-view'/>")
			.append($("<div class='pf-view-shadow'/>"))
			.append($("<div class='pf-view-main'/>")
					.append($("<span class='pf-view-tool'/>")
							.append($("<span/>", {"class" : "pf-view-page",text : "0/0"}))
							.append($("<button/>", {text : "上一张"}))
							.append($("<button/>", {text : "下一张"}))
							.append($("<button/>", {text : "左旋"}))
							.append($("<button/>", {text : "右旋"}))
							.append($("<button/>", {text : "放大"}))
							.append($("<button/>", {text : "缩小"}))
							.append($("<button/>", {text : "查看原图"}))
							.append($("<button/>", {text : "关闭"}))
							.append($("<p>").css({color: "#ccc"}).html("注：放大缩小功能目前仅支持IE9+、Chrome、Firefox、Safari等现代浏览器")))
							.append($("<div class='pf-view-imgwrap'/>")
									.append($("<span class='pf-view-imgpar'/>"))))
									.appendTo(tbody());
		}
		bindView(obj);
	}
	
	// 打开视图层
	function openView(obj) {
		var opts = $.data(obj, "picshow").options;
		var of = tbody().attr("of") || tbody().css("overflow");
		var view = tbody().find("div.pf-view");
		tbody().attr("of", of).css("overflow", "hidden");	// 去掉滚动条
		// IE在fadeIn/fadeOut时2px偏差
		if ($.browser.msie) {
			tbody().find("div.pf-view").css({
				top : -2,
				left : -2
			});
		}
		var imglist = [];
		var items = $("ul.pf-content", obj).children();
		for (var i = 0; items && i < items.length; i++) {
			imglist.push(items.eq(i).children("img").attr("src"));
		}
		var index = getIndex(obj);
		var total = getTotal(obj);
		var img = "<img src='" + items.eq(index).children("img").attr("src") + "' />";
		// table-cell显示imgwrap确保图片垂直居中
		view.find("div.pf-view-imgwrap").css({
			width : view.width(),
			height : view.height()
		})
		.find("span.pf-view-imgpar")
		// 保存当前图片索引和列表图片集合
		.attr({index : index,imglist : imglist})
		.html(img);
		$("span.pf-view-page", view).text("【当前第" + (index + 1) + "张，共" + total + "张】");
		view.fadeIn();
		view.find("img").load(function() {
			viewImgFit(obj, view, $(this));
		});
	}
	
	// 视窗图片适应缩放
	function viewImgFit(obj, view, img) {
		var opts = $.data(obj, "picshow").options;
		var imgScale = img.width() / img.height();
		var tmp = imgScale >= view.width() / view.height();
		if (tmp && img.width() >= img.height() && img.width() >= view.width()) {
			img.css({
				width : view.width(),
				height : view.width() / imgScale
			});
		} else if(img.height() >= view.height()) {
			img.css({
				height : view.height(),
				width : imgScale * view.height()
			});
		}
		// 还原图片缩放比例
		$.data(obj, "picshow", {
			options : $.extend( {}, opts, {
				zoom : 1
			})
		});
	}
	
	// 视图层图片切换
	function switcherForView(obj, step) {
		var view = tbody().find("div.pf-view");
		var imgpar = $("span.pf-view-imgpar", view);
		var index = imgpar.attr("index");
		var imglist = imgpar.attr("imglist");
		if (typeof imglist == "object") imglist = imglist.toString();
		imglist = imglist.split(",");
		var total = imglist.length;
		
		if (step == "prev") {
			index--;
			if (index < 0) {
				index = total - 1;
			}
		} else {
			index++;
			if (index == total) {
				index = 0;
			}
		}
		
		imgpar.attr("index", index);	// 更新索引值
		var img = "<img src='" + imglist[index] + "' />";
		imgpar.html(img);
		$("span.pf-view-page", view).text("【当前第" + (index + 1) + "张，共" + total + "张】");
		view.find("img").load(function() {
			viewImgFit(obj, view, $(this));
		});
	}
	
	// 视图层绑定
	function bindView(obj) {
		var view = tbody().children("div.pf-view");
		var imgpar = $("span.pf-view-imgpar", view);
		// 上一张
		$("button:eq(0)", view).unbind("click").bind("click", function() {
			switcherForView(obj, "prev");
		});
		// 下一张
		$("button:eq(1)", view).unbind("click").bind("click", function() {
			switcherForView(obj, "next");
		});
		// 左旋
		$("button:eq(2)", view).unbind("click").bind("click", function() {
			rotateLeft(obj, imgpar.children()[0]);
		});
		// 右旋
		$("button:eq(3)", view).unbind("click").bind("click", function() {
			rotateRight(obj, imgpar.children()[0]);
		});
		// 放大
		$("button:eq(4)", view).unbind("click").bind("click", function() {
			zoomIn(obj, imgpar.children()[0]);
		});
		// 缩小
		$("button:eq(5)", view).unbind("click").bind("click", function() {
			zoomOut(obj, imgpar.children()[0]);
		});
		// 查看原图
		$("button:eq(6)", view).unbind("click").bind("click", function() {
			var url = view.find("img").attr("src");
			window.open(url, "_blank");
		});
		// 关闭
		$("button:eq(7)", view).unbind("click").bind("click", function() {
			view.fadeOut(function() {
				// 还原overflow
				tbody().css("overflow", tbody().attr("of"));
			});
		});
	}
	
	// 旋转任意角度
	function rotate(obj, img, angle) {
		if (!angle) {
			return rotateRight(obj, img);
		}
		var curr = parseInt($(img).attr("angle"));
		if (isNaN(curr)) {
			curr = 0;
		}
		angle += curr;
		//angle %= 360;
		if ($.browser.msie && $.browser.version != "10.0") {
			var deg = angle * (Math.PI / 180);
			var sine = Math.sin(deg);
			var cosine = Math.cos(deg);
			$(img).css({
				filter : "progid:DXImageTransform.Microsoft.Matrix("
					+ "M11=" + cosine
					+ ",M12=" + (-sine)
					+ ",M21=" + sine
					+ ",M22=" + cosine
					+ ",SizingMethod='auto expand')",
				position : "absolute",
				top : -$(img).width() / 2,
				left : -$(img).height() / 2
			});
		} else {
			var v = "rotate(" + angle + "deg)";
			var tf = $(img).css("transform");
			if (tf && tf.indexOf("scale") != -1) {
				v += " scale(" + getZoom(obj) + ")";
			}
			$(img).css({
				//"-webkit-transition" : "all 0.3s ease-in 0",
				"-webkit-transform" : v,
				"-moz-transform" : v,
				"-ms-transform" : v,
				"-o-transform" : v,
				"transform" : v
			});
		}
		$(img).attr("angle", angle);
	}
	
	// 左旋90度
	function rotateLeft(obj, img) {
		rotate(obj, img, -90);
	}
	
	// 右旋90度
	function rotateRight(obj, img) {
		rotate(obj, img, 90);
	}
	
	// 阻止事件向上冒泡
	function stopBubble(event) {
		var e = window.event || event;
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.preventBubble = true;
		}
	}
	
	// 创建相框
	function create(obj) {
		var opts = $.data(obj, "picshow").options;
		var html = [
    		"<div class='pf-wrap pf-wrap-" + opts.align + "' style='width:" + opts.width + "px;'>",
	    		"<div class='pf-main' style='height:" + opts.height + "px;'>",
	    			"<span class='pf-prev' title='上一张'></span>",
	    			"<span class='pf-next' title='下一张'></span>",
	    			"<span class='pf-default'>暂无图片</span>",
	    			"<ul class='pf-content'></ul>",
	    		"</div>"
	    ].join("");
		if (opts.showPage) {
			html += "<div class='pf-page'>0/0</div>";
		}
		html += "</div>";
    	$(obj).html(html);
	}
	
	// 缩放
	function zoom(obj, img, step) {
		var opts = $.data(obj, "picshow").options;
		var curZoom = getZoom(obj);
		var scale = opts.scale;
		var zoom = step > 0 ? curZoom + scale : curZoom - scale;
		if (zoom <= 0) {
			console.log("不能继续缩小了...........");
			return;
		}
		// IE9+、modern
		var isModern = true;
		if ($.browser.msie) {
			if (!($.browser.version == "9.0" || $.browser.version == "10.0")) {
				isModern = false;
			}
		}
		if (!isModern) {
			alert("你的浏览器目前不支持改功能，请使用更高级别的浏览器！");
			return;
		}
		var v = "scale(" + zoom + ")";
		var tf = $(img).css("transform");
		// -webkit-transform: scale(1.5) rotate(45deg);
		if (tf && tf.indexOf("rotate") != -1) {
			var inx1 = tf.indexOf("rotate");
			var inx2 = tf.indexOf("deg");
			v += " " + tf.substring(inx1, inx2 + 4);
		}
		$(img).css({
			webkitTransform : v,
			mozTransform : v,
			msTransform : v,
			oTransform : v,
			transform : v
		});

		// 保存缩放后的值
		$.data(obj, "picshow", {
			options : $.extend( {}, opts, {
				zoom : zoom
			})
		});
	}
	
	function zoomIn(obj, img) {
		zoom(obj, img, 1);
	}
	
	function zoomOut(obj, img) {
		zoom(obj, img, -1);
	}
	
	// 获取缩放级别
	function getZoom(obj) {
		return $.data(obj, "picshow").options.zoom;
	}
	
	$.fn.picshow = function(para, args) {
		if (typeof para == "string") {
			return $.fn.picshow.methods[para](this, args);
		}
		para == para || {};
		return this.each(function() {
			var data = $.data(this, "picshow");
			if (data) {
				$.extend(data.options, para);
			} else {
				$.data(this, "picshow", {
					options : $.extend( {}, $.fn.picshow.defaults, para)
				});
			}
			create(this);
			init(this);
			bindEvents(this);
		});
	};
	
	$.picshow = {
		rotate : function(obj, angle) {
			rotate(obj, angle);
		},
		rotateLeft : function(obj) {
			rotateLeft(obj);
		},
		rotateRight : function() {
			rotateRight(obj);
		}
	};
	
	$.fn.picshow.methods = {
		add : function(jq, node) {
			add(jq[0], node);
		},
		remove : function(jq, index) {
			remove(jq[0], index);
		},
		removeAll : function(jq) {
			removeAll(jq[0]);
		},
		switcher : function(jq, step) {
			switcher(jq[0], step);
		},
		getIndex : function(jq) {
			return getIndex(jq[0]);
		},
		getTotal : function(jq) {
			return getTotal(jq[0]);
		},
		zoomIn : function(jq) {
			zoomIn(jq[0]);
		},
		zoomOut : function(jq) {
			zoomOut(jq[0]);
		},
		getZoom : function(jq) {
			return getZoom(jq[0]);
		}
	};
	
	$.fn.picshow.defaults = {
		onClickPhoto : null,
		showPage : true,
		width : 300,
		height : 150,
		speed : "normal",
		align : "left",
		nodes : null,
		scale : 0.5,
		zoom: 1
	};
})(jQuery);