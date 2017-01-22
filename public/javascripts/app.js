

/*
* ----Tabs----
*/

(function($){
	$.extend({
		Tabs: function(){
			var me = this;

			var tabs = $(".buttons-tab a");	//tabs元素

			var showTab = function(){
				$(".buttons-tab a").each(function(index,item){
					var $e = $(item),
						$tab = $($e.attr("href"));
					if($e.hasClass('active')){
						$tab.show();
					}else{
						$tab.hide();
					}
				});
			}

			$(document).on('click', ".buttons-tab a", function(e){
				e.preventDefault();

				var $this = $(this);
				$this.addClass('active').parent().siblings().children().removeClass('active');
				showTab();
			});

			showTab();
		}
	});
})(jQuery);