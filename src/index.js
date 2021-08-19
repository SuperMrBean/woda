import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./app.vue";

const wokooApp = document.createElement("div");
wokooApp.id = "wokooApp-my-plugin-99179";
document.body.appendChild(wokooApp);

Vue.use(ElementUI);
const vm = new Vue({
  el: wokooApp,
  render: (h) => h(App),
});
