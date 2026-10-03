# AGENTS.md

Korean lecture notes on PyTorch internals (모두의 연구소 PyTorch + NPU랩), built with
Astro 6 + MDX and Tailwind CSS v4. Each lecture is one prose article in
`src/content/lectures/NN-*.mdx`; figures live in `public/images/NN/` and
interactive figures in `src/components/`.

## Commands

```bash
bun install
bun run dev      # localhost:4321
bun run build    # must pass before a commit
bun run test     # vitest, single run
```

Use bun, not npm.

## Writing lecture text

- Write Korean prose and keep English technical terms as they are (`token`,
  `dispatcher`, `FX graph`). Do not transliterate them into Hangul.
- State the fact first, in short declarative sentences. Leave out mannered
  phrasing that replaces a plain statement with a flourish, such as "공짜는 아닙니다"
  or "~의 실체". When a literal phrase is available, use it.
- Quote PyTorch source from the pinned tag `v2.14.0`. When a snippet shows
  generated code, reproduce it with real codegen on that tag instead of editing
  it by hand.
- Keep the lecturer's examples and Q&A unless they are wrong. Ask before
  deleting them.

## MDX gotchas

- Escape `{` and `}` in prose as `\{` and `\}`; MDX reads them as JSX.
- Use self-closing tags: `<br />`, `<img ... />`.
- Leave a blank line between an HTML tag such as `<div>` and Markdown inside it.
- Math uses `$...$` and `$$...$$` (remark-math + KaTeX).
- Article prose rules in `src/styles/global.css` live in `@layer base`, so
  Tailwind classes written in MDX override them. Keep new rules for MDX
  content inside a layer; an unlayered rule silently beats every utility.
- Size an image by width (`mx-auto w-full max-w-[<W>px]`), not with `h-*`.
  Show SVGs and rasters up to 882px wide at their own width; cap larger
  rasters so they render at most about 480px tall.
- In an Astro component, a dark-mode rule must be written
  `:global([data-theme='dark']) .x`. A plain `[data-theme='dark'] .x` gets
  scoped and never matches.

## Figures and widgets

All figures and widgets share one palette and one font stack, so a new figure
must look like the existing ones. Good references:
`public/images/07/pipeline_hazard_{light,dark}.svg` and
`src/components/SelfAttentionDiagram.astro`.

### Where a figure goes

- Plain diagram: a light/dark SVG pair
  `public/images/NN/<name>-{light,dark}.svg`, embedded with `ThemeImage` at its
  viewBox width:
  `<ThemeImage lightSrc="..." darkSrc="..." alt="<one Korean sentence>" class="mx-auto w-full max-w-[<W>px]" />`
- Diagram with math labels ($q_1$, $\alpha_j$): an Astro component with an
  inline SVG and KaTeX labels positioned over it in viewBox percentages, because
  KaTeX does not run inside an `<img>` SVG. Copy the approach of
  `SelfAttentionDiagram.astro` or `BackpropWidget.astro`.
- Do not use Mermaid. All former Mermaid diagrams were redrawn as SVG.

### Colors

The palette is the `--fig-*` variables in `src/styles/global.css`
(light values under `:root`, dark values under `[data-theme='dark']`). Widgets
use the variables. SVG figures load through `<img>` and cannot read CSS
variables, so write the token's light hex in the `-light` file and its dark hex
in the `-dark` file. Pick a token by meaning:

| Meaning | Token family |
| --- | --- |
| Text, arrows, borders | `text`, `text-2`, `line`, `line-soft` |
| Neutral box, box on a filled panel | `fill`, `surface` |
| Data flow, forward pass, active item | `blue` |
| Highlight, cache, attention weight | `amber` |
| Gradient, backward pass, recompute | `coral` |
| Done, enabled, reused | `teal` |
| Compiler stage, special step | `purple` |
| Error, hazard, stall | `red` |

Each hue has a base and a `-tint` (fill) variant; blue, amber, teal and purple
also have an `-ink` (text) variant, and coral and red use the base for text.
Highlight a box with tint fill, ink text and a base-color border. Do not use a solid
saturated fill with white text: the fill turns light in dark mode and the box
glares. Do not use the site accent (`--accent`) in figures.

### Fonts

SVG figures cannot load web fonts, so write the system stacks
directly:

- Sans: `'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI',
  system-ui, -apple-system, sans-serif`
- Mono, for code identifiers only: `ui-monospace, SFMono-Regular, Menlo,
  Consolas, monospace`

Widgets use `font-family: inherit` and `var(--fig-font-mono)`.

### Size

The content column is 882px and body text is 16px. Keep the viewBox
width at 900 or less and labels at font-size 12 to 14, so they render at 12 to
14px. Text below 10px is unreadable on a projector.

### Shape

Connectors are right-angle (horizontal and vertical) routes, never
curves or diagonals. Edges into the same target bend at the same x or y,
parallel rails keep one offset, and arrowheads end exactly on box edges. Leave
space between lines and text.

### Widget controls

Use the shared `.fig-btn` class with Korean labels and SVG
icons: `재생` / `일시정지`, `이전`, `다음` (`완료` on the last step), and an icon-only reset
button with `aria-label="처음으로"`. The counter reads `스텝 n / N`. Controls must not
move between steps; give buttons whose label changes a fixed width.

### Check the result

Render every new or changed figure in both themes (light
on white, dark on `#1c1c1d`) and look at it before committing.
