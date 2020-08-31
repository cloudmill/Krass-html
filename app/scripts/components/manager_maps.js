import $ from "jquery";
export default class Manager_maps {
  constructor() {
    this.init();
  }
  init() {
    ymaps.ready(() => {
      if ($(".contacts-map").length > 0) {
        this.contactsMap();
      } else if ($(".whereBuy-map").length > 0) {
        this.whereBuyMap();
        this.whereBuyMapAjaxLogic();
      } else {
        this.modalMap();
      }
    });
  }
  contactsMap() {
    var myMap = this.createMap([55.751574, 37.573856]);
    this.setPlaceMark(myMap, "contacts");

    this.setOptionsMap(myMap, { geo: false });
  }
  whereBuyMap() {
    var myMap = this.createMap([55.751574, 37.573856]);
    this.setPlaceMark(myMap, "whereBuy");

    this.setOptionsMap(myMap);
  }
  modalMap() {
    $(".map-content").append('<div id="map"></div>');
    var myMap = this.createMap([55.751574, 37.573856]);
    this.setPlaceMark(myMap, "modal");

    this.setOptionsMap(myMap, { geo: false });
  }

  createMap(center) {
    return new ymaps.Map(
      "map",
      {
        center: center,
        zoom: 9,
        controls: ["geolocationControl"],
      },
      {
        searchControlProvider: "yandex#search",
      }
    );
  }
  setPlaceMark(myMap, type) {
    // if (type == "contacts") {
    //   let i = 0;
    //   let that = this;
    //   let dataCords = "55.688172, 37.719791";
    //   let coords = dataCords.replace(" ", "").split(",");
    //   let dataName = "Вектор (ТЦ Муравейник)";
    //   let dataContent = "ул. Октябрьский проспект, 73<br>8 (3842) 538-72-20<br>stroi-737@mail.ru";
    //   let ballonContent = {};
    //   let iconSettings = {
    //     iconImageSize: [67, 107],
    //     iconImageOffset: [-33, -107],
    //   };
    //   ballonContent = {
    //     balloonContentHeader:
    //       "<span class='placemark-name' >" + dataName + "</span>",
    //     balloonContentBody:
    //       "<span class='placemark-content' >" + dataContent + "</span>",
    //   };
    //   iconSettings = {
    //     iconImageSize: [29, 45],
    //     iconImageOffset: [-14, -45],
    //   };

    //   let myPlacemark = new ymaps.Placemark(coords, ballonContent, {
    //     iconLayout: "default#image",
    //     iconImageHref: "/local/templates/main/images/mapicon.png",
    //     ...iconSettings,
    //   });
    //   myPlacemark.id = i;
    //   that.linkedWithPointForWhereBuy(myMap, myPlacemark);
    //   i++;
    //   myMap.geoObjects.add(myPlacemark);
    // }
    let i = 0;
    let that = this;
    $(".map-data input").each(function () {
      let dataCords = $(this).attr("data-cords");
      let coords = dataCords.replace(" ", "").split(",");
      let dataName = $(this).attr("data-name");
      let dataContent = $(this).attr("data-content");
      let ballonContent = {};
      let iconSettings = {
        iconImageSize: [67, 107],
        iconImageOffset: [-33, -107],
      };
      if (type == "whereBuy") {
        ballonContent = {
          balloonContentHeader:
            "<span class='placemark-name' >" + dataName + "</span>",
          balloonContentBody:
            "<span class='placemark-content' >" + dataContent + "</span>",
        };
        iconSettings = {
          iconImageSize: [29, 45],
          iconImageOffset: [-14, -45],
        };
      }
      let myPlacemark = new ymaps.Placemark(coords, ballonContent, {
        iconLayout: "default#image",
        iconImageHref: "/local/templates/main/images/mapicon.png",
        ...iconSettings,
      });
      myPlacemark.id = i;
      that.linkedWithPointForWhereBuy(myMap, myPlacemark);
      i++;
      myMap.geoObjects.add(myPlacemark);
    });
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
  setSearchControls(myMap) {
    let that = this;
    let searchControl = new ymaps.control.SearchControl({
      options: {
        provider: "yandex#search",
      },
    });
    window.searchControl = searchControl;
    myMap.controls.add(searchControl);

    $(".show-in-map").click(function (e) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: $("#map").offset().top - 90 }, 500); // анимируем скроолинг к элементу scroll_el
      let search = $(this).attr("data-search");
      if ($("#map-block #map").length > 0) {
        $("[href='#map-block']").click();
        that.search(search);
      } else {
        that.search(search);
      }
    });
  }
  linkedWithPointForWhereBuy(myMap, placeMark) {
    let pointTarget = $(".whereBuy-map-item[data-id=" + placeMark.id + "]");

    pointTarget.click(() => {
      placeMark.events.fire("click", {
        coordPosition: placeMark.geometry.getCoordinates(),
        target: placeMark,
      });
      myMap.panTo([placeMark.geometry.getCoordinates()], {
        flying: true,
      });
    });
    placeMark.events.add("click", (e) => {
      //Активация элелмента в списке и проктутка до него
      //var tempScrollbar = Scrollbar.get($(".whereBuy-map-item").eq(0)[0]);

      $(".whereBuy-map-item").removeClass("active");
      pointTarget.addClass("active");
    });
  }
  setOptionsMap(myMap, opts = { geo: true }) {
    myMap.behaviors.disable("scrollZoom");
    myMap.events.add("click", function () {
      myMap.balloon.close();
    });
    myMap.controls.add(
      new ymaps.control.ZoomControl({
        options: {
          size: "auto",
          float: "none",
          position: { right: 10, bottom: 40 },
        },
      })
    );
    if ($(window).width() <= 768) {
      myMap.behaviors.disable("drag");
    }
    if (opts.geo) this.setGeoLocation(myMap);
    this.setSearchControls(myMap);
  }
  removeMap(){
    $('#map *').remove();
  }
  whereBuyMapAjaxLogic() {
    let that = this;
    let success =  (data) => {
      $(".whereBuy-map").find(".whereBuy-map-list").remove();
      let shopEl = $(data).find(".whereBuy-map-list");
      $(".whereBuy-map-content").append(shopEl);

      let inpEl = $(data).find(".map-data").find("input");
      $(".map-data").find("input").remove();
      $(".map-data").append(inpEl);
      that.removeMap();
      that.whereBuyMap();
    };
    $(".whereBuy-filter-type-item").on("change", function () {
      let saleType = $(this).attr("for");
      $.ajax({
        type: "POST",
        url: "http://krass.hellem.ru/whereBuy/",
        dataType: "html",
        data: {
          ajax_sale_type: true,
          sale_type_id: saleType,
        },
        success: function (data) {
          $("#region").find("option").remove();
          let el = $(data).find("#region").find("option");
          $("#region").append(el);

          success(data);
        },
      });
    });

    $("#region").on("change", function () {
      let selectCity = $(this).val();
      $.ajax({
        type: "POST",
        url: "http://krass.hellem.ru/whereBuy/",
        dataType: "html",
        data: {
          ajax_city_select: true,
          cityId: selectCity,
        },
        success: function (data) {
          success(data);
        },
      });
    });
  }

  search(str) {
    window.searchControl.search(str);
  }
}
