if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
    var viewportmeta = document.querySelectorAll('meta[name="viewport"]')[0];
    if (viewportmeta) {
        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
        document.body.addEventListener('gesturestart',function() {
            viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
        },false);
    }
}

$(function(){

    //embed-code select
    $('#embed-code').click(function(){$(this).select();});

    //bad-comment
    if($('blockquote.bad-comment').length > 0) {
        var b = 'blockquote.bad-comment>p';
        var s = 'p.show>a';
        $(b).hide();
        $(s + '>span').text('Show hidden');
        $(s).click(function(e){
            e.preventDefault();
            if($(b).css('display') == 'block') {
                $(b).fadeOut('fast');
                $(s + '>span').text('Show hidden');
            }
            else {
                $(b).fadeIn('fast');
                $(s + '>span').text('Hide shown');
            }
        })
    }

    // ajax comment post
    $('#comments-form').submit(function() {
        // use ajax to submit form
        dataString = 'name='+$('#name').val()+'&email='+$('#email').val()+'&url='+$('#url').val()+'&comment='+$('#comment').val()+'&riddle='+$('#riddle').val()+'&comment_post_ID='+$('#comment_post_ID').val();
        $.ajax({
            type: 'POST',
            url: $('#comments-form').attr('action'),
            data: dataString,
            complete: function(msg) {
                var response = $.parseJSON(msg.responseText);

                // remove errors notice, if present
                $('#errors').remove();

                if (response.errors) {
                    // show errors
                    $(response.html).insertBefore('#comments-form');
                    $('html,body').animate({scrollTop: $("#errors").offset().top},'slow');
                    // add error fields
                    for (error in response.errors) {
                        var id = response.errors[error];
                        $('#'+id).parent().addClass('error');
                    }
                }
                else {
                    // remove old success not if already there
                    $('#success').remove();
                    // add success notice
                    $(response.success).insertBefore('#comments-form');
                    // add new comment to html
                    if ($('#comments').length > 0) {
                        // add to list
                        $(response.html).insertBefore('#comments article:first-child');
                    }
                    else {
                        // replace no comments notice & add comment
                        $('#single .notice').html(response.notice)
                                            .after('<section id="comments">'+response.html+'</section>');
                    }

                    // scroll to new comment
                    $('html,body').animate({scrollTop: $("#success").offset().top},'slow');

                    // reset form
                    $('#comment').val('');
                    $('#name').val('');
                    $('#email').val('');
                    $('#url').val('');
                    $('#riddle').val('');
                }

                // set new riddle
                $('#comments-form .captcha label[for="riddle"]').html(response.riddle.notice);
                $('#comments-form .qa span').html(response.riddle.riddle);
                // reset riddle
                $('#riddle').val('');
            }
        });
        return false;
    });

    //media gallery
    if ($('#media-gallery').length > 0) {

        //init slideshow (serverside = no blink)
        //$('html').addClass('slideshow');

        //vertical center element
        function centerMedia(which) {

            var w = (which) ? 1 : 0;
            if (w == 1) var active = $('#media-elements>figure');
            else var active = $('#media-elements>.active');

            active.find('img').height('auto');

            var maxH = $(window).height()/2;
            var imgH = active.find('img').height()/2;
            var margin = maxH - imgH;

            if (margin > 0) {
                active.css('marginTop',margin);
            }
            else {
                active.css('marginTop',0);
                active.find('img').height(maxH*2);
            }
        }
        centerMedia(1);

        //toggle image description
        $('a.m-toggle').click(function(e) {
            e.preventDefault();
            $(this).toggleClass('pressed').prev('p').slideToggle(100);
        });

        //remote control
        $('#m-prev').click(function(e) {
            e.preventDefault();
            slideShow(-1);
        });
        $('#m-slide').click(function(e) {
            e.preventDefault();
            slideShow(0);
        });
        $('#m-next').click(function(e) {
            e.preventDefault();
            slideShow(1);
        });

        //embed button
        $('a.m-embed').click(function(e) {
            e.preventDefault();
        });

        //sldieshow
        function slideShow(go) {
            var el = $('#media-elements>.active');
            switch (go) {
                case (0): looping(el);
                break;
                case (1): goNext(el);
                break;
                case (-1): goPrev(el);
                break;
            }
        }

        //looping elements
        var loop = setTimeout('',1);
        function looping(el) {
            //goNext(el);
            //loop = setTimeout($(this),3000);
            //clearTimeout(loop);
        }

        //next element
        function goNext(el) {
            if (el.next().length > 0) {
                el.removeClass('active').css('display','');
                el.next().fadeIn(function() {
                    $(this).addClass('active');
                });
            }
        }

        //previous element
        function goPrev(el) {
            if (el.prev().length > 0) {
                el.removeClass('active').css('display','');
                el.prev().fadeIn(function() {
                    $(this).addClass('active');
                });
            }
        }

        $(window).resize(function(){centerMedia();});
    }

    // comment karma
    $('form.favorize input:radio').each(function() {
        // on change submit form
        $(this).change(function() {
            $(this).parent().submit();
        });
    });

    // capture form submits
    $('form.favorize').each(function() {
        // catch submits and do ajax instead
        $(this).submit(function(e) {
            // prevent form from posting
            e.preventDefault();
            var selectedInput = $('input:radio:checked', $(this));
            var value = selectedInput.val();
            var key   = selectedInput.attr('name');
            var vote = {}; vote[key] = value;
            // post with ajax instead
            $.post($(this).attr('action'), vote, function(response) {
                console.log(response);
            });
        });
    });
});

