import $ from "jquery";
import "select2";

export default class FormsController {
  constructor() {
    this.initSelect2();
  }
  initSelect2() {
    $(".field-select select").select2({
      minimumResultsForSearch: Infinity,
      dropdownParent: $(".selectArea"),
    });
    $(".field-select select").on("select2:open", function (e) {
      $(".selectArea").addClass("active");
      var html = $('[aria-owns="select2-region-results"]')
        .find(".select2-selection__rendered")
        .eq(0)[0].outerHTML;
      console.log(html);
      $(".select2-dropdown").find(".select2-selection__rendered").remove();
      $(".select2-dropdown").append(html);
      $("html").addClass("closeScroll");
    });
    $(".field-select select").on("select2:closing", function (e) {
      $(".selectArea").removeClass("active");
      $("html").removeClass("closeScroll");
    });
    $(document).on(
      "click",
      ".select2-dropdown .select2-selection__rendered",
      function (e) {
        $(".field-select select").select2("close");
      }
    );
  }
}
