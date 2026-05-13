#!/usr/bin/env bash
# Bump the "last updated" date (and optionally the code count) across the
# Governance Error Register surfaces. Run this whenever you publish a new code.
#
# What it touches:
#   - src/pages/research/governance-error-register.astro
#       * JSON-LD `dateModified` (ISO timestamp)
#       * <meta name="dc.date.modified"> (ISO date)
#       * Visible "Last updated · N codes documented" line
#   - public/research/governance-error-register.md
#       * "Last updated:" line
#
# Usage:
#   scripts/bump-ger-date.sh                # today's date, code count unchanged
#   scripts/bump-ger-date.sh --codes 27     # today's date, set count to 27
#   scripts/bump-ger-date.sh --date 2026-05-20 --codes 28
#
# Notes:
#   - Run from anywhere; resolves repo root via the script's location.
#   - Idempotent — running twice with the same args is a no-op.
#   - Stages the changes. Doesn't commit; review with `git diff` then commit.

set -e

# Resolve repo root from script location
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

ASTRO="$REPO_ROOT/src/pages/research/governance-error-register.astro"
MD="$REPO_ROOT/public/research/governance-error-register.md"

# Defaults
DATE_ISO="$(date +%Y-%m-%d)"
CODES=""

# Parse args
while [ $# -gt 0 ]; do
  case "$1" in
    --date)   DATE_ISO="$2"; shift 2 ;;
    --codes)  CODES="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

# Validate ISO date (YYYY-MM-DD)
if ! [[ "$DATE_ISO" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "✗ --date must be YYYY-MM-DD (got: $DATE_ISO)" >&2
  exit 1
fi

# Validate code count if provided
if [ -n "$CODES" ] && ! [[ "$CODES" =~ ^[0-9]+$ ]]; then
  echo "✗ --codes must be an integer (got: $CODES)" >&2
  exit 1
fi

# Build human-readable date: "May 13, 2026" (portable across macOS/Linux)
DATE_HUMAN="$(python3 -c "from datetime import datetime; print(datetime.strptime('$DATE_ISO','%Y-%m-%d').strftime('%B %-d, %Y'))" 2>/dev/null \
  || python3 -c "from datetime import datetime; print(datetime.strptime('$DATE_ISO','%Y-%m-%d').strftime('%B %d, %Y').replace(' 0',' '))")"

# Check files exist
for f in "$ASTRO" "$MD"; do
  [ -f "$f" ] || { echo "✗ not found: $f" >&2; exit 1; }
done

# Use python for safe in-place edits (sed -i is non-portable for these patterns)
python3 - "$ASTRO" "$MD" "$DATE_ISO" "$DATE_HUMAN" "$CODES" <<'PY'
import re, sys, pathlib

astro_path, md_path, date_iso, date_human, codes = sys.argv[1:6]

# Determine "N codes" string: if --codes was passed, use it; otherwise preserve
# whatever count is already on the page.
def codes_phrase(text, default_codes):
    m = re.search(r'(\d+)\s+codes documented', text)
    n = default_codes if default_codes else (m.group(1) if m else None)
    if not n:
        print('✗ could not infer code count and --codes not provided', file=sys.stderr)
        sys.exit(1)
    return f'{n} codes documented'

# --- Astro page ---
astro = pathlib.Path(astro_path).read_text()
codes_str = codes_phrase(astro, codes)

# JSON-LD dateModified: "dateModified: \"2026-05-13T00:00:00Z\","
astro = re.sub(
    r'dateModified:\s*"[0-9T:\-Z]+"',
    f'dateModified: "{date_iso}T00:00:00Z"',
    astro,
)

# <meta name="dc.date.modified" content="..." />
astro = re.sub(
    r'(<meta\s+name="dc\.date\.modified"\s+content=")[^"]+(")',
    rf'\g<1>{date_iso}\g<2>',
    astro,
)

# Visible "Last updated" line: <dd>May 13, 2026 · 26 codes documented</dd>
astro = re.sub(
    r'(<dt>Last updated</dt><dd>)[^<]+(</dd>)',
    rf'\g<1>{date_human} · {codes_str}\g<2>',
    astro,
)

pathlib.Path(astro_path).write_text(astro)

# --- Markdown alternate ---
md = pathlib.Path(md_path).read_text()
md = re.sub(
    r'^\*\*Last updated:\*\*\s+.+$',
    f'**Last updated:** {date_human} · {codes_str}',
    md,
    count=1,
    flags=re.MULTILINE,
)
pathlib.Path(md_path).write_text(md)

print(f'✓ astro: dateModified → {date_iso}, "{date_human} · {codes_str}"')
print(f'✓ md:    "{date_human} · {codes_str}"')
PY

# Stage the changes for review
cd "$REPO_ROOT"
git add "$ASTRO" "$MD" 2>/dev/null || true

echo
echo "Staged. Review with:  git diff --cached -- $(realpath --relative-to="$REPO_ROOT" "$ASTRO" 2>/dev/null || echo "$ASTRO") $(realpath --relative-to="$REPO_ROOT" "$MD" 2>/dev/null || echo "$MD")"
echo "Then commit:           git commit -m \"ger: bump last-updated to $DATE_HUMAN\""
