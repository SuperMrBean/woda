import Vue from "vue";
import { Button } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./app.vue";

const wokooApp = document.createElement("div");
wokooApp.id = "wokooApp-my-plugin-99179";
document.body.appendChild(wokooApp);

Vue.component(Button.name, Button);
const vm = new Vue({
  el: wokooApp,
  render: (h) => h(App),
});
