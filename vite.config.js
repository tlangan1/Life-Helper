import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';

import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";

// See https://vitejs.dev/config/server-options.html
// This DOES NOT appear to be doing anything relevant so I commented it out.
// dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line along with the import above to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    mkcert(),
    VitePWA({
      srcDir: "src",
      filename: "service_worker.js",
      strategies: "injectManifest",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
