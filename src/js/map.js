(function () {
let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    center: [59.949349, 30.353162],
    zoom: 12,
    controls: [],
  });

  const coords = [
    [59.93991223, 30.41813395],
    [59.96217522, 30.29477379],
    [59.93556572, 30.27425277],
    [59.92774729, 30.36055552]
  ];

  const mediaQueryTablets = window.matchMedia('(max-width: 768px)');
  if (mediaQueryTablets.matches) {
    var myCollection = new ymaps.GeoObjectCollection({}, {
    draggable: false, 
    iconLayout: 'default#image',
    iconImageHref: "./img/icons/marker.svg",
    iconImageSize: [43, 55],
    iconImageOffset: [-3, -42]
  });
  } else {
    var myCollection = new ymaps.GeoObjectCollection({}, {
      draggable: false, 
      iconLayout: 'default#image',
      iconImageHref: "./img/icons/marker.svg",
      iconImageSize: [58, 73],
      iconImageOffset: [-3, -42]
    });
  }
 
  coords.forEach(coord => {
    myCollection.add(new ymaps.Placemark(coord));
  });

  myMap.geoObjects.add(myCollection);

  myMap.behaviors.disable('scrollZoom');

}

ymaps.ready(init);
})()