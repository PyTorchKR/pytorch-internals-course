# PyTorch Internal Lecture

PyTorch 내부 구조를 다루는 7회 강의 자료 사이트입니다. 모두의 연구소 PyTorch + NPU랩에서 진행한 강의를 글로 옮겼습니다.

사이트: <https://pytorch.liam.kim/>

## Lectures

| # | 제목 | 날짜 |
|---|------|------|
| 01 | [PyTorch의 기술적인 배경](https://pytorch.liam.kim/lectures/01-technical-background/) | 2024-12-04 |
| 02 | [PyTorch Eager Mode](https://pytorch.liam.kim/lectures/02-eager-mode/) | 2024-12-11 |
| 03 | [PyTorch Graph Mode](https://pytorch.liam.kim/lectures/03-graph-mode/) | 2024-12-18 |
| 04 | [Automatic Differentiation in PyTorch](https://pytorch.liam.kim/lectures/04-automatic-differentiation/) | 2025-01-08 |
| 05 | [Distributed Programming in PyTorch](https://pytorch.liam.kim/lectures/05-distributed-programming/) | 2025-01-15 |
| 06 | [Beyond PyTorch: Custom Kernel과 vLLM](https://pytorch.liam.kim/lectures/06-beyond-pytorch/) | 2025-02-05 |
| 07 | [CPU / GPU / NPU](https://pytorch.liam.kim/lectures/07-cpu-gpu-npu/) | 2025-02-12 |

본문의 PyTorch 소스 인용은 `v2.14.0` 태그 기준입니다.

## Getting Started

[Bun](https://bun.sh/) 1.4 이상이 필요합니다. CI는 1.4.2를 씁니다.

```bash
bun install --frozen-lockfile
bun run dev
```

<http://localhost:4321>에서 확인할 수 있습니다.

`bun install`은 커밋된 `bun.lock`에 적힌 버전을 설치하고, 최신 버전을 받지 않습니다. 다만 `package.json`과 `bun.lock`이 어긋나면 `bun install`은 lockfile을 조용히 고쳐 씁니다. `--frozen-lockfile`을 붙이면 이때 설치를 멈추고 에러를 냅니다. 의존성을 올릴 때만 `bun update <package>`를 쓰고, 바뀐 `bun.lock`을 함께 커밋합니다.

## Commands

| 명령 | 하는 일 |
|------|---------|
| `bun run dev` | 개발 서버 (localhost:4321) |
| `bun run build` | `dist/`에 정적 사이트 빌드. 커밋 전에 통과해야 합니다 |
| `bun run preview` | 빌드 결과 미리보기 |
| `bun run test` | vitest 단일 실행 |

## Structure

| 경로 | 내용 |
|------|------|
| `src/content/lectures/NN-*.mdx` | 강의 본문. 강의 하나가 MDX 파일 하나입니다 |
| `public/images/NN/` | 강의별 그림. SVG는 `-light`/`-dark` 쌍으로 둡니다 |
| `src/components/` | 수식 라벨이 있는 그림과 인터랙티브 위젯 (Astro) |
| `src/styles/global.css` | 사이트 테마와 그림 색상 토큰(`--fig-*`) |
| `tests/` | vitest 테스트 |

본문 작성 규칙, MDX 주의 사항, 그림 스타일(색상 토큰, 폰트, 크기)은 [AGENTS.md](AGENTS.md)에 있습니다.

## Deploy

`main`에 push하면 GitHub Actions([deploy.yml](.github/workflows/deploy.yml))가 사이트를 빌드해 GitHub Pages에 배포합니다.

## Tech Stack

- [Astro](https://astro.build/) 7 + MDX
- [Tailwind CSS](https://tailwindcss.com/) v4
- [KaTeX](https://katex.org/) (remark-math + rehype-katex, `unified` processor)
- [Bun](https://bun.sh/) (패키지 매니저, 런타임)
