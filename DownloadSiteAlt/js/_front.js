var progrTime;
$( document ).ready(function() {

	if( $('.recent-posts article.post').length ) {
		$('.recent-posts article.post .post-title').matchHeight();
	}

    if( $('.jpg_modal').length ) {
        $('.jpg_modal').click(function(e) {
            var $th = $(this),
                nodeType = $(e.target).get(0).nodeName;
            if( $(e.target).parents('.jp-video').length )
                return false;

            if( nodeType !== 'IMG' && nodeType !== 'VIDEO' && nodeType !== 'BUTTON') {
                $(this).find('span').fadeOut(300, function() {
                    $th.fadeOut();
                });
            }
        });

    }

    $('#primary').bind({
        "scroll ready": function() {
            var scrolled = $('#primary').scrollTop(),
                header       = $('#site-header'),  
                headerHeight = header.outerHeight();

            if( headerHeight <= scrolled ) {
                if( header.prev('div').length === 0 ) {
                    header.before('<div style="height:'+headerHeight+'px"></div>');
                }
                if( !header.hasClass('fixed') ) {
                    header.addClass('fixed').hide().slideDown(400).find('>*').hide().fadeIn(700);
                }
            } else {

                if( header.hasClass('fixed') ) {
                    header.prev('div').remove();
                    header.removeClass('fixed');
                }
            }
        }
    });
    videoInit();

    $('body.beforeplay').on('touchend mouseover', '.jp-play', function() {

        var playFrame = $(this).parents('.jp-video.jp-video-360p');
        if( !playFrame.hasClass('jp-state-playing') ) {
            $(this).trigger('click');
        }
        $('body').removeClass('beforeplay');
    });    

    $('.close-button').click(function(){
        var parent = $(this).parents('.banner-place');
        if( parent.hasClass('banner-sticky') ) {
            parent.animate({'marginTop':0});
        } else if( parent.hasClass('jpg_modal') ) {
            $(this).parent('span').fadeOut(300, function(){
                $(this).parent().fadeOut();
            });
        } else if( parent.hasClass('banner-slider') ) {
            parent.animate({'marginLeft' : 0});
        }

        return false;
    });
});




var timing,
    hidetime,
    nativetime;
    
function scrollMeTo($th) {
    clearTimeout(timing);
    clearTimeout(hidetime);
    clearTimeout(nativetime);

    var bp = $th.attr('href');
    if( bp.indexOf('jpg_modal') < 0 && bp.indexOf('video_modal') < 0 ) {
        var obj = $( bp+':visible');
    } else {
        var obj = $(bp);
    }
    if( obj.length == 0 )
        return false;

    removeSticky();
    if( $th.attr('href').indexOf('video') ) {
        obj.find('.jquery_jplayer_wrap').jPlayer('play');
    }
    if( obj.attr('class').indexOf('banner-native') >= 0 ) {
        var obj2 = $('.banner-native:not('+bp+'):visible');
        if( obj2.length ) {

            var next =  obj2.offset().top + obj2.height()/2;

            timing = setTimeout(function() {
               $('#primary').stop( true, true ).animate({scrollTop: next}, 1400, 'easeOutExpo');

                obj2.addClass('highlight');
                nativetime = setTimeout(function(){
                   obj2.removeClass('highlight');
                }, 700);
            }, 2000);
        }

    } else if( obj.attr('class').indexOf('modal') >= 0 ) {
        obj.fadeIn(300, function() {
            if(obj.attr('id').indexOf('progress') >= 0) {
                clearTimeout(progrTime);
                animateProgress(0);
            }
            $(this).find('span').fadeIn();
        });
    } else if( obj.attr('class').indexOf('banner-sticky') >= 0 ) {
        var obj_height = obj.height();
        obj.stop( true, true ).animate({'marginTop':-obj_height});
    } else if( obj.attr('class').indexOf('slider') >= 0 ) {
        var obj_width = obj.width();
        obj.stop( true, true ).animate({'marginLeft':-obj_width});
    }
    $th.parents('ul').find('li a').each(function(){
        var some_obj = $(this).attr('href');
        $(some_obj).removeClass('highlight');
    });
    var obj_class = obj.attr('class');
    if( obj.length && obj_class.indexOf('modal') < 0 ) {
        var obj_top = obj.offset().top + $('#primary').scrollTop(),
            obj_height = obj.height(),
            top_scroll = obj_top - (($(window).height() / 2) - (obj_height/2));

        if(  obj_class.indexOf('sticky') < 0 ) {
            $('#primary').stop( true, true ).animate({scrollTop: top_scroll}, 500, 'easeOutExpo');
        }

        obj.addClass('highlight').addClass('highlight');

        hidetime = setTimeout(function() {
            obj.removeClass('highlight');
        }, 700);
    }

    return false;
}

function removeSticky() {
    $('.banner-place:visible .close-button').trigger('click');
    $('.banner-place.sticky').removeAttr('style');
}

function videoInit() {
    $('.jquery_jplayer_wrap').each(function(){

        $(this).jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    //m4v: "video/GoPro 300x250.mp4",
                    m4v: $(this).data('mp4'),
                    oga: $(this).data('mp4'),
                });

                if( $(this).data('autoplay') != false ) {
                    $(this).jPlayer('play');
                }
            },
            loop: true, 
            muted: true,
            swfPath: "/js/",
            supplied: "webmv, ogv, m4v, m4v",
            size: {
                width: "100%",
                height: "100%",
                cssClass: "jp-video-360p"
            },
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: false,
            remainingDuration: true,
            toggleDuration: true,
            cssSelectorAncestor: '#'+$(this).parents('.jp-video-360p').attr('id')
        });
    });
}

function animateProgress(val) {
    if( typeof val == 'undefined' ) {
        val = 0;
    }

    if( val < 100 ) {
        progrTime = setTimeout(function(){
            animateProgress(val+1);
        }, 50);
    }
    $('#progress').css({'width':val+'%'});
    $('.progress_bar .progress_percent').text(val+'%');
}