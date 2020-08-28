import $ from "jquery";
import App from "./main.js";

window.$ = $;
window.Config = {
  debug: true,
};



$(document).ready(function () {
  let app = new App();
});
