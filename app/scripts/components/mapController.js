export default class MapController {
  constructor() {
    this.init();
  }
  init() {
    ymaps.ready(()=>{
      this.contactsMap();
    });
  }
  contactsMap() {
    var myMap = new ymaps.Map(
        "map",
        {
          center: [55.751574, 37.573856],
          zoom: 9,
        },
        {
          searchControlProvider: "yandex#search",
        }
      ),
      myPlacemark = new ymaps.Placemark(
        myMap.getCenter(),
        {
          // hintContent: "Собственный значок метки",
          // balloonContent: "Это красивая метка",
        },
        {
          iconLayout: "default#image",
          iconImageHref: "images/mapicon.png",
          iconImageSize: [67, 107],
          iconImageOffset: [-33, 0],
        }
      );

    myMap.geoObjects.add(myPlacemark)
  }
}
