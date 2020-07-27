import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/styles.css";
import router from "./router";

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  el: "#app",
  router,
  mounted() {
    this.$on("login", async () => {
      let redirect = this.$route.query.redirect;
      this.$router.push(redirect || "/app/user");
    });
  }
});
