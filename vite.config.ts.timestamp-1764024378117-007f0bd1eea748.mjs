// vite.config.ts
import { defineConfig } from "file:///C:/Users/ticaa/Desktop/workspace/betterhub/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.25_lightningcss@1.30.2/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/ticaa/Desktop/workspace/betterhub/node_modules/.pnpm/@vitejs+plugin-react@5.1.1_vite@5.4.21_@types+node@20.19.25_lightningcss@1.30.2_/node_modules/@vitejs/plugin-react/dist/index.js";
import { crx } from "file:///C:/Users/ticaa/Desktop/workspace/betterhub/node_modules/.pnpm/@crxjs+vite-plugin@2.2.1/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// src/manifest.ts
import { defineManifest } from "file:///C:/Users/ticaa/Desktop/workspace/betterhub/node_modules/.pnpm/@crxjs+vite-plugin@2.2.1/node_modules/@crxjs/vite-plugin/dist/index.mjs";
var manifest_default = defineManifest({
  manifest_version: 3,
  name: "BetterHub",
  version: "1.0.0",
  description: "GitHub customization extension with feature-based architecture",
  permissions: ["storage", "tabs"],
  host_permissions: ["https://github.com/*"],
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: ["https://github.com/*"],
      js: ["src/content/github.ts"],
      run_at: "document_end"
    }
  ],
  action: {
    default_popup: "src/popup/popup.html",
    default_icon: {
      16: "public/icon-16.png",
      32: "public/icon-32.png",
      48: "public/icon-48.png",
      128: "public/icon-128.png"
    }
  },
  icons: {
    16: "public/icon-16.png",
    32: "public/icon-32.png",
    48: "public/icon-48.png",
    128: "public/icon-128.png"
  },
  options_page: "src/options/options.html",
  web_accessible_resources: [
    {
      resources: ["src/styles/*.css"],
      matches: ["https://github.com/*"]
    }
  ]
});

