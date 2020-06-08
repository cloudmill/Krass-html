import $ from "jquery";
import { gsap } from "gsap";

export default class TabController {
  constructor() {
    this.togleClickerInit();
  }
  togleClickerInit() {
    console.log(gsap)
    $(document).on("click", "[data-toggle]", function () {
      $("#" + $(this).attr("data-toggle")).toggleClass("active");
      // var logo = document.getElementById($(this).attr("data-toggle"));
      // gsap.to(logo, 1, {opacity:"1"});
    });
  }
}
