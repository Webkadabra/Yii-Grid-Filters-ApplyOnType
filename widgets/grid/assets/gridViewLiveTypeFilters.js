/**
 * jQuery Yii GridView filter-as-you-type extension
 *
 * @author Sergii Gamaiunov <hello@webkadabra.com>
 */
;(function($) {
	var ajaxUpdateTimer;

  /**
   * 1. Selects rows that have checkbox checked (only checkbox that is connected with selecting a row)
   * 2. Check if "check all" need to be checked/unchecked
   * @return object the jQuery object
   */
  selectCheckedRows = function (gridId) {
    var settings = $.fn.yiiGridView.settings[gridId],
      table = $('#' + gridId).children('.' + settings.tableClass);

    table.children('tbody').find('input.select-on-check').filter(':checked').each(function () {
      $(this).closest('tr').addClass('selected');
    });

    table.children('thead').find('th input').filter('[type="checkbox"]').each(function () {
      var name = this.name.substring(0, this.name.length - 4) + '[]', //.. remove '_all' and add '[]''
        $checks = $("input[name='" + name + "']", table);
      this.checked = $checks.length > 0 && $checks.length === $checks.filter(':checked').length;
    });
    return this;
  };

	var delay = (function(){
        var timer = 0;
        return function(callback, ms){
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
        };
	})();
	var lastActiveInputName;
	
	function to_end(el) {
	if(!el) return;
            var len = el.value.length || 0;
			el.focus();
            if (len) {
                if ('setSelectionRange' in el) {
					el.setSelectionRange(len, len);
				}
                else if ('createTextRange' in el) {// for IE
                    var range = el.createTextRange();
                    range.moveStart('character', len);
                    range.select();
                }
            }
        }

		
	/**
	 *
	 */
	$.fn.yiiGridViewLiveTypeFilters = function(options) {
		return this.each(function(){
			var $this = $(this);
			var id = $this.attr('id');

			var settings = $.fn.yiiGridView.settings[id];
			var inputSelector='#'+id+' .'+settings.filterClass+' input';
			
			$('body').undelegate(inputSelector, 'keyup').delegate(inputSelector, 'keyup', function(e){
				/* var data = $(inputSelector).serialize();
				if(settings.pageVar!==undefined)
					data += '&'+settings.pageVar+'=1'; */
				$.fn.yiiGridViewLiveTypeFilters.onKeyUp(e, id);
			});
			
			$.fn.yiiGridView.settings[id].oldAfterAjaxCallback = $.fn.yiiGridView.settings[id].afterAjaxUpdate;
			$.fn.yiiGridView.settings[id].afterAjaxUpdate = function(id, data){
				var elt = $('#'+id+' input[name$="'+lastActiveInputName+'"]');
				if(elt) {
					elt.attr('data-lastvalue', elt.val());
					to_end(elt.get(0));
				}
				
				$.fn.yiiGridView.settings[id].oldAfterAjaxCallback();
			}
			
		});
	};
	
	/**
	 * 
	 */
	$.fn.yiiGridViewLiveTypeFilters.onKeyUp = function(e, grid_id) {
		ajaxUpdateTimer = true;
		delay(function(){
			$.fn.yiiGridViewLiveTypeFilters.applyChangedFilters(e, grid_id);
		}, 500);
	};
	
	/**
	 * 
	 */
	$.fn.yiiGridViewLiveTypeFilters.applyChangedFilters = function(e, grid_id) {
		ajaxUpdateTimer = false;
		var lastActiveInput = e.currentTarget;
		var lastValue;
		//var settings = $.fn.yiiGridViewLiveTypeFilters.settings[id];
		
		var element = $(lastActiveInput);
		lastValue = element.attr('data-lastvalue');
		if(!lastValue) {
			
		}
		element.attr('data-lastvalue', lastActiveInput.value);
		
		if(lastValue != lastActiveInput.value) {
			//update:
			lastActiveInputName = lastActiveInput.name;
			var theData = new Object;
			var elt_name = lastActiveInput.name;
			var elt_value = lastActiveInput.value;
			theData[elt_name]	= elt_value;
			
			/* $('.filters input, .filters select').each(function() {
				theData[this.name] = $(this).val();
			}); */

			$.fn.yiiGridView.update(grid_id, {
				data: theData,
				success: function(data,status) {
					
					if(ajaxUpdateTimer==true) {
						return;
					} else {
            var $data = $('<div>' + data + '</div>');
            var settings = $.fn.yiiGridView.settings[grid_id];
            $('#'+grid_id).removeClass(settings.loadingClass);


            $.each(settings.ajaxUpdate, function (i, el) {
              var updateId = '#' + el;
              $(updateId).replaceWith($(updateId, $data));
            });
            if (settings.afterAjaxUpdate !== undefined) {
              settings.afterAjaxUpdate(grid_id, data);
            }
            if (settings.selectableRows > 0) {
              selectCheckedRows(grid_id);
            }
					}
				}
			}); 
		} else {
			//do not update
		}  
	};

})(jQuery);