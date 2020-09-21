import $ from "jquery";
const APIKEY = "379d541b-4caa-4542-9d9c-da60da6f9abe";
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
      window.regionCenter = this.regionCenter.bind(this);
    });
  }
  contactsMap() {
    var myMap = this.createMap([55.751574, 37.573856]);
    this.map = myMap;
    this.setPlaceMark(myMap, "contacts");

    this.setOptionsMap(myMap, { geo: false });
  }
  whereBuyMap() {
    var myMap = this.createMap([55.751574, 37.573856]);
    this.map = myMap;
    this.setPlaceMark(myMap, "whereBuy");

    this.setOptionsMap(myMap);
  }
  modalMap() {
    $(".map-content").append('<div id="map"></div>');
    var myMap = this.createMap([55.751574, 37.573856]);
    this.map = myMap;
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
  clustererInit() {
    var clusterIcons = [
        {
          href: `/local/templates/main/images/map-pin-black.svg`,
          size: [29, 45],
          offset: [-14, -45],
        },
        {
          href: `/local/templates/main/images/map-pin-black.svg`,
          size: [29, 45],
          offset: [-14, -45],
        },
      ],
      MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="map-clusterer" >{{ properties.geoObjects.length }}</div>'
      );
    this.clusterer = new ymaps.Clusterer({
      clusterIcons: clusterIcons,
      clusterIconContentLayout: MyIconContentLayout,
    });
  }
  setPlaceMark(myMap, type) {
    this.clustererInit();
    let i = 0;
    $(".map-data input").each((key, item) => {
      let dataCords = $(item).attr("data-cords");
      let coords = dataCords.replace(" ", "").split(",");
      let dataName = $(item).attr("data-name");
      let dataContent = $(item).attr("data-content");
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
      let img = $('.whereBuy-filter-type-item:first-child input').is(':checked') ? "map-pin-blue.svg" : "map-pin-red.svg"
      let myPlacemark = new ymaps.Placemark(coords, ballonContent, {
        iconLayout: "default#image",
        iconImageHref: "/local/templates/main/images/"+img,
        ...iconSettings,
      });
      myPlacemark.id = i;
      this.linkedWithPointForWhereBuy(myMap, myPlacemark);
      i++;
      this.clusterer.add(myPlacemark);
    });
    myMap.geoObjects.add(this.clusterer);
  }
  async setRegions(myMap) {
    this.regions = null;
    var result = await ymaps.borders.load("RU");
    this.regions = ymaps.geoQuery(result);
    this.regions.setOptions("fillColor", "rgba(0,0,0,0)");
    this.regions.setOptions("borderColor", "rgba(0,0,0,0)");
    this.regions.addToMap(myMap);
  }
  regionCenter(region) {
    switch (region) {
      case "ХМАО":
        region = "Ханты-Мансийский автономный округ";
      case "ЯНАО":
        region = "Ямало-Ненецкий автономный округ";
    }
    region = region.toLowerCase();

    this.regions.each((item) => {
      if (item.properties._data.name.toLowerCase().indexOf(region) != -1) {
        console.log(region, item.properties._data.name);
        this.map.setBounds(item.geometry.getBounds());
      }
    });
  }
  async setGeoLocation(myMap) {
    try {
      if (!this.regions) {
        await this.setRegions(myMap);
      } else {
        this.regions.addToMap(myMap);
      }
      let geo = ymaps.geolocation;
      let result;
      await geo
        .get({
          provider: "yandex",
          mapStateAutoApply: true,
        })
        .then((res) => {
          result = res;
        });
      result.geoObjects.options.set("preset", "islands#geolocationIcon");
      result.geoObjects.get(0).properties.set({
        balloonContentBody: "Мое местоположение",
      });
      myMap.geoObjects.add(result.geoObjects);

      this.regions.each((item) => {
        if (item.geometry.contains(result.geoObjects.position)) {
          this.region = item;
        }
      });
      let position = this.region.properties._data.name;
      if ($("#region").length > 0 && !$("#region").is("[changed]")) {
        $("#region")
          .find("option")
          .each((k, item) => {
            if (
              position.toLowerCase().indexOf(item.textContent.toLowerCase()) !=
              -1
            ) {
              item.selected = true;
              $("#region").trigger("change");
            }
          });
        $("#region").attr("changed", "1");
      } else {
        setTimeout(() => {
          this.regionCenter($("#region").find(":selected").text());
        }, 100);
      }
      $(".whereBuy-filter-geo").click(() => {
        let btnGeo = $("[class*=-float-button-icon_icon_geolocation]");
        if (btnGeo.length > 0) btnGeo.click();
      });
    } catch (e) {
      console.log(e);
    }
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
  removeMap() {
    $("#map *").remove();
  }
  whereBuyMapAjaxLogic() {
    let that = this;
    let success = (data) => {
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

    $("#region").on("change", (e) => {
      let selectCity = $(e.target).val();
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
