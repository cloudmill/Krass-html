import $ from "jquery";
import { gsap } from "gsap";

export default class TabController {
  constructor() {
    this.togleClickerInit();
    this.tabsMenuInit();
  }
  togleClickerInit() {
    $(document).on("click", "[data-toggle]", function () {
      $("#" + $(this).attr("data-toggle")).toggleClass("active");
      // var logo = document.getElementById($(this).attr("data-toggle"));
      // gsap.to(logo, 1, {opacity:"1"});
    });
  }
  tabsMenuInit() {
    $(document).on("click", "[data-trigger]:not(.active)", function () {
      $("[data-trigger]").parent().removeClass("active");
      $("[data-trigger]").parent().removeClass("prev");
      var index = $(this).parent().index();
      $("[data-trigger]").each(function(){
        var i = $(this).parent().index()
        if(i < index) $(this).parent().addClass('prev')
      })
      $(this).parent().addClass("active");
      $("[data-target]").removeClass("active");
      $("[data-target='" + $(this).attr("data-trigger") + "']").addClass("active");
    });
  }
}
