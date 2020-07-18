import $ from "jquery";

class Controller_XHR {
  constructor() {
    this.store = [];
    this.currentPage_id = 0;
    this.offsetPage = 0;
    this.handlers = [];
    this.init();
  }
  init() {
    this.XHR = new XMLHttpRequest();
    this.pullState();
    this.events();
    console.log("XHR inited");
  }
  pullState() {
    if (history.length == 2) {
      let href = document.location.href;
      let pageInf = {
        id: 0,
        href: href,
      };
      this.store.push(pageInf);
      history.replaceState(pageInf, null, href);
    } else {
      for (let i = 0; i < history.length - 1; i++) {
        this.store.push({
          id: i,
          url: null,
        });
      }
    }
  }
  newRequest(href, success = () => { }, failed = () => { }) {
    globalListener.trigger("XHR-start")
    let that = this;
    if (window.XMLHttpRequest) {
      this.XHR = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      this.XHR = new ActiveXObject("Microsoft.XMLHTTP");
    }
    let _this = this;
    this.XHR.onload = function (e) {
      let request = _this.XHR;
      let elem_ = $(document).find(".iframeDoc");
      if (elem_.length > 1) {
        elem_.eq(0).remove();
      }
      if (request.status == 200 || request.status == 404) {
        let newPage_html = request.response;
        globalListener.trigger("XHR-success", [newPage_html])
        success();
        _this.XHR.onload = null;
      } else {
        failed();
        globalListener.trigger("XHR-error", [e])
      }
    };

    this.XHR.open("GET", href, true);

    this.XHR.onerror = function (e) {
      globalListener.trigger("XHR-error", e)
      failed();
      _this.XHR.onerror = null;
    };
    this.XHR.send();
  }
  newPage(href, target, e) {
    let success = function () {
      if (this.offsetPage < 0) {
        this.store.splice(
          this.currentPage_id + 1,
          this.store.length - 1 - this.currentPage_id
        );
      }
      let lastStore = this.store[this.store.length - 1];
      let next_id = lastStore ? lastStore.id + 1 : 0;
      let pageInf = {
        id: next_id,
        href: href,
      };
      this.store.push(pageInf);
      history.pushState(pageInf, null, href);
      this.currentPage_id = next_id;
    }.bind(this);
    let failed = function () {
      console.log("failed__________new-page");
      target.attr("data-fail-xhr", "fail");
      target[0].click();
    }.bind(this);
    this.newRequest(href, success, failed);
  }
  backPage(href) {
    this.currentPage_id--;
    this.offsetPage--;
    console.log(href)
    this.newRequest(href);
  }
  nextPage(href) {
    this.currentPage_id++;
    this.offsetPage++;
    this.newRequest(href);
  }
  events() {
    let _this = this;
    $(document).on("click", ".wrapper a", function (e) {
      if ($(this).attr("href")) {
        let domain = location.hostname || document.domain;

        let link = $(this).attr("href");
        let haslink = link.length > 0;
        let blank = $(this).attr("target") != "_blank";
        let download = $(this).attr("download") == undefined;
        let hrefhash =
          link[0] != "#" &&
          link.indexOf("tel:") != 0 &&
          link.indexOf("mailto:") != 0 &&
          link.indexOf("callto:") != 0;
        let http = link.indexOf("http") > -1;
        let thisdomain = link.indexOf(domain) > -1;
        let insidelink = (http && thisdomain) || !http;

        if (insidelink && blank && download && hrefhash && haslink) {
          if ($(this).attr("data-fail-xhr") == undefined) {
            e.preventDefault();
            _this.newPage(link, $(this), e);
          }
        }
      }
    });
    window.addEventListener("popstate", (e) => {
      console.log(e, e.state.id, this.currentPage_id)
      if (e.state) {
        if (e.state.id < this.currentPage_id) {
          this.backPage(e.state.href);
        } else if (e.state.id > this.currentPage_id) {
          this.nextPage(e.state.href);
        }
      }
    });
  }
}
class DOMUpdater {
  constructor(wrapper, itemsForReplace) {
    this.wrapper = wrapper;
    this.selectors = itemsForReplace;
    this.newDocument = null;
  }
  update(arForReplace) {
    let that = this;
    console.log("reload ________");
    globalListener.trigger('DOM-update-start')

    let wrapper = $(document).find(this.wrapper);
    this.selectors.forEach((item) => {
      that.replace(item, wrapper);
    })

    if (!0) {
      function getArray(selector, parent) {
        return Array.prototype.slice.call(parent.querySelectorAll(selector));
      }
      getArray('title,meta,[type="image/png"]', document.head).forEach(
        function (elem) {
          if (elem.remove) elem.remove();
        }
      );
      getArray("*", this.newDocument.head).forEach(function (elem) {
        let find = false;
        getArray("*", document.head).forEach(function (elem2) {
          if (elem2.outerHTML == elem.outerHTML) find = true;
        });
        if (!find && elem.tagName) document.head.appendChild(elem);
      });
    } else {
      document.documentElement.replaceChild(this.newDocument.head, document.head);
    }
    let doo = () => {
      globalListener.trigger("XHR-complate");
      globalListener.trigger("DOM-update-end");
    };
    if (document.readyState === "complete") {
      doo();
    } else {
      window.onload = function () {
        doo();
        window.onload = null;
      };
    }
  }
  start(str_html) {
    this.iframe = this.subDocument(str_html);
    this.newDocument = this.iframe.contentDocument;
    if (this.iframe.contentWindow.document.readyState == "complete") {
      this.update()
    } else {
      this.iframe.onload = () => {
        this.update()
      };
    }
  }
  subDocument(str_html) {
    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.className = "iframeDoc";
    document.body.appendChild(iframe);
    let head = str_html.slice(
      str_html.indexOf("<head>") + 6,
      str_html.indexOf("</head>")
    );
    let body = str_html.slice(
      str_html.indexOf("<body>") + 6,
      str_html.indexOf("</body>")
    );
    iframe.contentDocument.body.innerHTML = body;
    iframe.contentDocument.head.innerHTML = head;
    return iframe;
  }
  replace(_selector, _parent) {
    let _old = $(document).find(_selector);
    let _new = $(this.newDocument).find(_selector);
    if (!_old) {
      _parent.append(_new);
    } else {
      _old.replaceWith(_new);
    }
  }
}
export default class Controller_pageSurfing {
  constructor() {
    this.init();
  }
  init() {
    this.reloader = new Controller_XHR();
    this.updater = new DOMUpdater('.wrapper', ['.page', '.modals', '.header']);
    globalListener.on("XHR-success", (str_html) => {
      this.showPreloader();
      setTimeout(() => {
        this.updater.start(str_html)
      }, 400);
    })
    globalListener.on("XHR-complate", () => {
      this.hidePreloader()
    })
  }
  showPreloader() {
    this.time = performance.now();
    window.modals.closeAll();
    $("html, body").animate({ scrollTop: 0 }, 400);
    $(".pageSurfing").addClass("active");
  }
  hidePreloader() {
    let time = performance.now() - this.time;
    if (time < 800) {
      setTimeout(() => {
        $(".pageSurfing").removeClass("active");
      }, 800 - time);
    } else {
      $(".pageSurfing").removeClass("active");
    }
  }
}
