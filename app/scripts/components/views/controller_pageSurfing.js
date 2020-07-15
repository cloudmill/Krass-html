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
      href = document.location.href;
      var pageInf = {
        id: 0,
        href: href,
      };
      this.store.push(pageInf);
      history.replaceState(pageInf, null, href);
    } else {
      for (var i = 0; i < history.length - 1; i++) {
        this.store.push({
          id: i,
          url: null,
        });
      }
    }
  }
  newRequest(href, success = () => {}, failed = () => {}) {
    let that = this;
    if (window.XMLHttpRequest) {
      this.XHR = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      this.XHR = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var _this = this;
    this.XHR.onload = function (e) {
      let request = _this.XHR;
      var elem_ = $(document).find(".iframeDoc");
      if (elem_.length > 1) {
        elem_.eq(0).remove();
      }
      if (request.status == 200 || request.status == 404) {
        var temp_html = request.response;
        globalListener.trigger("XHR-success", [temp_html])
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
      var lastStore = this.store[this.store.length - 1];
      var next_id = lastStore ? lastStore.id + 1 : 0;
      var pageInf = {
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
    var _this = this;
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
      console.log(e,e.state.id,this.currentPage_id)
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

export default class Controller_pageSurfing {
  constructor() {
    this.init();
  }
  init() {
    this.reloader = new Controller_XHR();
    globalListener.on("XHR-success", (html) => {
      window.modals.closeAll();
      $("html, body").animate({ scrollTop: 0 }, 400);
      this.showPreloader();
      setTimeout(() => {
        this.reloadPageDoing(html);
      }, 400);
    })
  }
  reloadPageDoing(temp_html) {
    var that = this;
    var iframe = this.subDocument(temp_html);
    var __html = iframe.contentDocument;
    var loadedIframe = function (_html) {
      console.log("reload ________");
      var replaceDOM = function (_selector, _parent) {
        var _old = $(document).find(_selector);
        var _new = $(_html).find(_selector);
        if (!_old) {
          _parent.append(_new);
        } else {
          _old.replaceWith(_new);
        }
      };
      var wrapper = $(document).find(".wrapper");

      replaceDOM(".page", wrapper);
      replaceDOM(".header", wrapper);
      replaceDOM(".modal", wrapper);

      if (!0) {
        function getArray(selector, parent) {
          return Array.prototype.slice.call(parent.querySelectorAll(selector));
        }
        getArray('title,meta,[type="image/png"]', document.head).forEach(
          function (elem) {
            if (elem.remove) elem.remove();
          }
        );
        getArray("*", _html.head).forEach(function (elem) {
          var find = false;
          getArray("*", document.head).forEach(function (elem2) {
            if (elem2.outerHTML == elem.outerHTML) find = true;
          });
          if (!find && elem.tagName) document.head.appendChild(elem);
        });
      } else {
        document.documentElement.replaceChild(_html.head, document.head);
      }

      let doo = () => {
        globalListener.trigger("XHR-complete");
        that.hidePreloader();
      };
      if (document.readyState === "complete") {
        doo();
      } else {
        window.onload = function () {
          doo();
          window.onload = null;
        };
      }
    };
    if (iframe.contentWindow.document.readyState == "complete") {
      loadedIframe(__html);
    } else {
      iframe.onload = function () {
        loadedIframe(__html);
      };
    }
  }
  subDocument(string) {
    var _iframe = document.createElement("iframe");
    _iframe.style.display = "none";
    _iframe.className = "iframeDoc";
    document.body.appendChild(_iframe);
    var head = string.slice(
      string.indexOf("<head>") + 6,
      string.indexOf("</head>")
    );
    var body = string.slice(
      string.indexOf("<body>") + 6,
      string.indexOf("</body>")
    );
    _iframe.contentDocument.body.innerHTML = body;
    _iframe.contentDocument.head.innerHTML = head;
    return _iframe;
  }
  showPreloader() {
    this.time = performance.now();
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
