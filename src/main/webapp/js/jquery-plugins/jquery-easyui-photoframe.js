(function($) {
	var photo_frame_width = 300;  // 相框的最大显示宽度
	var photo_frame_height = 150;  // 相框的最大显示高度
	
	/**
	 * 初始化
	 */
	function init(obj) {
		var para = $.data(obj, "photoframe").options;
		
		var str = [
			"<div class=\"pf-wrap\">",
				"<div class=\"pf-main\">",
					"<div class=\"pf-main-container\">",
						"<div class=\"pf-marquee\">",
							"<ul class=\"pf-photo-list\"></ul>",
						"</div>",
					"</div>",
				"</div>",
				"<div class=\"pf-message\"></div>",
				"<div class=\"pf-previous\" title=\"上一张\"></div>",
				"<div class=\"pf-next\" title=\"下一张\"></div>",
				"<div class=\"pf-foot\">0/0</div>",
				"<input id=\"" + obj.id + "-move-pixel\" type=\"hidden\" value=\"" + 
					photo_frame_width + "\" />",
			"</div>"
     	];
		$("#" + obj.id).append(str.join(""));
		
		/* 添加唯一大图层 */
		if ($("div.pf-check").length == 0 && "" + para.onClick == "undefined") {
			var check = [
             	"<div class=\"pf-check-wrap\">",
		             "<div class=\"pf-shade\"></div>",
		             "<div class=\"pf-check\"></div>",
	             "</div>"
 			];
			$("body").append(check.join(""));
			$("div.pf-check-wrap").click(function() {
				closeBigView();
			});
		}
		
		/* 循环添加图片 */
		var list = para.nodes;
		for (var i = 0; list && list != null && i < list.length; i++) {
			add(obj, list[i]);
		}
		
		/* 默认 */
		if (getCount(obj) == 0) {
			var str = "<div class=\"pf-no-picture\">暂无图片</div>";
			$("#" + obj.id + " ul.pf-photo-list").append(str);			
		}
		
		/* 全局绑定 */
		integralBind(obj);
		showMessage(obj, 1);
		
		/* 大图层图片居中 */
		$(window).resize(function() {
			if ($("div.pf-check-wrap").css("display") == "block") {
				img.css({
					width: ww,
					height: hh,
					"margin-top": ($(document.body).height() - hh) / 2,
					"margin-left": ($(document.body).width() - ww) / 2
				});
			}
		});
	};
	
	/**
	 * 添加图片
	 * @param obj
	 * @param node
	 * @return
	 */
	function add(obj, node) {
		var para = $.data(obj, "photoframe").options;
		var container = $("#" + obj.id + " div.pf-main-container");
		var temp = $("#" + obj.id + "-move-pixel");
		var total = getCount(obj);
		var val = $("#" + obj.id + "-move-pixel").val();
		
		var str = "";
		if (node.width && node.height) {
			str = "<li><img src=\"" + node.url + "\" index=\"" + (total + 1) + "\" msg=\"" + 
				(node.msg || para.msg) + "\" alt=\"" + (node.alt || para.alt) + "\" title=\"" + 
				(node.title || para.title) + "\" width=\"" + (node.width || para.width) + 
				"\" height=\"" + (node.height || para.height) + "\" style=\"" + 
				(node.style || para.style) + "\" class=\"" + (node.cls || para.cls) + "\" /></li>";
		} else {
			str = "<li><img src=\"" + node.url + "\" index=\"" + (total + 1) + "\" msg=\"" + 
				(node.msg || para.msg) + "\" alt=\"" + (node.alt || para.alt) + "\" title=\"" + 
				(node.title || para.title) + "\" style=\"" + (node.style || para.style) + 
				"\" class=\"" + (node.cls || para.cls) + "\" /></li>";
		}
		
		/* 如果默认显示的div存在则删除 */
		var nopicture = $("#" + obj.id + " div.pf-no-picture");
		if (nopicture) {
			nopicture.remove();
		}
		
		/* 添加首尾 */
		var ul = $("#" + obj.id + " ul.pf-photo-list");
		if (total == 1) {
			$("#" + obj.id + " ul.pf-photo-list").append(str);
			ul.find("li:first").before(ul.find("li:last").clone());
			ul.find("li:last").after(ul.find("li:first").next().clone());
			container.scrollLeft(photo_frame_width);
			bindIconEvent(obj);
		} else if (total > 1) {
			ul.find("li:first").remove();
			ul.find("li:last").remove();
			$("#" + obj.id + " ul.pf-photo-list").append(str);
			ul.find("li:first").before(ul.find("li:last").clone());
			ul.find("li:last").after(ul.find("li:first").next().clone());
		} else {
			$("#" + obj.id + " ul.pf-photo-list").append(str);			
		}

		var ind;
		if (val == 0) {
			ind = total;
			container.scrollLeft(total * photo_frame_width);
			temp.val(total * photo_frame_width);
		} else if (total > 1 && val == (total + 1) * photo_frame_width) {
			ind = 1;
			container.scrollLeft(photo_frame_width);
			temp.val(photo_frame_width);
		} else {
			ind = val / photo_frame_width;
		}
		
		showInfo(obj, ind);
		setTimeout(function() {
			keepProportion(obj, node);
		}, 100);
	};
	
	/**
	 * 实现原图宽高比例不变
	 * @param obj
	 * @return
	 */
	function keepProportion(obj, node) {
		$("#" + obj.id + " ul.pf-photo-list img").each(function() {
			if ($(this).attr("src") == node.url) {
				var w = $(this).width();
				var h = $(this).height();
				
				/* 图片宽高均小于相框宽高 */
				if (w < photo_frame_width && h < photo_frame_height) {
					$(this).css({
						"margin-top": (photo_frame_height - h) / 2,
						"margin-left": (photo_frame_width - w) / 2
					});
				} else {
					var frame_pro = photo_frame_width / photo_frame_height;  // 相框宽高比例
					var img_pro = w / h;  // 图片宽高比例
					if (img_pro > frame_pro) {
						$(this).css({
							width: photo_frame_width,
							height: photo_frame_width * h / w,
							"margin-top": (photo_frame_height - photo_frame_width * h / w) / 2
						});
					} else if (img_pro < frame_pro) {
						$(this).css({
							width: photo_frame_height * w / h,
							height: photo_frame_height,
							"margin-left": (photo_frame_width - photo_frame_height * w / h) / 2
						});
					} else if (img_pro == frame_pro) {
						$(this).css({
							width: photo_frame_width,
							height: photo_frame_height
						});
					}
				}
			}
		});
	};
	
	/**
	 * 全局绑定函数
	 */
	function integralBind(obj) {
		var para = $.data(obj, "photoframe").options;
		// 上一张
		$("#" + obj.id + " div.pf-previous").click(function() {
			step(obj, -1);
		});
		
		// 下一张
		$("#" + obj.id + " div.pf-next").click(function() {
			step(obj, 1);
		});
		
		// 图片单击事件：delegate对后添加的元素同样有效
		$("#" + obj.id + " ul.pf-photo-list").delegate("img", "click", function() {
			if (para.onClick) {
				/* 自定义图片点击事件，返回当前显示的图片对象 */
				para.onClick.call($(this), $(this));
			} else {
				/* 默认打开大图层 */
				openBigView($(this));
			}
		});
	};
	
	// 大图层图片图片对象、大图层图片的宽度、高度、相框当前显示图片对象
	var img, ww, hh, imgobj;
	
	/**
	 * 打开大图层
	 */
	function openBigView(node) {
		$("div.pf-check-wrap").fadeIn(500);
		$("div.pf-check").html("<img src=\"" + node.attr("src") + "\" />");
		img = $("div.pf-check").find("img");
		ww = img.width();
		hh = img.height();
		imgobj = node;
		/* 先把宽高设置为0并保持居中 */
		img.css({
			width: 0,
			height: 0,
			"border-width": 0,
			"margin-top": node.offset().top + node.height() / 2,
			"margin-left": node.offset().left + node.width() / 2
		});
		/* 将图片逐步放大并保持居中 */
		img.animate({
			width: ww,
			height: hh,
			"border-width": 5,
			"margin-top": ($(document.body).height() - hh) / 2,
			"margin-left": ($(document.body).width() - ww) / 2
		}, 500);
	};
	
	/**
	 * 关闭大图层
	 */
	function closeBigView() {
		$("div.pf-check-wrap").fadeOut(500);
		/* 图片逐步缩小 */
		img.animate({
			width: 0,
			height: 0,
			"border-width": 0,
			"margin-top": imgobj.offset().top + imgobj.height() / 2,
			"margin-left": imgobj.offset().left + imgobj.width() / 2
		}, 500, function() {
			$("div.pf-check").html("");
		});
	};
	
	var move_width = 10;  // 单位事件内移动的距离
	var speed = 10;  // 滚动的速度
	/**
	 * 图片切换函数
	 * @param obj
	 * @param st
	 * @return
	 */
	function step(obj, st) {
		var local = $("#" + obj.id + "-move-pixel");
		var value = parseInt(local.val());  // 用于记录滚动的距离
		var smallLeft = $("#" + obj.id + " div.pf-main-container").offset().left;
		var bigLeft = smallLeft + photo_frame_width;
		setTimeout(function() {
			$("#" + obj.id + " ul.pf-photo-list > li").each(function() {
				var currentLeft;
				if (st > 0) currentLeft = $(this).offset().left;
				if (st < 0) currentLeft = $(this).offset().left + photo_frame_width;
				if (currentLeft >= smallLeft && currentLeft < bigLeft) {
					showInfo(obj, $(this).find("img").attr("index"));
					showMessage(obj, $(this).find("img").attr("index"));
				}
			});
		}, 50);
		var total = getCount(obj);
		if (value < photo_frame_width) {
			value = total * photo_frame_width;
		}
		if (value > total * photo_frame_width) {
			value = photo_frame_width;
		}
		var temp = value;
		var mm = setInterval(function() {
			if (st > 0) {
				temp += move_width;
			} else {
				temp -= move_width;
			}
			if (temp % photo_frame_width == 0) {
				clearInterval(mm);
			}
			$("#" + obj.id + " div.pf-main-container").scrollLeft(temp);
		}, speed);
		if (st > 0) {
			value += photo_frame_width;
		} else {
			value -= photo_frame_width;
		}
		local.val(value);
	};
	
	/**
	 * 图片切换图标鼠标移动事件绑定
	 * @param obj
	 * @return
	 */
	function bindIconEvent(obj) {
		$("#" + obj.id + " div.pf-wrap").mouseover(function() {
			showPagingIcon(obj);
		}).mouseout(function() {
			hidePagingIcon(obj);
		});
	};
	
	/**
	 * 显示图片切换图标
	 * @param obj
	 * @return
	 */
	function showPagingIcon(obj) {
		$("#" + obj.id + " div.pf-previous").show();
		$("#" + obj.id + " div.pf-next").show();		
	};
	
	/**
	 * 隐藏图片切换图标
	 * @param obj
	 * @return
	 */
	function hidePagingIcon(obj) {
		$("#" + obj.id + " div.pf-previous").hide();
		$("#" + obj.id + " div.pf-next").hide();		
	};
	
	/**
	 * 获取图片总数
	 * @param obj
	 * @return
	 */
	function getCount(obj) {
		var count = $("#" + obj.id + " ul.pf-photo-list > li").length;
		if (count > 1) {
			return count - 2;
		}
		return count;
	};

	/**
	 * 显示图片信息
	 * @param obj
	 * @param index
	 * @return
	 */
	function showInfo(obj, index) {
		var total = getCount(obj);
		var str = index + "/" + total;
		$("#" + obj.id + " div.pf-foot").html(str);
	};
	
	/**
	 * 显示图片描述信息
	 */
	function showMessage(obj, index) {
		var oo = $("#" + obj.id + " div.pf-message");
		var msg;
		$("#" + obj.id + " ul.pf-photo-list img").each(function() {
			if ($(this).attr("index") == index) {
				msg = $(this).attr("msg");
			}
		});
		if (msg) {
			oo.html(msg);
			oo.animate({height: 0}, 0);
			oo.animate({height: 20}, 500);
		} else {
			oo.animate({height: 0}, 500, function() {
				oo.html("");
			});
		}
	};
	
	$.fn.photoframe = function(para, args) {
		if (typeof para == "string") {
			return $.fn.photoframe.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "photoframe");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				$.data(this, "photoframe", {
					options : $.extend( {}, $.fn.photoframe.defaults, para)
				});
				init(this);
			}
		});
	};
	
	$.fn.photoframe.methods = {
		// 添加图片
		add: function(jq, node) {
			add(jq[0], node);
		}
	};

	$.fn.photoframe.defaults = {
		onClick: undefined,  // 图片点击事件，默认点击查看大图，初始化此属性则重写了点击事件的方法
		nodes: [],  // 初始化图片对象数组，参数如下：
		url: "",  // 图片路径，必填
		msg: "",  // 图片描述信息
		alt: "Wrong Path!",  // 当路径错误时显示的信息
		title: "",  // 标题
		width: "auto",  // 自定义图片宽高，如果不设宽高，则按宽高比例显示图片
		height: "auto",
		style: "",  // 自定义行内样式
		cls: ""  // 自定义类样式
	};	
})(jQuery);