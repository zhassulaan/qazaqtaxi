/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          brand: "#FFBE00",
          blackish: "#3D3D3D",
          grayish: "#F5F5F5",
          graydark: "#D9D9D9",
          graydarker: "#9D9D9D",
        },
      },
    },
  },
});
