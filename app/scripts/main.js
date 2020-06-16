import TabController from "./components/tabController.js";
import ModalController from "./components/modalController.js";
import ScrollController from "./components/scrollController.js";
import FormsController from "./components/formsController.js";
import ViewController from "./components/viewController.js";
import Header from "./components/header.js";

var App = function () {
  var scroll = new ScrollController();
  var tabs = new TabController();
  var modals = new ModalController();
  var forms = new FormsController();
  var view = new ViewController();
  var header = new Header();
};

export default App;
