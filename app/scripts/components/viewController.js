import $ from "jquery";
import * as ScrollMagic from "scrollmagic";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

import { TweenMax, TimelineMax, TweenLite } from "gsap";
import { Linear, Power2, CSSPlugin, Elastic } from "gsap";

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

class ParalaxItem {
  constructor(opts) {
    this.parent = opts.parent;
    this.child = opts.child;
    this.duration = 0.9;
    this.way = 90;
    this.hook = opts.hook || 0.9;
  }
  update(y) {
    this.startPos = this.parent.offset().top - window.innerHeight * this.hook;
    this.endPos = this.startPos + window.innerHeight * this.duration;
    if (y - this.startPos >= 0 && this.endPos - y >= 0) {
      this.currentOffset =
        (this.way / (this.endPos - this.startPos)) * (y - this.startPos);
      this.child.css(
        "transform",
        "translate3d(0," + this.currentOffset + "px,0)"
      );
    } else if (y - this.startPos < 0) {
      this.child.css("transform", "translate3d(0,0,0)");
    } else if (this.endPos - y < 0) {
      this.child.css("transform", "translate3d(0," + this.way + "px,0)");
    }
  }
}
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
      setTimeout(() => {
        let left = $(".header-logo-box").offset().left;
        $(".header-logo").css("left", left + "px");
        //выравнивание тектса по лого
        $(".main-banner-sub").css("left", left - 40 + "px");
      }, 100);

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
  paralax() {
    let paralaxItems = [];
    $(".paralax-box").each(function () {
      paralaxItems.push(
        new ParalaxItem({
          parent: $(this),
          child: $(this).find(".paralax-item"),
          hook: $(this).attr("data-hook"),
        })
      );
    });
    window.onScroll((y) => {
      paralaxItems.forEach((item) => {
        item.update(y);
      });
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
          if (!$(item).hasClass("play")) {
            $(item).addClass("play");
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
