# AGENTS.md - PyTorch Internal Lecture Presentation Guide

## Project Overview

This project is a presentation system for a Korean-language lecture series on PyTorch internals, built with **Astro + MDX**. The lectures are from "모두의 연구소 PyTorch + NPU랩" and cover PyTorch internals from fundamentals to advanced hardware topics.

- **Framework**: Astro 5.x with MDX, Tailwind CSS v4
- **Language**: Korean (한국어) with English technical terms preserved as-is
- **Source material**: 7 PPTX lecture files in `lecture_files/` (git-ignored)
- **Target**: One `.mdx` file per lecture in `src/content/lectures/`, served as interactive slide decks

## Lecture Series Structure

### Part 1: PyTorch Internal 기초 (Fundamentals, Weeks 1-4)

| Week | File | Title | Slides |
|------|------|-------|--------|
| 1 | `01-technical-background.mdx` | Pytorch의 기술적인 배경 | 24 |
| 2 | `02-eager-mode.mdx` | Pytorch Eager Mode | 76 |
| 3 | `03-graph-mode.mdx` | Pytorch Graph Mode | 31 |
| 4 | `04-automatic-differentiation.mdx` | Automatic Differentiation in Pytorch | 36 |

### Part 2: PyTorch Internal 심화 (Advanced, Weeks 5-8)

| Week | File | Title | Slides |
|------|------|-------|--------|
| 5 | `05-distributed-programming.mdx` | Distributed Programming in Pytorch | 38 |
| 6 | `06-beyond-pytorch.mdx` | Beyond Pytorch: Custom Kernel과 vLLM | 48 |
| 7 | `07-cpu-gpu-npu.mdx` | CPU / GPU / NPU | 57 |

**Total: 310 slides across 7 lectures**

## Architecture

### Astro Components (`src/components/`)

| Component | Purpose | Props |
|-----------|---------|-------|
| `Slide.astro` | Slide container | `layout`: `default` / `cover` / `center`; `class`: additional CSS |
| `Reveal.astro` | Progressive disclosure (click-to-reveal) | `items`: `true` (reveal children one-by-one) / `false` (reveal whole block) |
| `ThemeImage.astro` | Light/dark pair of `<img>` SVG figures | `lightSrc`, `darkSrc`, `alt`, `class` |
| Figure widgets (`BackpropWidget`, `KvCacheWidget`, `SelfAttentionDiagram`, ...) | Interactive or math-labeled figures; follow "Figure and Widget Style" | none |

### Slide Engine (`src/scripts/slide-engine.js`)

Vanilla JS navigation system:
- **Keyboard**: ←→ arrows, Space, PageUp/Down, Home/End, Escape (back to index)
- **Progressive reveal**: `<Reveal>` children shown one at a time before advancing
- **URL hash**: `#slide-N` for direct access (1-indexed)
- **Touch**: Swipe left/right for mobile navigation
- **Counter**: Shows `current / total` in bottom-right nav bar

### Content Collections (`src/content.config.ts`)

Schema: `title` (string), `date` (string), `lecture` (number)

### Plugins

- **remark-math** + **rehype-katex**: LaTeX math rendering
- **Shiki** (one-dark-pro): Code syntax highlighting
- **Tailwind CSS v4**: Utility-first styling

## MDX Slide Format

Each lecture MDX file follows this pattern:

```mdx
---
title: "Lecture Title"
date: "YYYY-MM-DD"
lecture: N
---

import Slide from '../../components/Slide.astro';
import Reveal from '../../components/Reveal.astro';
import ThemeImage from '../../components/ThemeImage.astro';

<Slide layout="cover">
# Week N: Title
Pytorch + NPU 온라인 모임 #N | YYYY-MM-DD
</Slide>

<Slide>
## Content Slide
Regular markdown content with Tailwind CSS classes.

<Reveal>
- Item revealed on first click
- Item revealed on second click
</Reveal>
</Slide>

<Slide>
## Diagram

<ThemeImage lightSrc="/images/0N/name-light.svg" darkSrc="/images/0N/name-dark.svg" alt="..." class="mx-auto w-full max-w-[680px]" />
</Slide>

<Slide layout="center">
## Thank You!
</Slide>
```

### Diagrams

Draw every diagram as a light/dark SVG pair under `public/images/NN/`
and embed it with `ThemeImage`, following "Figure and Widget Style"
below. The site does not use Mermaid: all former Mermaid diagrams
were redrawn as SVG so that they share the palette, the font stack and
right-angle connectors.

### Figure and Widget Style

All SVG figures in `public/images/NN/` and all interactive widgets in
`src/components/` use one palette and one font stack. SVG figures load
through `<img>`, so they cannot read CSS variables or web fonts: write
the hex values and the system font stack below directly. Widgets read
the same values from the `--fig-*` variables in `src/styles/global.css`.

Fonts:

| Role | Stack |
|------|-------|
| Sans (labels, prose) | `'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', system-ui, -apple-system, sans-serif` |
| Mono (code identifiers only) | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |

