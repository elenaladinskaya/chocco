const item = $('.menu-slider__item');

item.on("click", function () {
  if ($(this).hasClass('active')) {
    $(this).removeClass('active');
  } else {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  }

  const mediaQueryTablets = window.matchMedia('(max-width: 768px)');
  const mediaQueryPhones = window.matchMedia('(max-width: 480px)');

  if (mediaQueryTablets.matches) {
    if (item.hasClass('active')) {
      $('.section__title--left').addClass('hidden');
      $('.container--fullscreen').addClass('active');
    } else {
      $('.section__title--left').removeClass('hidden');
      $('.container--fullscreen').removeClass('active');
    }
  }

  if (mediaQueryPhones.matches) {
    $(this).removeClass('active-mobile');
    if ($(this).hasClass('active')) {
      $(this).addClass('active-mobile');
    }
  } else {
    $(this).removeClass('active-mobile');
  }
});