(function($) {

  $.fn.inFieldLabel = function(options) {
    var defaults = {};

    if (options) {
      $.extend(defaults, options);
    };

    var placeholdersAreSupported = isPlaceholderSupported();

    // $.each ...
    return this.each(function() {

      var $input = $(this),
          $label = $('label[for=' + $input.attr('id') + ']');

      if (placeholdersAreSupported && ($input.attr('placeholder') == undefined || $input.attr('placeholder') == '') ) {
        $input.attr('placeholder', $label.text());
        $label.hide();
        return this;
      } else if (placeholdersAreSupported && $input.attr('placeholder').length > 0) {
        $label.hide();
        return this;
      };

      $label
        .addClass('inFieldLabel')
        .css({
          'font-family' 	  : $input.css('font-family'),
          'font-size' 	    : $input.css('font-size'),
          'font-style' 	    : $input.css('font-style'),
          'font-variant' 	  : $input.css('font-variant'),
          'font-weight' 	  : $input.css('font-weight'),
          'letter-spacing' 	: $input.css('letter-spacing'),
          'line-height' 	  : $input.css('line-height'),
          'text-decoration' : $input.css('text-decoration'),
          'text-transform' 	: $input.css('text-transform'),
          'color' 		      : $input.css('color'),
          'cursor' 		      : $input.css('cursor'),
          'display' 		    : 'inline-block'
        });

      $label
        .mousedown(function() { return false; })
        .css({
          'position' 		 : 'relative',
          'margin-right' : -$label.width(),
          'left' 			   : parseInt($input.css("padding-left"), 10) + 'px',
          'top'			     : '0px'
        });

      if ($input.val() != '') {
        $label.toggleClass('behind', true);
      };

      $input.on('focus', function(e){
        if ($input.val() == '') {
          $label.toggleClass('behind', false);
        };
      });

      $input.on('blur', function(e){
        if ($input.val() == '') {
          $label.toggleClass('behind', false);
        } else {
          $label.toggleClass('behind', true);
        };
      });

      $input.on('keyup keydown', function(e){
        if ($input.val() != '') {
          $label.toggleClass('behind', true);
        };
      });

      return this;
    });

    function isPlaceholderSupported() {
      var input = document.createElement("input");
      return ('placeholder' in input);
    };

  };

})(jQuery);

