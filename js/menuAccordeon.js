const isPhones = window.matchMedia('(max-width: 480px)').matches; //медиа-запрос ширины экрана
const isTablets = window.matchMedia('(max-width: 840px)').matches; //медиа-запрос ширины экрана

// Функция расчета ширины блока (для открытия до левого края окна в мобильных версиях)
const mesureWidth = item => { //передаём элемент, для которого необходимо рассчитать ширину
  let reqItemWidth = 0; //необходимая ширина для текстового блока

  const screenWidth = $(window).width();//получаем ширину окна браузера
  const container = item.closest(".products-menu");
  const titlesBlocks = container.find(".products-menu__title");
  const titleWidth = titlesBlocks.width() * titlesBlocks.length; //получаем ширину открывающих меню кнопок (по умолчанию jQuery берет ширину первого элемента набора, поэтому умножаем на количество этих кнопок)

  const textContainer = item.find(".products-menu__content-text");//сохраняем данные элемента в переменную (величина паддингов)
  const paddingLeft = parseInt(textContainer.css("padding-left"));//берем из таблицы стилей левый паддинг элемента и функцией parseInt парсим из числа в пикселях в число
  const paddingRight = parseInt(textContainer.css("padding-right"));//берем из таблицы стилей правый паддинг элемента и функцией parseInt парсим из числа в пикселях в число

  // проверяем ширину экрана
  if (isPhones) {
    reqItemWidth = screenWidth - titlesBlocks.width(); //вернуть значение ширины экрана минус ширина одного блока
  } else if (isTablets) {
    reqItemWidth = screenWidth - titleWidth; //вернуть значение ширины: из ширины экрана вычесть ширину всех блоков-кнопок
  } else {
    reqItemWidth = 524; //вернуть значение
  }

  //управление шириной текстового контейнера, чтобы при срабатывании функции текст был статичен и не "прыгал"
  return {
    container: reqItemWidth, //рассчитанная ширина контейнера
    textContainer: reqItemWidth - paddingLeft - paddingRight //ширина текстового контейнера: рассчитанная ширина контейнера минус левый и правый паддинги
  }

};

// Функция закрыть все пункты меню
const closeEveryItemInContainer = container => {//передаем контейнер т.е. список ul
  const items = container.find(".products-menu__item"); //получаем все элементы li внутри контейнера
  const content = container.find(".products-menu__content"); //сохраняем в переменную блок, в который вносим изменения

  items.removeClass("active"); //удалить у всех пунктов меню класс active
  content.width(0); //установить всем элементам ширину 0
}

// Функция раскрытие пункта меню
const openThisItem = (item) => {
  const hiddenContent = item.find(".products-menu__content");//получаем доступ к спрятанному элементу с шириной 0
  const reqWidth = mesureWidth(item); //передать элемент функции расчета ширины
  const textBlock = item.find(".products-menu__content-text"); //находим текстовый блок в кликнутом элементе

  item.addClass("active"); //когда открываем пункт меню, навешиваем класс active, чтобы потом знать, открыт ли пункт
  hiddenContent.width(reqWidth.container); //передаем элементу ширину, рассчитанную в функции mesureWidth
  textBlock.width(reqWidth.textContainer); //ставим текстовому блоку ширину, которую рассчитали в функции mesureWidth
}

// Обработка клика на пункте меню
$(".products-menu__title").on("click", e => {
  e.preventDefault();

  const $this = $(e.currentTarget); //сохранить элемент, по которому был осуществлен клик
  const item = $this.closest(".products-menu__item"); //ближайший к кликнутому элементу элемент
  const itemOpened = item.hasClass("active"); //элементы с классом active
  const container = $this.closest(".products-menu"); //ближайший к кликнутому элементу контейнер ul, в котором содержатся элементы li

  //проверяем, есть ли на кликнутом элементе класс active
  if (itemOpened) {
    closeEveryItemInContainer(container);//передать все элементы ul в функцию закрытия всех элементов
  } else {
    closeEveryItemInContainer(container); //закрываем все элементы
    openThisItem(item); //передать кликнутый элемент в функцию открытия пункта меню (openItem)
  }

  // проверка на открытие с телефона
  if (isPhones) {
    if (item.hasClass("active-mobile")) {
      item.removeClass("active-mobile");
    } else {
      item.addClass("active-mobile");
    }
  }
});