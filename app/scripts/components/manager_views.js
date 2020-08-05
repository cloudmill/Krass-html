import Controller_paralax from "./views/controller_paralax.js";
import Controller_fixed from "./views/controller_fixed.js";
import Controller_video from "./views/controller_video.js";
import Controller_preloader from "./views/controller_preloader.js";
import Controller_pageSurfing from "./views/controller_pageSurfing.js";
import Controller_difAnimate from "./views/controller_difAnimate.js";
import Controller_showItems from "./views/controller_showItems.js";

export default class Manager_views {
  constructor() {
    this.animate = new Controller_difAnimate();
    this.pageSurfing = new Controller_pageSurfing({
      reCaller: ()=>{
        this.animate.correctStyles(false);
      }
    });
    this.preloader = new Controller_preloader();
    this.paralax = new Controller_paralax();
    this.fixed = new Controller_fixed();
    this.video = new Controller_video();
    this.showItems = new Controller_showItems();
  }
  init() {
    this.paralax.init();
    this.fixed.init();
    this.video.init();
    this.animate.init();
    this.showItems.init();
  }
  
}
