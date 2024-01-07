import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';
import dns from "dns";

// import basicSsl from "@vitejs/plugin-basic-ssl";
import mkcert from "vite-plugin-mkcert";

// See https://vitejs.dev/config/server-options.html
// I think this is necessary but not certain
// TODO: Test this
dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    // basicSsl(),
    mkcert(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
