import Manager_tabs from "./components/manager_tabs.js";
import Manager_modals from "./components/manager_modals.js";
import Manager_scroll from "./components/manager_scroll.js";
import Manager_forms from "./components/manager_forms.js";
import Manager_views from "./components/manager_views.js";
import Manager_sliders from "./components/manager_sliders.js";
import Manager_maps from "./components/manager_maps.js";

import Header from "./components/header.js";

class App {
  constructor() {
    window.initedItems = [];
    this.scroll = new Manager_scroll();
    this.views = new Manager_views();
    this.tabs = new Manager_tabs();
    window.modals = this.modals = new Manager_modals();
    this.forms = new Manager_forms();
    this.sliders = new Manager_sliders();
    this.maps = new Manager_maps();
    this.header = new Header();

    window.XHRon("complete", () => {
      this.views.init();
      this.modals.init();
      this.forms.init();
      this.sliders.init();
      this.maps.init();
      this.header.update();
      window.updateForce();
    });
  }
}

export default App;
