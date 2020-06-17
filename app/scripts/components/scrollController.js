import $ from "jquery";
import * as GSAP from "gsap";

export default class ScrollController {
  constructor() {
    this.handlers = [];
    window.onScroll = this.onScroll.bind(this);

    this.scroller = {
      target: document.querySelector("#scroll-box"),
      ease: 0.1, // <= scroll speed
      endY: 0,
      y: 0,
      resizeRequest: 1,
      scrollRequest: 0,
    };
    this.requestId = null;
    this.init();
  }
  onScroll(handler) {
    this.handlers.push(handler);
  }
  update() {
    var html = document.documentElement;
    var body = document.body;
    var resized = this.scroller.resizeRequest > 0;

    if (resized) {
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
    this.requestId = this.scroller.scrollRequest > 0
      ? requestAnimationFrame(this.update.bind(this))
      : null;
  }
  updateHandlers() {
    this.handlers.forEach((item) => {
      item();
    });
  }
  init() {
    GSAP.CSSPlugin.force3D = true;
    GSAP.TweenLite.set(this.scroller.target, {
      rotation: 0,
      force3D: true,
    });

    this.update();
    window.focus();
    window.addEventListener("resize", this.resize.bind(this));
    document.addEventListener("scroll", this.scroll.bind(this));
  }
  scroll() {
    
    this.scroller.scrollRequest++;
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(this.update.bind(this));
    }
    this.updateHandlers();
  }
  resize() {
    this.scroller.resizeRequest++;
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(this.update.bind(this));
    }
  }
}
