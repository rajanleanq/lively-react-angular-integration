import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isIntegration = mode === "integration";

  const baseConfig = {
    plugins: [
      react({
        jsxRuntime: "automatic",
      }),
    ],
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        isIntegration ? "production" : mode
      ),
    },
  };

  if (isIntegration) {
    return {
      ...baseConfig,
      build: {
        outDir: "copy-angular-output/dist",
        lib: {
          entry: "src/mounts/lunchDashboard.mount.tsx",
          name: "LunchDashboard",
          fileName: "lunch-dashboard",
          formats: ["umd"],
        },
        minify: true,
        rollupOptions: {
          external: ["react", "react-dom"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
        },
      },
    };
  }

  return baseConfig;
});
