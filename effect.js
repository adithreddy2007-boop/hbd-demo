/* ═══════════════════════════════════════════════════════════════
   effect.js — Birthday Interactive Controller
   ═══════════════════════════════════════════════════════════════ */

$(window).load(function () {
  $('.loading').fadeOut('fast');
  $('.container').fadeIn('fast');
});

$('document').ready(function () {

  /* ─────────────────────────────────────────────────────
     STEP TRACKER
     currentStep is set INSIDE each .done() callback —
     the moment the NEXT button actually appears.
  ───────────────────────────────────────────────────── */
  /* no step tracker needed — buttons are sequential only */

  /* ─────────────────────────────────────────────────────
     BALLOON RESIZE  (8 balloons: HBDADITH)
  ───────────────────────────────────────────────────── */
  var vw;
  $(window).resize(function () {
    vw = $(window).width() / 2;
    relineBalloons(vw);
  });

  function relineBalloons(center) {
    var offsets = [-350,-250,-150,-50,50,150,250,350];
    ['b11','b22','b33','b44','b55','b66','b77','b88'].forEach(function(id, i){
      $('#'+id).animate({ top: bannerLineY(), left: center + offsets[i] }, 500);
    });
  }

  /* Returns the Y position (in viewport px) just BELOW the banner image */
  function bannerLineY() {
    var $b = $('.bannar');
    if ($b.length && $b.offset()) {
      // offset().top from document top, minus scrollTop = position in viewport
      // + outerHeight() puts us at the BOTTOM edge of the image
      // + 20 adds a small gap so balloons float just below, not touching
      return $b.offset().top - $(window).scrollTop() + $b.outerHeight() + 20;
    }
    return 280; // fallback
  }

  /* ─────────────────────────────────────────────────────
     STEP 1 — Turn On Lights
  ───────────────────────────────────────────────────── */
  $('#turn_on').click(function () {
    $('#bulb_yellow').addClass('bulb-glow-yellow');
    $('#bulb_red').addClass('bulb-glow-red');
    $('#bulb_blue').addClass('bulb-glow-blue');
    $('#bulb_green').addClass('bulb-glow-green');
    $('#bulb_pink').addClass('bulb-glow-pink');
    $('#bulb_orange').addClass('bulb-glow-orange');
    $('body').addClass('peach');
    $(this).fadeOut('slow').delay(5000).promise().done(function () {
      $('#play').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 2 — Play Music
  ───────────────────────────────────────────────────── */
  $('#play').click(function () {
    $('.song')[0].play();
    $('#bulb_yellow').addClass('bulb-glow-yellow-after');
    $('#bulb_red').addClass('bulb-glow-red-after');
    $('#bulb_blue').addClass('bulb-glow-blue-after');
    $('#bulb_green').addClass('bulb-glow-green-after');
    $('#bulb_pink').addClass('bulb-glow-pink-after');
    $('#bulb_orange').addClass('bulb-glow-orange-after');
    $('body').addClass('peach-after');
    $(this).fadeOut('slow').delay(6000).promise().done(function () {
      $('#bannar_coming').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 3 — Decorate (Banner)
  ───────────────────────────────────────────────────── */
  $('#bannar_coming').click(function () {
    $('.bannar').addClass('bannar-come');
    $(this).fadeOut('slow').delay(6000).promise().done(function () {
      $('#balloons_flying').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 4 — Fly Balloons
  ───────────────────────────────────────────────────── */
  function randomPos() { return { l: 1000*Math.random(), t: 500*Math.random() }; }

  function loopBalloon(id) {
    var r = randomPos();
    $('#'+id).animate({ left: r.l, bottom: r.t }, 10000, function(){ loopBalloon(id); });
  }

  $('#balloons_flying').click(function () {
    $('.balloon-border').animate({ top: -500 }, 8000);
    $('#b1,#b4,#b5,#b7').addClass('balloons-rotate-behaviour-one');
    $('#b2,#b3,#b6,#b8').addClass('balloons-rotate-behaviour-two');
    ['b1','b2','b3','b4','b5','b6','b7','b8'].forEach(loopBalloon);
    $(this).fadeOut('slow').delay(5000).promise().done(function () {
      $('#cake_fadein').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 5 — Cake falls from top of screen
     After the SVG morph animations complete (~6.6s),
     the candle automatically drops onto the cake.
     The "Light Candle" button only lights the flame.
  ───────────────────────────────────────────────────── */
  $('#cake_fadein').click(function () {
    // Restart SVG animations by replacing with a fresh clone
    var svg = document.getElementById('cake-svg');
    if (svg) {
      var clone = svg.cloneNode(true);
      svg.parentNode.replaceChild(clone, svg);
    }

    // Reset candle state
    $('.velas').removeClass('dropping lit').css({ top: '-120px', opacity: 0 });

    // Position ONLY the inner wrapper above viewport — outer stays fixed+centered
    $('.cake-wrapper').removeClass('cake-fall').css('transform', 'translateY(-150vh)');

    // Show cake (still off-screen above)
    $('.cake').show();

    // Clip overflow so nothing leaks above the screen during fall
    $('html').css('overflow', 'hidden');

    // Trigger the fall animation after a short paint delay
    setTimeout(function () {
      $('.cake-wrapper').addClass('cake-fall');
    }, 50);

    // Restore overflow after fall + bounce settles
    setTimeout(function () {
      $('html').css('overflow', '');
    }, 1600);

    // AUTO-DROP CANDLE after the SVG cream animation finishes (~6.6s from SVG clone)
    // SVG sequence: bizcocho_1(2s+0.8s) → relleno_1(0.5s) → bizcocho_2(0.5s) →
    //               relleno_2(0.5s) → bizcocho_3(0.3s) → crema(2s) = 6.6s total
    setTimeout(function () {
      $('.velas').css('opacity', 1).addClass('dropping');
    }, 7200);

    $(this).fadeOut('slow').delay(8000).promise().done(function () {
      $('#light_candle').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 6 — Light Candle
     Candle already dropped automatically after cream.
     This button only lights the flame.
  ───────────────────────────────────────────────────── */
  $('#light_candle').click(function () {
    // Light the flame — ensure candle is fully visible first
    $('.velas').css('opacity', 1).addClass('lit');

    $(this).fadeOut('slow').promise().done(function () {
      $('#wish_message').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 7 — Happy Birthday
     Balloons stop floating and line up centered under the banner.
  ───────────────────────────────────────────────────── */
  $('#wish_message').click(function () {
    vw = $(window).width() / 2;

    // Stop random floating
    $('#b1,#b2,#b3,#b4,#b5,#b6,#b7,#b8').stop();

    // Rename ids so the resize handler can reposition them later
    ['b1','b2','b3','b4','b5','b6','b7','b8'].forEach(function(id, i){
      $('#'+id).attr('id', ['b11','b22','b33','b44','b55','b66','b77','b88'][i]);
    });

    // Align under the banner — shifted slightly left to centre under decoration image
    var targetTop = bannerLineY() + 80 - 85;
    var offsets   = [-390,-290,-190,-90,10,110,210,310];
    ['b11','b22','b33','b44','b55','b66','b77','b88'].forEach(function(id, i){
      $('#'+id).animate({ top: targetTop, left: vw + offsets[i] }, 600);
    });

    $('.balloons').css('opacity', '0.9');
    $('.balloons h2').fadeIn(3000);

    $(this).fadeOut('slow').delay(3000).promise().done(function () {
      $('#story').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 8 — Final message with TYPEWRITER
     Children already have visibility:hidden in HTML.
     The box is full-size from the start — no resizing.
  ───────────────────────────────────────────────────── */
  var TYPING_SPEED = 22;
  var PAUSE_AFTER  = 140;

  function startMessageTypewriter() {
    var $elements = $('.message-box-full').children();

    function typeEl(idx) {
      if (idx >= $elements.length) return;

      var $el      = $($elements[idx]);
      var fullHtml = $el.html();
      var plain    = $('<div>').html(fullHtml).text();
      var i        = 0;

      // Lock the element's rendered height BEFORE clearing — box never shifts
      var lockedH = $el.outerHeight(true);
      $el.css({ 'min-height': lockedH + 'px', visibility: 'visible' }).html('');

      var tick = setInterval(function () {
        i++;
        $el.text(plain.substring(0, i));
        if (i >= plain.length) {
          clearInterval(tick);
          $el.html(fullHtml).css('min-height', ''); // restore bold/emoji, release lock
          setTimeout(function () { typeEl(idx + 1); }, PAUSE_AFTER);
        }
      }, TYPING_SPEED);
    }

    typeEl(0);
  }

  $('#story').click(function () {
    $(this).fadeOut('slow');
    $('.cake, .balloons, .balloon-border, .bulb-holder, .bannar, .navbar').fadeOut('fast');

    // Children are already visibility:hidden in the HTML — no flash possible
    $('#message-page').fadeIn('slow', function () {
      startMessageTypewriter();
    });
  });

});
