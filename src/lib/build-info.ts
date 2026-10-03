import { execSync } from 'node:child_process';

const REPO_URL = 'https://github.com/appleparan/pytorch-internal-lecture';
const SHORT_SHA_LENGTH = 7;

/** Runs a git command at build time; returns '' when git or the repo is unavailable. */
function git(args: string): string {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

/** `v2.0.0` stays as is; `v2.0.0-3-gabc1234` (3 commits after the tag) becomes `v2.0.0+3`. */
export function formatVersion(describe: string): string {
  if (!describe) return 'dev';
  const match = describe.match(/^(.+)-(\d+)-g[0-9a-f]+$/);
  return match ? `${match[1]}+${match[2]}` : describe;
}

/** Build date as YYYY-MM-DD in Korea time, where the lectures are maintained. */
export function formatBuildDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

const commit = process.env.GITHUB_SHA || git('rev-parse HEAD');

export const buildInfo = {
  version: formatVersion(git("describe --tags --match 'v*'")),
  commit: commit.slice(0, SHORT_SHA_LENGTH),
  commitUrl: commit ? `${REPO_URL}/commit/${commit}` : REPO_URL,
  buildDate: formatBuildDate(new Date()),
} as const;
