import $ from "jquery";
import * as ScrollMagic from "scrollmagic";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

import { TweenMax, TimelineMax, TweenLite } from "gsap";
import { Linear, Power2, CSSPlugin, Elastic } from "gsap";

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

import Controller_paralax from "./views/controller_paralax.js";
import Controller_fixed from "./views/controller_fixed.js";
import Controller_video from "./views/controller_video.js";
import Controller_preloader from "./views/controller_preloader.js";
import Controller_pageSurfing from "./views/controller_pageSurfing.js";
import Controller_difAnimate from "./views/controller_difAnimate.js";

export default class Manager_views {
  constructor() {
    this.correctStyles();
    //this.showWithScrollSteps();
    //this.showWithScroll();
    this.pageSurfing = new Controller_pageSurfing();
    this.preloader = new Controller_preloader();
    this.paralax = new Controller_paralax();
    this.fixed = new Controller_fixed();
    this.video = new Controller_video();
    this.animate = new Controller_difAnimate();

    this.preloader.onLoad(() => {
      this.animate.startAfterLoad();
    });
  }
  init() {
    this.paralax.init();
    this.fixed.init();
    this.video.init();
    this.animate.init();
    this.animate.startAfterLoad();
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
  showWithScrollSteps() {
    var _ = this;
    window.onScroll(() => {
      each();
    });
    let each = () => {
      $(".view-item").each(function () {
        var opacity = check(this);
        opacity =
          opacity <= 1.1 && opacity >= 0 ? opacity : opacity > 1.1 ? 1 : 0;
        CSSPlugin.force3D = true;
        TweenLite.set(this, {
          opacity: opacity,
          force3D: true,
        });
      });
    };
    let check = (el) => {
      let height = el.offsetHeight;
      let defaultSize = 100;
      let addHeight = defaultSize > height ? defaultSize : height;
      let wHeight = window.innerHeight;
      let top = $(el).offset().top - document.documentElement.scrollTop;
      if (top + addHeight > wHeight) {
        return 1 - (top - wHeight + addHeight) / addHeight;
      } else {
        if (height < defaultSize) {
          return (top + height / 2) / addHeight;
        } else return (top + addHeight) / addHeight;
      }
    };
    each();
  }
  showWithScroll() {
    $(".scroll-trigger").each((key, item) => {
      var controller = new ScrollMagic.Controller();
      var tl = new TimelineMax();
      tl.staggerFrom($(item).find(".show-item"), 1.25, {
        opacity: 0,
        y: 0,
        x: 0,
        ease: Elastic.easeOut,
        stagger: {
          from: "center",
          amount: 0.25,
        },
      });
      var scene = new ScrollMagic.Scene({
        triggerElement: item,
        triggerHook: 0,
      })
        .setTween(tl)
        .addTo(controller);
    });
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