Widgets inherit the page font (`font-family: inherit`) and use
`var(--fig-font-mono)` for code.

Palette (light / dark). Pick the color by meaning, not by look:

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `text` | `#2C2C2A` | `#D3D1C7` | Main labels |
| `text-2` | `#5F5E5A` | `#B4B2A9` | Secondary labels, arrows |
| `line` | `#888780` | `#888780` | Box borders, grid |
| `line-soft` | `#B4B2A9` | `#6F6E68` | Faint borders, dividers |
| `fill` | `#F1EFE8` | `#444441` | Neutral box fill |
| `surface` | `#FFFFFF` | `#1F1E1B` | Box fill on a filled panel |
| `blue` | `#378ADD` | `#85B7EB` | Data flow, forward pass, active item |
| `blue-ink` | `#185FA5` | `#85B7EB` | Blue text, strong blue stroke |
| `blue-tint` | `#DCEBFA` | `#2A3A4D` | Blue box fill |
| `amber` | `#EF9F27` | `#FAC775` | Highlight, cache, attention |
| `amber-ink` | `#854F0B` | `#FAC775` | Amber text |
| `amber-tint` | `#FAEEDA` | `#4A3A22` | Amber box fill |
| `coral` | `#D85A30` | `#F0997B` | Gradient, backward pass, recompute |
| `coral-tint` | `#FBE3D6` | `#4A2E22` | Coral box fill |
| `teal` | `#1D9E75` | `#5DCAA5` | Done, enabled, reused |
| `teal-ink` | `#0F6E56` | `#5DCAA5` | Teal text |
| `teal-tint` | `#E1F5EE` | `#233B34` | Teal box fill |
| `purple` | `#534AB7` | `#AFA9EC` | Compiler stage, local term, special step |
| `purple-ink` | `#3C3489` | `#AFA9EC` | Purple text |
| `purple-tint` | `#EEEDFE` | `#332D4D` | Purple box fill |
| `red` | `#C0392B` | `#E07A6A` | Error, hazard, stall |
| `red-tint` | `#F3D9D9` | `#4A2A2A` | Red box fill |

Do not use the site accent (`--accent`, purple/cyan) in figures.

Highlight with a tint fill, an ink text color and a border of the same
hue (for example `blue-tint` / `blue-ink` / `blue`). Do not use a solid
saturated fill with white text: in dark mode the fill token turns light
and the box stands out too much. This also applies to badges and cards
written in MDX, which use `var(--fig-*)` in a `style` attribute.

A figure with math labels ($q_1$, $\alpha_j$) cannot be an `<img>` SVG,
because KaTeX does not run inside it. Build it as an Astro component
with an inline SVG and KaTeX HTML labels placed over it in viewBox
percentages, as `BackpropWidget.astro` and `SelfAttentionDiagram.astro`
do.

Sizes: the page content is 882px wide and body text is 16px. Show an
SVG figure at its viewBox width (`class="mx-auto w-full max-w-[<W>px]"`
on `ThemeImage`) and keep the viewBox width at 900 or less, so a
`font-size` of 12 to 14 renders at 12 to 14px. A label that renders
below 10px is too small on a projector.

Widget controls use the shared `.fig-btn` class (bordered style) and
Korean labels with SVG icons: `재생` / `일시정지`, `이전`, `다음`
(`완료` on the last step), `처음으로` (icon only, with that
`aria-label`). The step counter reads `스텝 n / N`.

### MDX Gotchas

- **Curly braces**: `{` and `}` in plain text must be escaped as `\{` and `\}` (MDX treats them as JSX)
- **Self-closing tags**: Use `<br />` and `<img ... />` (not `<br>` or `<img>`)
- **HTML + Markdown**: Ensure blank lines between `<div>` tags and markdown content
- **Math**: `$...$` inline and `$$...$$` display math work via remark-math

## File Organization

```
pytorch-internal-lecture/
├── src/
│   ├── content/
│   │   └── lectures/          # 7 MDX lecture files
│   ├── components/            # Slide, Reveal, ThemeImage and figure components
│   ├── layouts/               # LectureLayout.astro
│   ├── pages/
│   │   ├── index.astro        # Lecture listing page
│   │   └── lectures/
│   │       └── [...slug].astro # Dynamic lecture routes
│   ├── scripts/
│   │   └── slide-engine.js    # Vanilla JS slide navigation
│   ├── styles/
│   │   └── global.css         # Tailwind v4 + slide styles
│   └── content.config.ts      # Content Collection schema
├── public/
│   └── images/01~07/          # 232 lecture images
├── scripts/
│   ├── extract_pptx.py           # PPTX content extractor
│   └── extract_images.py         # PPTX image extractor
├── slides/                    # Original Slidev source (reference)
├── astro.config.mjs
├── package.json
└── AGENTS.md
```

## Development

```bash
bun install         # Install dependencies
bun run dev         # Start dev server (localhost:4321)
bun run build       # Build static site to dist/
bun run preview     # Preview production build
```
