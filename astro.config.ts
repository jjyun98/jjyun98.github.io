import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkMath from "remark-math";  // LaTeX 수식 지원 추가
import rehypeKatex from "rehype-katex"; // LaTeX 렌더링 추가
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: 'https://jjyun98.github.io', // 사이트 주소 //
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath, // LaTeX 수식 지원
      remarkToc, [remarkCollapse, { test: "Table of contents" }]
    ],
    rehypePlugins: [rehypeKatex], // LaTeX 수식 렌더링 추가
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "dracula-soft", dark: "dracula-soft" }, // 기본 light: "min-light", dark: "night-owl"
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    // Used for all Markdown images; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
    experimentalLayout: "responsive",
  },
  experimental: {
    svg: true,
    responsiveImages: true,
    preserveScriptOrder: true,
  },
});