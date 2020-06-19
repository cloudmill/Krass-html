import TabController from "./components/tabController.js";
import ModalController from "./components/modalController.js";
import ScrollController from "./components/scrollController.js";
import FormsController from "./components/formsController.js";
import ViewController from "./components/viewController.js";
import Header from "./components/header.js";
import SlidersController from "./components/slidersController.js";
import PreloaderController from "./components/preloaderController.js";

var App = function () {
  var view = new ViewController();
  var preloader = new PreloaderController();
  var scroll = new ScrollController();
  var tabs = new TabController();
  var modals = new ModalController();
  var forms = new FormsController();
  var header = new Header();
  var slidersController = new SlidersController();

  preloader.onLoad(() => {
    view.startShowing();
  });
};

export default App;
