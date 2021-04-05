const sections = $("section");
const display = $(".maincontent");
const sideMenu = $(".fixed-menu"); //сохраняем боковое меню навигации в переменную
const menuItems = sideMenu.find(".fixed-menu__item");

let inScroll = false; // переменная для проверки, скроллится ли сейчас страничка

//проверка на открытие сайта с мобильного устройства
// http://hgoebl.github.io/mobile-detect.js/
const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

sections.first().addClass("active"); //навешиваем сразу при загрузке страницы на первую секцию активный класс, чтобы дальше при скролле перемещать его, и тем самым определять текущую секцию
$(".fixed-menu__item").first().addClass("fixed-menu__item--active");

// Функция рассчета позиции (отправляем индекс секции)
const countSectionPosition = sectionEq => {
  const position = sectionEq * -100; //расчет позиции (номер секции умножить на 100)  

  if (isNaN(position)) {//проверка, если передано не числовое значение
    console.error('передано неверное значение в countSectionPosition');
    return 0;
  }
  return position;
}

// Функция смены темы бокового меню (отправляем индекс секции)
const changeMenuThemeForSection = (sectionEq) => {
  const currentSection = sections.eq(sectionEq); //берем секцию, к которой осуществили скролл
  const menuTheme = currentSection.attr("data-sidemenu-theme") //берем значение атрибута data-sidemenu-theme этой секции
  const activeClass = "fixed-menu__item--active";

  sideMenu.find(".fixed-menu__item").eq(sectionEq).addClass(activeClass).siblings().removeClass(activeClass);

  if (menuTheme === "dark") {//если тема темная, то навешиваем класс со стилизацией темной темы
    sideMenu.addClass("fixed-menu--theme-dark");
  } else {// если нет, класс убираем
    sideMenu.removeClass("fixed-menu--theme-dark");
  }
}

// Функция переключения класса на секциях и на меню
const resetActiveClassForItem = (items, itemEq, activeClass) => {
  items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
}

// Передаем номер секции
const performTransition = sectionEq => {

  if (inScroll) return;

  const transitionOver = 1000; //секунда, которую длится transition в css
  const mouseInertionOver = 300; //способ побороть инерцию мышки

  inScroll = true; //назначаем переменной состояние скролла перед началом запуска анимации при скролле 
  const position = countSectionPosition(sectionEq); //отправка индекса секции в функцию расчета позиции

  changeMenuThemeForSection(sectionEq); //вызываем функцию смены темы

  display.css({
    transform: `translateY(${position}%)` //записываем в css значение свойства
  });

  resetActiveClassForItem(sections, sectionEq, "active");


  // создаем отсрочку выполнения кода до завершения отработки функции
  setTimeout(() => {
    inScroll = false;
    resetActiveClassForItem(menuItems, sectionEq, "fixed-menu__item--active");
  }, transitionOver + mouseInertionOver); //1000 - секунда, которую длится transition в css + 300 это способ побороть инерцию мышки

};

// Функция определения, какая секция скроллится
const viewportScroller = () => {// передаем в качестве аргумента направление скролла
  const activeSection = sections.filter(".active"); //из всех секций выбрать активную
  const nextSection = activeSection.next(); // выбрать следующую секцию после активной
  const prevSection = activeSection.prev(); // выбрать предыдущую секцию после активной

  return {
    next() {
      if (nextSection.length) {// дополнительно проверяем, существует ли секция - nextSection.length
        performTransition(nextSection.index()); // передача в функцию для скролла методом индекс, чтобы взять номер секции
      }
    },
    prev() {
      if (prevSection.length) {// дополнительно проверяем, существует ли секция - prevSection.length
        performTransition(prevSection.index()); // передача в функцию для скролла методом индекс, чтобы передать номер секции
      }
    }
  }
};

// Скролл страницы
$(window).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY; //величина скролла
  const scroller = viewportScroller();

  if (deltaY > 0) {//если скролл плюсовой - следующая секция
    scroller.next();
  }

  if (deltaY < 0) {//если скролл минусовой - предыдущая секция
    scroller.prev();
  }
});

//листание сайта при помощи клавиатуры
$(window).on("keydown", (e) => {

  const tagName = e.target.tagName.toLowerCase(); //получаем имя тега, в котором производится действие нажатия клавиши + переводим в нижний регистр
  const userTypingInInputs = tagName == "input" || tagName == "textarea";
  const scroller = viewportScroller();

  if (userTypingInInputs) return;

  //если действие совершается не в теге input или textarea, то выполняем код
  switch (e.keyCode) {//keyCode - цифровое значение клавиши
    case 38: 
      scroller.prev();
      break;

    case 40: 
      scroller.next();
      break;
  }

});

$(".wrapper").on("touchmove", e => e.preventDefault()); //отключаем событие перетаскивания экрана 

// Клик по кнопкам и ссылкам с атрибутом data-scroll-to
$("[data-scroll-to]").on("click", e => {
  e.preventDefault();

  const $this = $(e.currentTarget); //сохраняем текущий элемент в переменную
  const target = $this.attr("data-scroll-to"); //берем значение его атрибута data-scroll-to
  const reqSection = $(`[data-section-id=${target}]`); //находим необходимую секцию с тем же именем атрибута

  performTransition(reqSection.index()); //передаем получившийся индекс в функцию скролла performTransition
});

// Прокрутка по свайпу для мобильных устройств
// https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
if (isMobile) {
  $("body").swipe({
    swipe: function (event, direction) {
      const scroller = viewportScroller();
      let scrollDirecrion = "";

      if (direction === "up") scrollDirecrion = "next";
      if (direction === "down") scrollDirecrion = "prev";

      scroller[scrollDirecrion]();
    }
  });
}