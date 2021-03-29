const hamburger = document.querySelector("#hamburger");
const fullscreenMenu = document.querySelector(".fullscreen-menu");
const close = document.querySelector(".fullscreen-menu__close")
const body = document.body;

hamburger.addEventListener("click", e => {
  e.preventDefault();

  fullscreenMenu.classList.add("active");
  body.classList.add("body-active-menu");
})

close.addEventListener("click", e => {
  e.preventDefault();

  fullscreenMenu.classList.remove("active");
  body.classList.remove("body-active-menu");
})