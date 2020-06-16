import $ from "jquery";
import * as ScrollMagic from "scrollmagic";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

import { TweenMax, TimelineMax, TweenLite } from "gsap";
import { Linear } from "gsap";

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

export default class ViewController {
  constructor() {
    this.init();
    this.paralax();
  }
  init() {
    window.onScroll(() => {
      this.each();
    });
    this.each();
    //this.test();
  }
  each() {
    var _ = this;
    $(".view-item").each(function () {
      var opacity = _.check($(this));
      opacity =
        opacity <= 1.1 && opacity >= 0 ? opacity : opacity > 1.1 ? 1 : 0;

      TweenLite.set(this, {
        opacity: opacity,
      });
    });
  }

  check(el) {
    var height = el.height();
    var addHeight = 300 > height ? 300 : height;
    var wHeight = $(window).height();
    var top = el.offset().top - $(document).scrollTop();

    if (top + addHeight > wHeight) {
      return 1 - (top - wHeight + addHeight) / addHeight;
    } else {
      if (height < 300) {
        return (top + height / 2) / addHeight;
      } else return (top + addHeight) / addHeight;
    }
  }

  test() {
    TweenLite.defaultEase = Linear.easeNone;
    var controller = new ScrollMagic.Controller();
    $(".view-section").each(function () {
      var tl = new TimelineMax();
      var elems = $(this).find(".view-item");
      tl.staggerFrom(elems, 1.5, {
        opacity: 0,
        cycle: {
          y: [-50, 50],
        },
        stagger: {
          from: "top",
          amount: 0.75,
        },
      });
      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        duration: "25%",
        triggerHook: 0.5,
      })
        .addIndicators({
          name: "Box Timeline",
          colorTrigger: "white",
          colorStart: "white",
          colorEnd: "white",
        })
        .setTween(tl)
        .addTo(controller);
    });
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
        .addIndicators({
          colorTrigger: "black",
          colorStart: "black",
          colorEnd: "black",
          indent: 10,
        })
        .addTo(controller);
    });
  }
}
