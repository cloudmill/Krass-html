import TabController from "./components/tabController.js";
import ModalController from "./components/modalController.js";
import ScrollController from "./components/scrollController.js";
import FormsController from "./components/formsController.js";
import ViewController from "./components/viewController.js";
import Header from "./components/header.js";
import SlidersController from "./components/slidersController.js";
import PreloaderController from "./components/preloaderController.js";
import MapController from "./components/mapController.js";

var App = function () {
  var preloader = new PreloaderController();
  var scroll = new ScrollController();
  var view = new ViewController();
  var tabs = new TabController();
  var modals = new ModalController();
  var forms = new FormsController();
  var header = new Header();
  var slidersController = new SlidersController();
  var mapController = new MapController();

  preloader.onLoad(() => {
    view.startShowing();
  });
};

export default App;
