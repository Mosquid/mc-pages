$(document).ready(function() {
	$('#size_switcher li a').click(function(){

        $('#size_switcher').find('a').removeClass('active');
		var size = $(this).addClass('active').attr('href').replace('#', '');
		if( size == 'mob' ) {
            $('#banner-switcher').addClass('mob');
			$('#contents').width(500).css({'margin':'0 auto', 'display':'block'});
		} else {
            $('#banner-switcher').removeClass('mob');
			$('#contents').removeAttr('style');
		}

		return false;
	});

    if( $('#banner-switcher').length ) {
        $('#banner-switcher .switch-links li a.place-link').on('click', function(){

            var leftPos = $('#banner-switcher').position().left;
            if( leftPos < 0 ) 
                return false;
            
            if( !$(this).hasClass('haschild') ) {
                $('#banner-switcher').removeClass('right_show');
                $('.open-child-overlay').remove();

                $(this).parents('.show-child').removeClass('show-child');

                $('.open-child-overlay').remove();
                document.getElementById('contents').contentWindow.scrollMeTo( $(this) );
            } else {
                $(this).parent().toggleClass('show-child');
                if( $(this).parent().hasClass('show-child') )
                    $('body').append('<div class="open-child-overlay"></div>');
            }

            return false;
        });
    }

    if( $('#banner-switcher').length ) {
    	switcherSwypeInit();
    }

    $('body').on('click', '.open-child-overlay', function(){

        $(this).remove();

        $('#banner-switcher .switch-links .show-child').removeAttr('class');
    });

    if( $('#banner-toggle').length ) {
        $('#banner-toggle').click(function(){
            var $parent = $('#banner-switcher');
                leftPos = parseInt( $parent.css('left'));
            
            if( leftPos < 0 && !$parent.hasClass('right_show') ) {
                $parent.addClass('right_show');
            } else {
                $parent.removeClass('right_show');
            }

            return false;
        });
    }
});

function show_popup() {
	var screen_w = $(window).width() - 100,
		screen_h = $(window).height() - 100,
		top = ($(window).height() / 2) - (screen_h/2),
		left = ($(window).width() / 2) - (screen_w/2);
		
	window.open('https://www.pagerduty.com/weekly-demo/?utm_source=adroll&utm_medium=banner&utm_content=300x600_demo2&utm_campaign=customers', 'title', 'toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, width='+screen_w+', height='+screen_h+', top='+top+', left='+left+'');

	return false;
}

$(window).on('resize', function(){
	switcherSwypeInit();
});

function switcherSwypeInit() {
    $('#banner-switcher').off('touchmove');
    $('#banner-switcher').off('touchend').removeAttr('style');
	var body = $('body');
	var ismobile = window.getComputedStyle(body.get(0), ':after').content;

	if( ismobile.replace(/'/g, '') == 'mobile' ) {
		var last = 0,
			newlast;

    	$('#banner-switcher').on('touchmove', function(e){
    	    var orign = e.originalEvent,
    	    	obj = $('#banner-switcher');
    	    obj.removeClass('right_show noevent');
            var touches = orign.targetTouches[0] || orign.changedTouches[0];

    	    if( typeof touches.pageX !== 'undefined' ) {
    	    	var swyped = touches.pageX,
    	    		direct = (swyped - last) >= 0 ? 'right' : 'left',
    	    		offset = Math.min(50, Math.abs(swyped));
    			if( obj.hasClass('right_show') && direct == 'left' ) {
					obj.css({'margin-left': -offset});
    			} else if( direct == 'right' && !obj.hasClass('right_show') ) {
    				obj.css({'margin-left':offset});
    			}
    			obj.removeAttr('class');
    	    	obj.addClass('swiped_'+direct);
    	    	last = swyped;
    	    	if( direct == 'left' )
    	    		newlast = 0;
                else
                    newlast = -1;
    	    }
    	});

    	$('#banner-switcher').on('touchend', function(e){
    		if( typeof newlast != 'undefined' && newlast != last ){
    			var swyped = e.originalEvent.pageX;

    			var obj = $('#banner-switcher');
    			obj.removeAttr('style');
    			if( obj.hasClass('swiped_right') ) {
    				obj.addClass('right_show');
    			} else {
    				obj.removeClass('right_show');
                    obj.find('.show-child').removeAttr('class');
    			}
				obj.removeClass('swiped_left swiped_right');
				newlast = last;
    		}
    	});
	}
}