(function() {
  "use strict";
  alert(123);
  if (location.href === "http://localhost:8080/") return;
  var script = document.createElement("script");
  script.src = "./app.bundle.js";
  document.body.appendChild(script);
})();
