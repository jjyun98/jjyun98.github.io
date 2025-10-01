# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with AstroPaper, an Astro-based static site generator. The site is deployed to GitHub Pages at https://jjyun98.github.io.

**Tech Stack:**
- Framework: Astro 5.x
- Styling: TailwindCSS 4.x
- Type Checking: TypeScript
- Search: Pagefind
- Package Manager: pnpm

## Common Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm run dev              # Start dev server at localhost:4321
pnpm run sync             # Generate TypeScript types for Astro modules

# Build & Preview
pnpm run build            # Run type check, build site, generate search index, copy pagefind to public/
pnpm run preview          # Preview production build locally

# Code Quality
pnpm run lint             # Lint with ESLint
pnpm run format           # Format code with Prettier
pnpm run format:check     # Check code formatting
```

## Architecture

### Blog Content System

Blog posts are stored as Markdown files in `src/data/blog/`, organized by topic subdirectories (e.g., `datascience_for_r/`, `kaggle/`, `시계열분석/`, etc.). Posts are loaded using Astro's content collections:

- **Content Collection**: Defined in `src/content.config.ts`
- **Loader**: Uses glob pattern `**/[^_]*.md` to load all markdown files except those starting with `_`
- **Schema**: Each post requires frontmatter with `title`, `description`, `pubDatetime`, and optional fields like `tags`, `featured`, `draft`, `modDatetime`

### LaTeX Support

The blog has full LaTeX/mathematical notation support configured through:
- `remark-math` plugin for parsing LaTeX syntax
- `rehype-katex` plugin for rendering KaTeX output
- Configured in `astro.config.ts` markdown options

### Site Configuration

- **Main config**: `src/config.ts` - Contains `SITE` object with website metadata, author info, pagination settings, timezone
- **Constants**: `src/constants.ts` - Additional site-wide constants
- **Path aliases**: TypeScript configured with `@/*` alias pointing to `src/*` (in `tsconfig.json`)

### Page Structure

- **Dynamic routes**: Post detail pages use `src/pages/posts/[slug].astro` pattern
- **Static pages**: About, search, archives pages in `src/pages/`
- **Tag system**: Dynamic tag pages in `src/pages/tags/`
- **OG Images**: Dynamic OpenGraph images generated in `src/pages/og.png.ts`

### Components & Utilities

- **Components**: Reusable Astro components in `src/components/` (Header, Footer, Card, etc.)
- **Layouts**: Page layouts in `src/layouts/`
- **Utils**: Helper functions in `src/utils/` for post filtering, sorting, tag extraction, OG image generation

### Search Functionality

The build process generates a Pagefind search index:
1. Site is built to `dist/`
2. `pagefind --site dist` generates search index
3. Index is copied from `dist/pagefind` to `public/pagefind`
4. Search UI is available at `/search`

### Code Syntax Highlighting

Uses Shiki with Dracula Soft theme for both light and dark modes (configured in `astro.config.ts`).

## Development Notes

- The site uses experimental Astro features: responsive images, SVG support, and script order preservation
- Images use experimental responsive layout by default
- Build process includes Astro type checking before compilation
- GitHub Actions CI runs lint, format check, and build on pull requests
