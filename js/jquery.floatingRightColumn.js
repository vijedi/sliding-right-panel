(function($) {
    $.fn.floatingRightColumn = function(options) {

        // default option
        var defaults = {
            leftColumnContainer: $('#leftColumnContainer'),
            rightColumnContainer: $('#rightColumnContainer'),
            topOffset: 40,
            bottomOffset: 60
        };

        var opts = $.extend({}, defaults, options);

        var Dimensions = function($el, topOffset) {
            if(topOffset == null) {
                topOffset = 0;
            }
            return {
                offset: $el.offset().top + topOffset,
                height: $el.height(),
                bottom:  $el.offset().top + topOffset + $el.height(),
                curr: function() {
                    return {
                        offset: $el.offset().top + topOffset,
                        height: $el.height(),
                        bottom:  $el.offset().top + topOffset + $el.height()
                    }
                }
            }
        }

        var Window = (function() {
            $w = $(window);

            return {
                top: function() {
                    return $w.scrollTop() + opts.topOffset;
                },
                bottom: function() {
                    return $w.scrollTop() + $w.height();
                },
                height: function() {
                    return $w.height() - opts.topOffset;
                }
            }

        })();


        var $leftCol = opts.leftColumnContainer;
        var $rightCol = opts.rightColumnContainer;
        var $floatingElement = this;

        var resetFloatingEl = function() {
            $floatingElement.css('top', 0)
                .css('bottom', 'auto')
                .css('position', 'inherit');
            $rightCol.height('auto');
        };

        var state = {};
        var setState = function() {
            resetFloatingEl();
            state['leftColDimensions'] = Dimensions($leftCol, 0);
            state['rightColDimensions'] = Dimensions($rightCol, 0);
            state['floatingElDimensions'] = Dimensions($floatingElement, 0);
            state['maxFloatingElHeight'] = (state.leftColDimensions.height -
                (state.floatingElDimensions.offset - state.rightColDimensions.offset) -
                opts.bottomOffset);
        };
        setState();

        if(state.leftColDimensions.height > state.rightColDimensions.height) { // Only set this up if the right column is bigger than the left

            var isAtTop = function() {
                return Window.top() < state.floatingElDimensions.offset;
            };

            var needsScroll = function() {
                var fcurr = state.floatingElDimensions.curr();
                return Window.bottom() > fcurr.bottom ||
                    Window.top() < fcurr.offset
                    ;
            };

            var floatingElementBottomOffScreen = function() {
                return Window.bottom() < state.floatingElDimensions.curr().bottom;
            };

            var floatingElementTopOnScreen = function() {
                return Window.top() < state.floatingElDimensions.curr().offset;
            };

            var adjustTimeout = null;
            var adjustLocation = function() {
                if(Window.height() > (state.floatingElDimensions.height + opts.bottomOffset)) {
                    if(isAtTop()) {
                        $floatingElement.css('top', 0)
                            .css('bottom', 'auto')
                            .css('position', 'inherit');
                    } else {
                        $floatingElement.css('bottom', 'auto');
                        $floatingElement.css('top', opts.topOffset);
                        $floatingElement.css('position', 'fixed');
                    }
                } else {
                    if(isAtTop()) {
                        resetFloatingEl();
                    } else if(needsScroll()) {
                        if(null != adjustTimeout) {
                            window.clearTimeout(adjustTimeout);
                        }

                        adjustTimeout = setTimeout(function() {
                            var newHeight = -1;
                            if(!floatingElementBottomOffScreen()) {
                                // this element is on screen and shouldn't be. Move it back onto the screen
                                $floatingElement.css('bottom', 0);
                                $floatingElement.css('top', 'auto');
                                $floatingElement.css('position', 'absolute');

                                var newSize = Window.bottom() - state.rightColDimensions.offset;
                                if(newSize < state.maxFloatingElHeight) {
                                    newHeight = newSize;
                                } else {
                                    newHeight = state.maxFloatingElHeight;
                                }
                            } else if(floatingElementTopOnScreen()) {
                                // this element is on the screen, it should never be
                                newHeight = Window.top() - state.rightColDimensions.offset + state.floatingElDimensions.height;
                            }
                            if(newHeight > 0) {
                                $rightCol.transition({'height': newHeight}, 250);
                            }
                        }, 50);
                    }
                }
            }

            $(window).scroll(adjustLocation);

            adjustLocation(); // Do this on startup to fix where the screen should be
            $(window).resize(function() {
                resetFloatingEl();
                setState();
                adjustLocation();
            });
        }

        return this;
    };
})(jQuery);
