import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';
import dns from "dns";

import mkcert from "vite-plugin-mkcert";

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
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
