(function($) {	
	function init(obj) {
		var para = $.data(obj, "printer").options;
		
		var str = "";
		var ilist = para.printArray;
		for (var i = 0; i < ilist.length; i++) {
			str += "<div><iframe src=\"" + ilist[i].src + "\" width=\"100%\" " +
					"height=\"100%\" frameborder=\"0\" scrolling=\"auto\"></iframe></div>";
		}
		$("#" + obj.id).html(str);
	};

	function _print() {
		window.print();
	};
	
	$.fn.printer = function(para, args) {
		if (typeof para == "string") {
			return $.fn.printer.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "printer");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				$.data(this, "printer", {
					options : $.extend( {}, $.fn.printer.defaults, para)
				});
				init(this);
			}
		});
	};
	
	$.fn.printer.methods = {
		print: function(jq) {
			_print();
		}
	};
	
	$.fn.printer.defaults = {
		printArray: []	// src: ""
	};	
})(jQuery);