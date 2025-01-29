import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";  // LaTeX 수식 지원 추가
import rehypeKatex from "rehype-katex"; // LaTeX 렌더링 추가
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: "https://jjyun98.github.io", // GitHub Pages URL
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath, // LaTeX 수식 지원
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    rehypePlugins: [rehypeKatex], // LaTeX 수식 렌더링 추가
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
  experimental: {
    contentLayer: true,
  },
});