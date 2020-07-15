import Manager_tabs from "./components/manager_tabs.js";
import Manager_modals from "./components/manager_modals.js";
import Manager_scroll from "./components/manager_scroll.js";
import Manager_forms from "./components/manager_forms.js";
import Manager_views from "./components/manager_views.js";
import Manager_sliders from "./components/manager_sliders.js";
import Manager_maps from "./components/manager_maps.js";

import Header from "./components/header.js";

var App = function () {
  var scroll = new Manager_scroll();
  var views = new Manager_views();
  var tabs = new Manager_tabs();
  var modals = new Manager_modals();
  var forms = new Manager_forms();
  var sliders = new Manager_sliders();
  var maps = new Manager_maps();

  var header = new Header();
};

export default App;
