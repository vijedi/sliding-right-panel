(function($) {
    $.fn.equalSizeColumn = function(selector) {
        var left = this;
        var right = selector;

        if(left.height() > right.height()) {
            right.height(left.height());
        } else if(right.height() > left.height()) {
            left.height(right.height());
        }

        return this;
    };
})(jQuery);
