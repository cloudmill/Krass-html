import $ from "jquery";
import * as ScrollMagic from "scrollmagic";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

import { TweenMax, TimelineMax, TweenLite } from "gsap";
import { Linear, Power2 } from "gsap";

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

export default class ViewController {
  constructor() {
    this.showWithScroll();
    this.paralax();
  }
  showWithScroll() {
    window.onScroll(() => {
      this.each();
    });
    this.each();
  }
  each() {
    var _ = this;
    $(".view-item").each(function () {
      var opacity = _.check($(this));
      opacity =
        opacity <= 1.1 && opacity >= 0 ? opacity : opacity > 1.1 ? 1 : 0;
      this.style.opacity = opacity;
      // TweenLite.set(this, {
      //   opacity: opacity,
      // });
    });
  }
  check(el) {
    let height = el.height();
    let addHeight = 300 > height ? 300 : height;
    let wHeight = $(window).height();
    let top = el.offset().top - $(document).scrollTop();

    if (top + addHeight > wHeight) {
      return 1 - (top - wHeight + addHeight) / addHeight;
    } else {
      if (height < 300) {
        return (top + height / 2) / addHeight;
      } else return (top + addHeight) / addHeight;
    }
  }
  paralax() {
    var controller = new ScrollMagic.Controller();

    $(".paralax-box").each(function () {
      var tl = new TimelineMax();
      var child = $(this).find(".paralax-item");
      tl.to(child, 1, { y: 90, ease: Linear.easeNone });

      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        triggerHook: 0.8,
        duration: "80%",
      })
        .setTween(tl)
        .addTo(controller);
    });
  }
  startShowing() {
    setInterval(() => {
      if (!this.time) this.clearStyleHide();
    }, 100);
  }
  clearStyleHide() {
    let items = $(document).find(".show-item");
    let i = 0;
    this.time = setInterval(() => {
      let item = items.eq(i);
      if (item.attr("animed") != 1) {
        item.attr("animed", 1);
        TweenLite.to(item, 1, {
          opacity: 1,
          x: 0,
          y: 0,
          ease: Power2.easeInOut,
        });
        setTimeout(() => {
          item.removeClass("show-item");
        }, 600);
      }
      i++;
      if (i == items.length) {
        clearInterval(this.time);
        this.time = null;
      }
    }, 200);
  }
}
