// ==UserScript==
// @name         my-plugin
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author
// @match        *://zft.topchitu.com/*

// ==/UserScript==

(function() {
  "use strict";
  if (location.href === "http://localhost:8080/") return;
  var script = document.createElement("script");
  script.src = "http://localhost:8080/app.bundle.js";
  // script.src = "http://8.134.72.1/pushPlugin/app.bundle.js";
  document.body.appendChild(script);
})();
