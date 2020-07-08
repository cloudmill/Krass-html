import $ from "jquery";
export default class MapController {
  constructor() {
    this.init();
  }
  init() {
    ymaps.ready(() => {
      if ($(".contacts-map").length > 0) this.contactsMap();
      if ($(".whereBuy-map").length > 0) this.whereBuyMap();
    });
  }
  contactsMap() {
    var myMap = new ymaps.Map(
      "map",
      {
        center: [55.751574, 37.573856],
        zoom: 9,
        controls: ["zoomControl", "geolocationControl"],
      },
      {
        searchControlProvider: "yandex#search",
      }
    );
    $(".map-data input").each(function () {
      let dataCords = $(this).attr("data-cords");
      let coords = dataCords.replace(" ", "").split(",");
      let myPlacemark = new ymaps.Placemark(
        coords,
        {},
        {
          iconLayout: "default#image",
          iconImageHref: "images/mapicon.png",
          iconImageSize: [67, 107],
          iconImageOffset: [-33, -107],
        }
      );
      myMap.geoObjects.add(myPlacemark);
    });
    myMap.behaviors.disable("scrollZoom");
  }
  whereBuyMap() {
    var myMap = new ymaps.Map(
      "map",
      {
        center: [55.751574, 37.573856],
        zoom: 9,
        controls: ["zoomControl", "geolocationControl"],
      },
      {
        searchControlProvider: "yandex#search",
      }
    );
    $(".map-data input").each(function () {
      let dataCords = $(this).attr("data-cords");
      let coords = dataCords.replace(" ", "").split(",");
      let dataName = $(this).attr("data-name");
      let dataContent = $(this).attr("data-content");
      let myPlacemark = new ymaps.Placemark(
        coords,
        {
          balloonContentHeader:
            "<span class='placemark-name' >" + dataName + "</span>",
          balloonContentBody:
            "<span class='placemark-content' >" + dataContent + "</span>",
        },
        {
          iconLayout: "default#image",
          iconImageHref: "images/mapicon-blue.png",
          iconImageSize: [29, 45],
          iconImageOffset: [-14, -45],
        }
      );
      myMap.geoObjects.add(myPlacemark);
    });
    myMap.behaviors.disable("scrollZoom");
    this.setGeoLocation(myMap);
  }
  setGeoLocation(myMap) {
    let geo = ymaps.geolocation;

    geo
      .get({
        provider: "yandex",
        mapStateAutoApply: true,
      })
      .then(function (result) {
        // Красным цветом пометим положение, вычисленное через ip.
        result.geoObjects.options.set("preset", "islands#geolocationIcon");
        result.geoObjects.get(0).properties.set({
          balloonContentBody: "Мое местоположение",
        });
        myMap.geoObjects.add(result.geoObjects);
      });

    geo
      .get({
        provider: "browser",
        mapStateAutoApply: true,
      })
      .then(function (result) {
        result.geoObjects.options.set("preset", "islands#geolocationIcon");
        myMap.geoObjects.add(result.geoObjects);
      });

    $(".whereBuy-filter-geo").click(() => {
      let btnGeo = $("[class*=-float-button-icon_icon_geolocation]");
      if (btnGeo.length > 0) btnGeo.click();
    });
  }
}
