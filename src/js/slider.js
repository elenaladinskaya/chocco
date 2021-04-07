// bxSlider
// (function () {
//   const slider = $('.slider__list').bxSlider({
//     pager: false,
//     controls: false,
//   });

//   $('.slider__btn--left').click(e => {
//     e.preventDefault();
//     slider.goToPrevSlide();
//   });

//   $('.slider__btn--right').click(e => {
//     e.preventDefault();
//     slider.goToNextSlide();
//   });
// })()

// slick slider
(function () {
 $('.slider__list').slick({
    prevArrow: $('.slider__btn--left'),
    nextArrow: $('.slider__btn--right'),
  });
})()