import { defineNuxtModule, extendPages, addPlugin, addLayout } from "@nuxt/kit";
import path from "path";
import * as appRoutes from "./routes.json"; // created by `npm run build-routes`
import * as packageJson from "./package.json";

export default defineNuxtModule({
  meta: packageJson,
  async setup(options, nuxt) {
    addPlugin(path.resolve(__dirname, 'src' + '/plugins/i18n.js'), { append: true }); // append is MUST here to run this after i18n is actually instantiated.
    extendPages((pages) => {
      // Add /test page
      appRoutes.default.forEach((r) => {
        pages.push(r);
      });
    });

    addLayout(
      {
        src: path.resolve(__dirname, "src" + "/layouts/DemoLayout.vue"),
        filename: "DemoLayout.vue",
      },
      "DemoLayout"
    );
    addLayout(
      {
        src: path.resolve(__dirname, "src" + "/layouts/KendoLayout.vue"),
        filename: "KendoLayout.vue",
      },
      "KendoLayout"
    );
  },
});
