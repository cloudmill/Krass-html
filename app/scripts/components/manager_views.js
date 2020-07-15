import $ from "jquery";

import Controller_paralax from "./views/controller_paralax.js";
import Controller_fixed from "./views/controller_fixed.js";
import Controller_video from "./views/controller_video.js";
import Controller_preloader from "./views/controller_preloader.js";
import Controller_pageSurfing from "./views/controller_pageSurfing.js";
import Controller_difAnimate from "./views/controller_difAnimate.js";

export default class Manager_views {
  constructor() {
    this.correctStyles();
    this.pageSurfing = new Controller_pageSurfing();
    this.preloader = new Controller_preloader();
    this.paralax = new Controller_paralax();
    this.fixed = new Controller_fixed();
    this.video = new Controller_video();
    this.animate = new Controller_difAnimate();
  }
  init() {
    this.paralax.init();
    this.fixed.init();
    this.video.init();
    this.animate.init();
  }
  correctStyles() {
    let currentLogoPreloadingPos = () => {
      //установка позиции лого для возвращения после прелоадера
      setTimeout(() => {
        let left = $(".header-logo-box").offset().left;
        $(".header-logo").css("left", left + "px");
        //выравнивание тектса по лого
        $(".main-banner-sub").css("left", left - 40 + "px");
        $(".news-detail-box").css("left", left - 40 + "px");
        $(".page-404-content span").css(
          "left",
          -($(window).width() - 80) / 2 + left - 40 + "px"
        );
      }, 300);

      //корректировка скорости бегущей строки в большой кнопке
      $(".big-link").each(function () {
        let strs = $(this).find(".big-link-mask span");
        let widthStr = strs.eq(0).width() + 20;
        let defaultDuration = 4;
        let newDuration =
          defaultDuration *
          (widthStr / $(".big-link").find(".big-link-mask").width());
        strs.css("animation-duration", newDuration + "s");
      });
    };
    currentLogoPreloadingPos();
    window.onresize = () => {
      currentLogoPreloadingPos();
    };
  }
  animateController() {
    let staggersAnimate = function () {
      let mouseOld = { x: 0, y: 0 };
      let mouse = { x: 0, y: 0 };
      let d = 0;
      $(document).mousemove(function (e) {
        d = mouseOld.x - mouse.x;
        mouseOld.x = mouse.x;
        mouseOld.y = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });
      $(".staggers-item .hit").hover(function () {
        if ($(window).width() >= 1024) {
          let max = 8;
          let deg = -d;
          let elem = $(this).parent().find("i");
          if (deg > max) deg = max;
          if (deg < -max) deg = -max;
          clearTimeout($(this).attr("data-time"));
          elem.css("transform", "rotate(" + deg + "deg)");
          let i = $(this).attr("data-count") || 1;
          $(this).attr("data-count", ++i);
          let time = setInterval(() => {
            deg = deg * -0.6;
            deg = parseInt(deg * 100) / 100;
            elem.css("transform", "rotate(" + deg + "deg)");
            if (Math.abs(deg) < 1) {
              elem.css("transform", "rotate(" + 0 + "deg)");
              clearTimeout(time);
            }
          }, 300);
          $(this).attr("data-time", time);
        }
      });
    };
    if ($(".staggers-item i.hit").length > 0) {
      staggersAnimate();
    }
  }
}
