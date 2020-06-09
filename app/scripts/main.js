import $ from "jquery";
import Swiper from "swiper";
import 'select2';

import TabController from "./components/tabController.js";
var App = function() {
  
  var tabs = new TabController();
  $('.field-select select').select2()
};

export default App;
