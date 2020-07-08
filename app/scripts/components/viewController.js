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
    this.videoController();
    this.animateController();
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
        $(".news-detail-box").css("left", left - 40 + "px");
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
    console.log(paralaxItems);
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
  videoController() {
    $(".video").each(function () {
      if ($(this).find("iframe").length > 0) {
        let frame = $(this).find("iframe").eq(0)[0];
        let that = this;
        frame.onload = function () {
          this.contentWindow.document.body.onclick = function () {
            $(that).addClass("active");
          };
        };
      }
    });
    $(".video").click(function () {
      $(this).addClass("active");
    });
    $(".video-play").click(function () {
      if ($(this).parent().find("iframe").length > 0) {
        let frame = $(this).parent().find("iframe");
        let src = frame.attr("src");
        if (src.split("?").length > 1) {
          frame.attr("src", src + "&autoplay=1");
        } else {
          frame.attr("src", src + "?autoplay=1");
        }
      }
    });
    const resize = function () {
      $(".video").each(function () {
        if ($(this).find("iframe").length > 0) {
          let frame = $(this).find("iframe");
          let k = frame.width() / frame.height();
          frame.width($(this).width());
          frame.height(frame.width() / k);
        }
      });
    };
    resize();
    $(window).resize(function () {
      resize();
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
