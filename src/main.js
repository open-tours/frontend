import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faLock,
  faPlus,
  faWindowClose,
  faUpload,
  faSpinner,
  faIdBadge,
  faMapMarkedAlt,
  faSearchPlus,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { apolloClient } from "./utils/apollo";
import store from "./store";
import "@/assets/main.scss";

// register icons
library.add([
  faLock,
  faEnvelope,
  faPlus,
  faWindowClose,
  faUpload,
  faSpinner,
  faIdBadge,
  faMapMarkedAlt,
  faSearchPlus,
  faPen
]);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .provide(DefaultApolloClient, apolloClient)
  .mount("#app");
