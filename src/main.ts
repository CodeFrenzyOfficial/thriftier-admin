import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";

import "swiper/css";
import "swiper/css/pagination";
import "@/assets/css/style.css";
import "preline/dist";

import { createHead } from "@vueuse/head";
import { useAuthStore } from "@/stores/auth";

import { MazUi } from "maz-ui/plugins/maz-ui";

import { mazUi } from "@maz-ui/themes";
import { en } from "@maz-ui/translations";

import "maz-ui/styles";

const app = createApp(App);

app.use(MazUi, {
  theme: {
    preset: mazUi,
  },
  translations: {
    messages: { en },
  },
});

const pinia = createPinia();
pinia.use(piniaPersistedState);

app.use(pinia);
app.use(createHead());

// Initialize auth store before router
const authStore = useAuthStore();

// Wait for auth to initialize before mounting app and router
authStore.initialize().then(() => {
  app.use(router);

  router.afterEach(() => {
    setTimeout(() => {
      if (window.HSStaticMethods?.autoInit) {
        window.HSStaticMethods.autoInit();
      }
    }, 0);
  });

  app.mount("#app");
});
