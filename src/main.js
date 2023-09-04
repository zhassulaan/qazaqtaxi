// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import "./assets/styles/main.scss";
import { createI18n } from "vue-i18n";

// langs
import ru from "./locales/ru.json";
import kk from "./locales/kk.json";
import en from "./locales/en.json";

const app = createApp(App);

const storedLang = localStorage.getItem("lang") || "ru";

const i18n = createI18n({
	legacy: false,
	globalInjection: true,
	locale: storedLang,
	messages: {
		ru,
		kk,
		en,
	},
});
app.use(i18n);

registerPlugins(app);

app.mount('#app');
