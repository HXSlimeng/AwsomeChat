import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    alias: {
      "@": "./src"
    },
    transformImport: [
    ]
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        pathRewrite: { '^/api': '' }
      },
      "/baidu": {
        target: "https://aip.baidubce.com",
        pathRewrite: { '^/baidu': '' }
      }
    }
  }
});
