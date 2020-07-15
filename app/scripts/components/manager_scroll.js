import $ from "jquery";
import * as GSAP from "gsap";

export default class Manager_scroll {
  constructor() {
    this.handlers = [];
    window.onScroll = this.onScroll.bind(this);

    this.scroller = {
      target: document.querySelector("#scroll-box"),
      ease: 0.2, // <= scroll speed
      endY: 0,
      y: 0,
      resizeRequest: 1,
      scrollRequest: 0,
    };
    this.updating = false;
    this.init();
    window.updateForce = this.update.bind(this);
  }
  onScroll(handler) {
    this.handlers.push(handler);
  }
  update() {
    if ($(window).width() > 768) {
      this.updating = true;
      var html = document.documentElement;
      var body = document.body;
      var resized = this.scroller.resizeRequest > 0;

      if (resized || this.scroller.target.clientHeight != body.clientHeight) {
        var height = this.scroller.target.clientHeight;
        body.style.height = height + "px";
        this.scroller.resizeRequest = 0;
      }

      var scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

      this.scroller.endY = scrollY;
      this.scroller.y += (scrollY - this.scroller.y) * this.scroller.ease;

      if (Math.abs(scrollY - this.scroller.y) < 0.05 || resized) {
        this.scroller.y = parseInt(scrollY);
        this.scroller.scrollRequest = 0;
      }

      GSAP.TweenLite.set(this.scroller.target, {
        y: -this.scroller.y,
      });
      this.updateHandlers(this.scroller.y,scrollY);
      this.updating = false;
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        if (this.scroller.scrollRequest > 0) {
          this.update();
        }
      }, 1000 / 60);
    } else {
      this.updateHandlers($(document).scrollTop(),$(document).scrollTop());
    }
  }
  updateHandlers(scrollY,scrollYBase) {
    this.handlers.forEach((item) => {
      item(scrollY,scrollYBase);
    });
  }
  init() {
    GSAP.CSSPlugin.force3D = true;
    GSAP.TweenLite.set(this.scroller.target, {
      rotation: 0.01,
      force3D: true,
    });

    this.update();
    window.focus();
    window.addEventListener("resize", this.resize.bind(this));
    document.addEventListener("scroll", this.scroll.bind(this));
    $('a').click(()=>{
      this.update()
    })
  }
  scroll() {
    this.scroller.scrollRequest++;
    if (!this.updating) {
      this.update();
    }
  }
  resize() {
    this.scroller.resizeRequest++;
    if (!this.updating) {
      this.update();
    }
  }
}