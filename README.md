# Sliding Right Column

There's a UX challenge to having two long, but not equal, columns filled with a lot of data.
I found a solution I liked on Yahoo news where the right column moves independently of the left,
but does not have its own scroll bars. 

I created a few jquery plugins to achieve the same effect in my application. 

## How to Use it

You'll need [jquery](http://jquery.com), [JQuery Transit](http://ricostacruz.com/jquery.transit/), and the two plugins supplied here.

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="../js/vendor/jquery.transit.js"></script>
    <script type="text/javascript" src="../js/jquery.equalSizeColumn.js"></script>
    <script type="text/javascript" src="../js/jquery.floatingRightColumn.js"></script>
    
There are three required divs. The container for the left column, the container for the right column and the floating element.
The containers must have a CSS position property set. The right column and the floating element must have an explicit height set.

    <style type="text/css">
    body {
        width: 960px;
        margin: 20px auto;
    }

    #leftColumn {
        width: 700px;
        padding-right: 20px;
        float: left;
        position: relative;
    }

    #rightColumn {
        width: 240px;
        float: left;
        position: relative;
    }

    #floatingColumn {
        width: 240px;
    }
    </style>

Finally, you need to make the left and right column containers equal size and construct the sliding panel.

    <script type="text/javascript">
    $(function() {
        $('#leftColumn').equalSizeColumn($('#rightColumn'));
        $('#floatingColumn').floatingRightColumn({
            leftColumnContainer: $("#leftColumn"),
            rightColumnContainer: $("#rightColumn"),
            bottomOffset: 20,
            topOffset: 0
        }); 
    });
    </script>
    
Full details of the implementation are [in this blog post](http://www.tejusparikh.com).
