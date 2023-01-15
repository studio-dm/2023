jQuery(document).ready(function ($) {



  /* Contact map */
  $('.google_map').googleMap(); 



  /* Contact form */
  $('#contact_form').submit(function () {

    $('#contact_form .status').html('Sending...');

    /* Send AJAX request. */
    $.ajax({
      type: 'POST',
      url: 'contact.php',
      data: {
        name: $('#contact_form input#name').val(),
        email: $("#contact_form input#email").val(),
        text: $("#contact_form textarea").val()
      },
      success: function(data) {

        if ( data == 'sent' ) {
          $('#contact_form .status').html('E-mail has been sent.');
        } else if ( data == 'invalid' ) {
          $('#contact_form .status').html('Your name, email or message is invalid.');
        } else {
          //alert(data);
          $('#contact_form .status').html('E-mail has not been sent.');         
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {

        //alert(jqXHR.status + ' - ' + textStatus + ' - ' + errorThrown);
        $('#contact_form .status').html('E-mail could not be sent.');

      }
    });

    return false;

  });


  /* Background slider */
  $('.slider').fullSlider();



  /* Simple slider */
  $('.simple_slider').simpleSlider();



  /* Tabs */
  $('.tabs .selectors a').click(function () {

    /* Select menu item */
    $('.tabs .selectors li').removeClass('selected');
    $(this).parent('li').addClass('selected');

    /* Display tab */
    $('.tabs .tab').removeClass('selected');
    $('.tabs .tab[data-tab="' + $(this).attr('data-tab') + '"]').addClass('selected');
    return false;

  });



  /* Masonry */
  $(window).resize(function () {

    var $masonry = $('.masonry');
    $masonry.imagesLoaded(function() {
      $masonry.not('.no-masonry').masonry();
    });

  });



  /* Trigger resize events */
  $(window).resize();



  /* Show/hide portfolio description */
  $('.portfolio_description .hide').click(function () {
    $('.portfolio_description').toggleClass('disabled');
  });



  /* Mobile navigation */
  $('header .mobile').append('<select />');
  var $mobile_nav = $('header .mobile select');
  $('header nav li').each(function () {
    var a = $(this).children('a');
    var selected = ( a.hasClass('selected') ) ? 'selected="selected"' : '';
    var intend = ( $(this).parents('li').length > 0 ) ? '&nbsp;-&nbsp;' : '';
    $mobile_nav.append('<option value="' + a.attr('href') + '" ' + selected + '>' + intend + a.text() + '</option>');
  });
  $('header .mobile select').change(function () {
    window.location = $(this).find('option:selected').attr('value');
  });



  /* Fancybox */
  $('.fancybox .photo').fancybox({
    'transitionIn': 'elastic',
    'padding': 0,
    'overlayColor': '#000'
  });
  $('.fancybox .video').fancybox({
    'transitionIn': 'elastic',
    'padding': 0,
    'overlayColor': '#000',
    'type': 'iframe'
  });



  /* Animate loading */
  $('.to_load').animateLoad();



});



(function ($) {



  /* Full slider */
  $.fn.fullSlider = function () {


    /* Find slides */
    var $slides_ul = $(this).children('ul');
    var $slides = $slides_ul.children('li');


    /* Fit images once loaded */
    $slides.children('img').load(function () {
      $(window).resize();
    });


    /* Fit images into slides */
    $(window).resize(function () {
      
      $slides.each(function () {

        var $li = $(this);
        var $img = $li.children('img');

        var img_ratio = $img.width() / $img.height();
        var li_ratio = $li.width() / $li.height();

        if (img_ratio < li_ratio) {
          $img.removeClass('fit_height');
        } else {
          $img.addClass('fit_height');
        }

        $img.css('left', ($li.width() - $img.width())/2 + 'px');
        $img.css('top', ($li.height() - $img.height())/2 + 'px');

      });

    });


    /* If only 1 slide, exit */
    if ($slides.length < 2) return $(this);
    

    /* Function for changing slide */
    function changeSlide (direction, id) {

      var next = current.next();
      if (next.length == 0) next = $slides_ul.children('li:first-child');

      var prev = current.prev();
      if (prev.length == 0) prev = $slides_ul.children('li:last-child');

      if (typeof id != 'undefined') next = prev = $slides_ul.children('li[data-id=' + id + ']');

      if (next.hasClass('active')) return;

      $slides.addClass('inactive');
      current.removeClass('active inactive');

      current = (direction == 'next') ? next.addClass('slidRight') : prev.addClass('slidLeft');

      $('.slider_thumbnails li').removeClass('selected');
      $('.slider_thumbnails li[data-id=' + current.attr('data-id') +']').addClass('selected');

      setTimeout(function () {
        current.addClass('active').removeClass('inactive slidLeft slidRight');
      }, 80);

    }


    /* Get animation */
    $(this).addClass('animation_' + $(this).attr('data-animation'));


    /* Autoplay */
    var autoplay;
    var autoplay_interval = parseInt($(this).attr('data-interval')) || 0;
    
    function startInterval() {

      if (autoplay_interval == 0) return;

      clearInterval(autoplay);
      autoplay = setInterval(function () {
        changeSlide('next');
      }, autoplay_interval);

    }
    startInterval();


    /* Create thumbnails */
    $('.slider_thumbnails').each(function () {

      var $thumbnails_ul = $('<ul />');

      $slides.each(function (index) {
        $(this).attr('data-id', index);
        $thumbnails_ul.append('<li data-id="' + index + '"><a href="#"><img src="' + $(this).attr('data-thumbnail') + '" alt=""></a></li>');
      });
      $(this).append($thumbnails_ul);

      $thumbnails_ul.children('li').css('width', 100/$slides.length + '%').click(function () {
        changeSlide('next', $(this).attr('data-id'));
        startInterval();
      });

    });


    /* Find first slide */
    var current = $slides_ul.children('li.current').prev();
    if (current.length == 0) current = $slides_ul.children('li:last-child');


    /* Enable first slide */
    changeSlide('next');


    /* Enable controls */
    var controls = parseInt($(this).attr('data-controls')) || 0;
    if (controls != 0) {

      controls = $('<div class="controls" />');

      $('<a href="#" />').addClass('prev').click(function () {
        changeSlide('prev');
        startInterval();
      }).appendTo(controls);

      $('<a href="#" />').addClass('next').click(function () {
        changeSlide('next');
        startInterval();
      }).appendTo(controls);

      $(this).append(controls);

    }


    /* Return jQuery object */
    return $(this);

  }



  /* Google Maps plugin */
  $.fn.googleMap = function () {

    if ($(this).length == 0) return $(this);

    var marker_location = new google.maps.LatLng($(this).attr('data-latitude'), $(this).attr('data-longitude'));

    var map = new google.maps.Map($(this)[0], {
      zoom: parseInt($(this).attr('data-zoom')),
      center: marker_location,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      panControl: true,
      panControlOptions: {
          position: google.maps.ControlPosition.LEFT_TOP
      },
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.LEFT_TOP
      },
      streetViewControl: false,
      mapTypeControl: false,
      scaleControl: false,
    });

    map.controls[google.maps.ControlPosition.TOP_LEFT].push($('<div class="move_down"></div>')[0]);

    var marker = new google.maps.Marker({
      position: marker_location,
      map: map,
      icon: new google.maps.MarkerImage(
        'img/marker.png',
        new google.maps.Size(32,38),
        new google.maps.Point(0,0),
        new google.maps.Point(16,38)
      )
    });

    return $(this);

  }



  /* Simple slider plugin */
  $.fn.simpleSlider = function () {

    $(this).each(function () {

      var $slider = $(this);
      var $wrapper = $slider.wrap('<div class="slider_wrapper" />').parent().append('\
        <div class="slider_controls">\
          <a href="#" class="prev"></a>\
          <a href="#" class="next"></a>\
        </div>\
      ');

      if ($slider.children('li.selected').length == 0) $slider.children('li:first-child').addClass('selected');

      $wrapper.find('.prev').click(function () {

        var prev = $slider.children('li.selected').prev();
        if (prev.length == 0) prev = $slider.children('li:last-child');

        $slider.children('li.selected').removeClass('selected');
        prev.addClass('selected');

        return false;

      });

      $wrapper.find('.next').click(function () {

        var next = $slider.children('li.selected').next();
        if (next.length == 0) next = $slider.children('li:first-child');

        $slider.children('li.selected').removeClass('selected');
        next.addClass('selected');

        return false;

      });

    });

    return $(this);

  }



  /* Animate loading more posts */
  $.fn.animateLoad = function () {

    var $items = $(this);

    $items.each(function (index) {
      setTimeout(function () {
        $items.eq(index).addClass('loaded');
      }, index*30);
    });

    return $(this);

  }



})(jQuery);