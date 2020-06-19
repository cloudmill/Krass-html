import $ from "jquery";
import * as ScrollMagic from "scrollmagic";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

import { TweenMax, TimelineMax, TweenLite } from "gsap";
import { Linear, Power2, CSSPlugin, Elastic } from "gsap";

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

export default class ViewController {
  constructor() {
    this.correctStyles();
    this.paralax();
    // this.showWithScrollSteps();
    //this.showWithScroll();
  }
  correctStyles() {
    let currentLogoPreloadingPos = () => {
      //установка позиции лого для возвращения после прелоадера
      let left = $(".header-logo-box").offset().left;
      $(".header-logo").css("left", left + "px");
      let top = $(".header-logo-box").offset().top;
      $(".header-logo").css("top", top + "px");

      //выравнивание тектса по лого
      $(".main-banner-sub").css("left", left - 40 + "px");

      //корректировка скорости бегущей строки в большой кнопке
      $(".big-link").each(function () {
        let strs = $(".big-link").find(".big-link-mask span");
        let widthStr = strs.eq(0).width() + 20;
        let defaultDuration = 3;
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
  paralax() {
    var controller = new ScrollMagic.Controller();

    $(".paralax-box").each(function () {
      var triggerHook = $(this).attr('data-hook') || 0.8 
      var tl = new TimelineMax();
      var child = $(this).find(".paralax-item");
      tl.to(child, 1, { y: 90, ease: Linear.easeNone });

      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        triggerHook: triggerHook,
        duration: "80%",
      })
        .setTween(tl)
        .addTo(controller);
    });
  }
  startShowing() {
    setInterval(() => {
      let items = $(document).find(".show-item");
      if (!this.time && items.length > 0) this.clearStyleHide(items);
    }, 100);
  }
  clearStyleHide(items) {
    let groupsItems = [];
    items.each((key, item) => {
      let group = item.getAttribute("data-group");
      if (groupsItems[group]) {
        groupsItems[group].push(item);
      } else {
        groupsItems[group] = [];
        groupsItems[group].push(item);
      }
    });
    let i = 0;
    this.time = setInterval(() => {
      let lenght = 0;
      groupsItems.forEach((group) => {
        if (lenght < group.length) lenght = group.length;
        if (group.length > i) {
          let item = group[i];
          if ($(item).attr("animed") != 1) {
            $(item).attr("animed", 1);
            TweenLite.to(item, 1, {
              opacity: 1,
              x: 0,
              y: 0,
              ease: Power2.easeInOut,
            });
            setTimeout(() => {
              $(item).removeClass("show-item");
            }, 600);
          }
        }
      });
      i++;
      if (i == lenght) {
        clearInterval(this.time);
        this.time = null;
      }
    }, 200);
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
}
