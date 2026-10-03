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
| `Mermaid.astro` | Mermaid diagram rendering (client-side) | `scale`: number (default 1.0); `wide`: boolean (default false, removes max-width 60% constraint) |

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
- **mermaid.js**: Client-side diagram rendering
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
import Mermaid from '../../components/Mermaid.astro';

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
## Mermaid Diagram

<Mermaid scale={0.7}>
{`graph LR
    A --> B --> C`}
</Mermaid>
</Slide>

<Slide layout="center">
## Thank You!
</Slide>
```

### Mermaid Diagram Color Rules

Mermaid diagrams support **automatic light/dark mode switching** — SVGs re-render on theme toggle without page reload (via `MutationObserver`).

**CSS theme overrides** (`src/styles/global.css`):

| Element | Light mode | Dark mode |
|---------|-----------|-----------|
| Node background | `#f0f0f0` (light gray) | `#2d2d3d` (dark gray) |
| Node border | `#999` | `#666` |
| Text (all SVG text) | `#222` (dark) | `#e0e0e0` (light) |
| Lines / arrows | `#333`, 2px | `#ccc`, 2px |
| Edge label background | `rgba(255,255,255,0.85)` | `rgba(30,30,46,0.85)` |
| Note background | `#fff8dc` (cream) | `#3a3520` (dark olive) |
| Cluster/subgraph fill | (default) | `#252535` |
| Sequence diagram lines | `#666` | `#888` |

**Guidelines**:

- Default SVG max-width is **60%** of container, centered via `margin: 0 auto`
- Use `<Mermaid wide>` to remove max-width constraint for wide diagrams (e.g., trees with many branches)
- Mermaid `style` directives in diagram code (e.g., `style hw fill:#3a7bd5,color:#fff`) are **not** overridden by CSS — use them for accent colors on specific nodes
- Do NOT use Mermaid `mindmap` for hierarchical data — use `flowchart TD` instead (mindmap renders horizontally and becomes unreadable at constrained widths)
- CSS targets `.label-container path` for node backgrounds (not just `.node rect`) because Mermaid v11 uses `<path>` elements

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

Sizes: keep the SVG `viewBox` width between 640 and 900 so that a
`font-size` of 12 to 14 reads at body size. Text smaller than 10 is
too small on a projector.

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
│   ├── components/            # Slide, Reveal, Mermaid components
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
│   ├── convert_slidev_to_mdx.py  # Slidev→MDX converter
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

## Conversion Script

To re-convert Slidev sources to MDX:

```bash
uv run --script scripts/convert_slidev_to_mdx.py slides/ src/content/lectures/
```

The script handles: slide separation, v-clicks→Reveal, mermaid blocks, speaker note removal, curly brace escaping, self-closing tags, and code line highlighting conversion.
