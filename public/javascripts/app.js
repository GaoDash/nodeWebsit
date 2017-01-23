/*
 * jQuery placeholder, fix for IE6,7,8,9
* hovertree.com
 */
var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    //修复 何问起
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
            var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top, height:h, lienHeight:h, paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};
//执行 
jQuery(function(){
    JPlaceHolder.init();    
});

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