// vite.config.ts
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\ticaa\\Desktop\\workspace\\betterhub";
var vite_config_default = defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic"
    }),
    crx({
      manifest: manifest_default,
      contentScripts: {
        injectCss: true
      }
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src"),
      "@/shared": resolve(__vite_injected_original_dirname, "./src/shared"),
      "@/features": resolve(__vite_injected_original_dirname, "./src/features")
    },
    dedupe: ["react", "react-dom"],
    // Ensure React's internal scheduler is resolved correctly
    conditions: ["import", "module", "browser", "default"]
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: []
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      input: {
        popup: resolve(__vite_injected_original_dirname, "src/popup/popup.html"),
        options: resolve(__vite_injected_original_dirname, "src/options/options.html"),
        standalone: resolve(__vite_injected_original_dirname, "debug/index.html")
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react/jsx") || id.includes("node_modules/scheduler/") || id.includes("node_modules/react-i18next/")) {
            return "react-vendor";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        // Ensure proper chunk loading order
        chunkFileNames: "assets/[name]-[hash].js"
      }
    }
  },
  server: {
    port: 5173,
    open: "/debug/index.html"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdGljYWFcXFxcRGVza3RvcFxcXFx3b3Jrc3BhY2VcXFxcYmV0dGVyaHViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx0aWNhYVxcXFxEZXNrdG9wXFxcXHdvcmtzcGFjZVxcXFxiZXR0ZXJodWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3RpY2FhL0Rlc2t0b3Avd29ya3NwYWNlL2JldHRlcmh1Yi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nO1xyXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9zcmMvbWFuaWZlc3QnO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KHtcclxuICAgICAganN4UnVudGltZTogJ2F1dG9tYXRpYycsXHJcbiAgICB9KSxcclxuICAgIGNyeCh7IFxyXG4gICAgICBtYW5pZmVzdCxcclxuICAgICAgY29udGVudFNjcmlwdHM6IHtcclxuICAgICAgICBpbmplY3RDc3M6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG4gICAgICAnQC9zaGFyZWQnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3NoYXJlZCcpLFxyXG4gICAgICAnQC9mZWF0dXJlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvZmVhdHVyZXMnKSxcclxuICAgIH0sXHJcbiAgICBkZWR1cGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXHJcbiAgICAvLyBFbnN1cmUgUmVhY3QncyBpbnRlcm5hbCBzY2hlZHVsZXIgaXMgcmVzb2x2ZWQgY29ycmVjdGx5XHJcbiAgICBjb25kaXRpb25zOiBbJ2ltcG9ydCcsICdtb2R1bGUnLCAnYnJvd3NlcicsICdkZWZhdWx0J10sXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXHJcbiAgICBleGNsdWRlOiBbXSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgY29tbW9uanNPcHRpb25zOiB7XHJcbiAgICAgIGluY2x1ZGU6IFsvbm9kZV9tb2R1bGVzL10sXHJcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICBwb3B1cDogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcG9wdXAvcG9wdXAuaHRtbCcpLFxyXG4gICAgICAgIG9wdGlvbnM6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL29wdGlvbnMvb3B0aW9ucy5odG1sJyksXHJcbiAgICAgICAgc3RhbmRhbG9uZTogcmVzb2x2ZShfX2Rpcm5hbWUsICdkZWJ1Zy9pbmRleC5odG1sJyksXHJcbiAgICAgIH0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XHJcbiAgICAgICAgICAvLyBCdW5kbGUgUmVhY3QsIFJlYWN0LURPTSwgc2NoZWR1bGVyLCBhbmQgcmVhY3QtaTE4bmV4dCB0b2dldGhlclxyXG4gICAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYW5kIGVuc3VyZXMgc2NoZWR1bGVyIGlzIGF2YWlsYWJsZVxyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LycpIHx8IFxyXG4gICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LWRvbS8nKSB8fFxyXG4gICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0L2pzeCcpIHx8XHJcbiAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvc2NoZWR1bGVyLycpIHx8XHJcbiAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3QtaTE4bmV4dC8nKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncmVhY3QtdmVuZG9yJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIEJ1bmRsZSBvdGhlciB2ZW5kb3IgZGVwZW5kZW5jaWVzXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEVuc3VyZSBwcm9wZXIgY2h1bmsgbG9hZGluZyBvcmRlclxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIG9wZW46ICcvZGVidWcvaW5kZXguaHRtbCcsXHJcbiAgfSxcclxufSk7XHJcblxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHRpY2FhXFxcXERlc2t0b3BcXFxcd29ya3NwYWNlXFxcXGJldHRlcmh1YlxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHRpY2FhXFxcXERlc2t0b3BcXFxcd29ya3NwYWNlXFxcXGJldHRlcmh1YlxcXFxzcmNcXFxcbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3RpY2FhL0Rlc2t0b3Avd29ya3NwYWNlL2JldHRlcmh1Yi9zcmMvbWFuaWZlc3QudHNcIjtpbXBvcnQgeyBkZWZpbmVNYW5pZmVzdCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVNYW5pZmVzdCh7XHJcbiAgbWFuaWZlc3RfdmVyc2lvbjogMyxcclxuICBuYW1lOiAnQmV0dGVySHViJyxcclxuICB2ZXJzaW9uOiAnMS4wLjAnLFxyXG4gIGRlc2NyaXB0aW9uOiAnR2l0SHViIGN1c3RvbWl6YXRpb24gZXh0ZW5zaW9uIHdpdGggZmVhdHVyZS1iYXNlZCBhcmNoaXRlY3R1cmUnLFxyXG4gIHBlcm1pc3Npb25zOiBbJ3N0b3JhZ2UnLCAndGFicyddLFxyXG4gIGhvc3RfcGVybWlzc2lvbnM6IFsnaHR0cHM6Ly9naXRodWIuY29tLyonXSxcclxuICBiYWNrZ3JvdW5kOiB7XHJcbiAgICBzZXJ2aWNlX3dvcmtlcjogJ3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2Utd29ya2VyLnRzJyxcclxuICAgIHR5cGU6ICdtb2R1bGUnLFxyXG4gIH0sXHJcbiAgY29udGVudF9zY3JpcHRzOiBbXHJcbiAgICB7XHJcbiAgICAgIG1hdGNoZXM6IFsnaHR0cHM6Ly9naXRodWIuY29tLyonXSxcclxuICAgICAganM6IFsnc3JjL2NvbnRlbnQvZ2l0aHViLnRzJ10sXHJcbiAgICAgIHJ1bl9hdDogJ2RvY3VtZW50X2VuZCcsXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgYWN0aW9uOiB7XHJcbiAgICBkZWZhdWx0X3BvcHVwOiAnc3JjL3BvcHVwL3BvcHVwLmh0bWwnLFxyXG4gICAgZGVmYXVsdF9pY29uOiB7XHJcbiAgICAgIDE2OiAncHVibGljL2ljb24tMTYucG5nJyxcclxuICAgICAgMzI6ICdwdWJsaWMvaWNvbi0zMi5wbmcnLFxyXG4gICAgICA0ODogJ3B1YmxpYy9pY29uLTQ4LnBuZycsXHJcbiAgICAgIDEyODogJ3B1YmxpYy9pY29uLTEyOC5wbmcnLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGljb25zOiB7XHJcbiAgICAxNjogJ3B1YmxpYy9pY29uLTE2LnBuZycsXHJcbiAgICAzMjogJ3B1YmxpYy9pY29uLTMyLnBuZycsXHJcbiAgICA0ODogJ3B1YmxpYy9pY29uLTQ4LnBuZycsXHJcbiAgICAxMjg6ICdwdWJsaWMvaWNvbi0xMjgucG5nJyxcclxuICB9LFxyXG4gIG9wdGlvbnNfcGFnZTogJ3NyYy9vcHRpb25zL29wdGlvbnMuaHRtbCcsXHJcbiAgd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbXHJcbiAgICB7XHJcbiAgICAgIHJlc291cmNlczogWydzcmMvc3R5bGVzLyouY3NzJ10sXHJcbiAgICAgIG1hdGNoZXM6IFsnaHR0cHM6Ly9naXRodWIuY29tLyonXSxcclxuICAgIH0sXHJcbiAgXSxcclxufSk7XHJcblxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRULFNBQVMsb0JBQW9CO0FBQ3pWLE9BQU8sV0FBVztBQUNsQixTQUFTLFdBQVc7OztBQ0ZnVCxTQUFTLHNCQUFzQjtBQUVuVyxJQUFPLG1CQUFRLGVBQWU7QUFBQSxFQUM1QixrQkFBa0I7QUFBQSxFQUNsQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsRUFDVCxhQUFhO0FBQUEsRUFDYixhQUFhLENBQUMsV0FBVyxNQUFNO0FBQUEsRUFDL0Isa0JBQWtCLENBQUMsc0JBQXNCO0FBQUEsRUFDekMsWUFBWTtBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsSUFDaEIsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLGlCQUFpQjtBQUFBLElBQ2Y7QUFBQSxNQUNFLFNBQVMsQ0FBQyxzQkFBc0I7QUFBQSxNQUNoQyxJQUFJLENBQUMsdUJBQXVCO0FBQUEsTUFDNUIsUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlO0FBQUEsSUFDZixjQUFjO0FBQUEsTUFDWixJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsTUFDSixLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLEtBQUs7QUFBQSxFQUNQO0FBQUEsRUFDQSxjQUFjO0FBQUEsRUFDZCwwQkFBMEI7QUFBQSxJQUN4QjtBQUFBLE1BQ0UsV0FBVyxDQUFDLGtCQUFrQjtBQUFBLE1BQzlCLFNBQVMsQ0FBQyxzQkFBc0I7QUFBQSxJQUNsQztBQUFBLEVBQ0Y7QUFDRixDQUFDOzs7QUR0Q0QsU0FBUyxlQUFlO0FBSnhCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFlBQVk7QUFBQSxJQUNkLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNGO0FBQUEsTUFDQSxnQkFBZ0I7QUFBQSxRQUNkLFdBQVc7QUFBQSxNQUNiO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUMvQixZQUFZLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQzdDLGNBQWMsUUFBUSxrQ0FBVyxnQkFBZ0I7QUFBQSxJQUNuRDtBQUFBLElBQ0EsUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBO0FBQUEsSUFFN0IsWUFBWSxDQUFDLFVBQVUsVUFBVSxXQUFXLFNBQVM7QUFBQSxFQUN2RDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFNBQVMsV0FBVztBQUFBLElBQzlCLFNBQVMsQ0FBQztBQUFBLEVBQ1o7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGlCQUFpQjtBQUFBLE1BQ2YsU0FBUyxDQUFDLGNBQWM7QUFBQSxNQUN4Qix5QkFBeUI7QUFBQSxJQUMzQjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsT0FBTyxRQUFRLGtDQUFXLHNCQUFzQjtBQUFBLFFBQ2hELFNBQVMsUUFBUSxrQ0FBVywwQkFBMEI7QUFBQSxRQUN0RCxZQUFZLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsTUFDbkQ7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGNBQWMsQ0FBQyxPQUFPO0FBR3BCLGNBQ0UsR0FBRyxTQUFTLHFCQUFxQixLQUNqQyxHQUFHLFNBQVMseUJBQXlCLEtBQ3JDLEdBQUcsU0FBUyx3QkFBd0IsS0FDcEMsR0FBRyxTQUFTLHlCQUF5QixLQUNyQyxHQUFHLFNBQVMsNkJBQTZCLEdBQ3pDO0FBQ0EsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQTtBQUFBLFFBRUEsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
