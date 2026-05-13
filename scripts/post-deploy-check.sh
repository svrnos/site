#!/usr/bin/env bash
# Post-deploy canary for svrnos.com.
# Hits the key URLs, verifies HTTP 200, checks for expected content markers,
# and detects the bug class that shipped today (stray HTML from JSX errors).
#
# Usage:
#   scripts/post-deploy-check.sh                # check live svrnos.com
#   scripts/post-deploy-check.sh --base URL     # check a different deployment (preview, staging)
#   scripts/post-deploy-check.sh --quiet        # only print failures
#
# Exit code:
#   0 = all checks passed
#   non-zero = something failed (count of failures)
#
# Run this after any deploy. Takes ~5 seconds.

set -u

BASE="https://svrnos.com"
QUIET=0
while [ $# -gt 0 ]; do
  case "$1" in
    --base)  BASE="$2"; shift 2 ;;
    --quiet) QUIET=1; shift ;;
    -h|--help)
      sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

# Color codes (skip if not a tty)
if [ -t 1 ]; then
  RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[0;33m'; DIM=$'\033[2m'; RESET=$'\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; DIM=''; RESET=''
fi

PASS=0
FAIL=0
FAILED_URLS=()

# Each entry: path|title-or-heading|optional-must-contain
# title-or-heading: a string that MUST appear in the HTML (typically the article title or H1)
# must-contain: optional additional string check (e.g., a key term, a section heading)
declare -a CHECKS=(
  "/|Sovereign|SVRNOS"
  "/insights|<h1>Insights"
  "/research|<h1>"
  "/research/generation-gap|The Generation Gap"
  "/research/governance-error-register|Governance Error Register|26 codes"
  "/research/non-content-safety-attestation|Non-Content Safety Attestation|DSSE"
  "/insights/dear-zuck-tee-not-the-problem|Dear Zuck|verifiable governance"
  "/insights/the-refusal-that-never-came|Refusal That Never Came|trajectory"
  "/insights/refusal-is-not-a-permanent-state|Refusal Is Not a Permanent State|refusal decay"
  "/insights/detection-is-not-enough|Escalation Path|trajectory"
  "/access|Request Access"
)

# Known bug patterns: HTML structures that should never appear in rendered output.
# These caught today's regression (stray </table><code>).
# Patterns are tuned to catch real leaks without flagging legitimate <script> JSON-LD.
declare -a BUG_PATTERNS=(
  "</table><code>"                # JSX expression leaked into HTML structure
  "</tbody><code>"                # variant of the same
  "<code></h"                     # stray <code> before a heading
  "<p>{\""                        # JSON leaked into a paragraph
  "<li>{\""                       # JSON leaked into a list item
  "<td>{\""                       # JSON leaked into a table cell
  "ReferenceError"                # JS error rendered as text
  "is not defined</"              # error message rendered as text in element
  "Cannot read prop"              # JS error
  "undefined</p>"                 # undefined variable rendered
  "[object Object]"               # JS toString leaked
)

# Helper: fetch a URL, return HTTP code on stderr and body on stdout
fetch() {
  curl -sSL -w "%{http_code}\n" -o /tmp/post-deploy-body.html "$1" 2>/dev/null
}

# Helper: print pass/fail line
check_result() {
  local url="$1" status="$2" detail="$3"
  if [ "$status" = "PASS" ]; then
    PASS=$((PASS+1))
    [ $QUIET -eq 0 ] && printf "  ${GREEN}✓${RESET}  %-65s ${DIM}%s${RESET}\n" "$url" "$detail"
  else
    FAIL=$((FAIL+1))
    FAILED_URLS+=("$url")
    printf "  ${RED}✗${RESET}  %-65s ${RED}%s${RESET}\n" "$url" "$detail"
  fi
}

[ $QUIET -eq 0 ] && echo "Post-deploy check: ${BASE}"
[ $QUIET -eq 0 ] && echo

for entry in "${CHECKS[@]}"; do
  path=$(echo "$entry" | cut -d'|' -f1)
  title=$(echo "$entry" | cut -d'|' -f2)
  must=$(echo "$entry" | cut -d'|' -f3)
  url="${BASE}${path}"

  # Fetch
  http_code=$(fetch "$url" | tail -1)
  body=$(cat /tmp/post-deploy-body.html 2>/dev/null || echo "")

  # Check 1: HTTP 200
  if [ "$http_code" != "200" ]; then
    check_result "$path" "FAIL" "HTTP $http_code"
    continue
  fi

  # Check 2: title/heading present
  if ! echo "$body" | grep -qF -- "$title"; then
    check_result "$path" "FAIL" "missing title marker: \"$title\""
    continue
  fi

  # Check 3: optional must-contain
  if [ -n "$must" ] && ! echo "$body" | grep -qF -- "$must"; then
    check_result "$path" "FAIL" "missing required content: \"$must\""
    continue
  fi

  # Check 4: known-bug pattern scan
  bug_hit=""
  for pattern in "${BUG_PATTERNS[@]}"; do
    if echo "$body" | grep -qF -- "$pattern"; then
      bug_hit="$pattern"
      break
    fi
  done
  if [ -n "$bug_hit" ]; then
    check_result "$path" "FAIL" "bug pattern found: \"$bug_hit\""
    continue
  fi

  # All checks passed
  check_result "$path" "PASS" "HTTP 200 · markers ok"
done

rm -f /tmp/post-deploy-body.html

[ $QUIET -eq 0 ] && echo
if [ $FAIL -eq 0 ]; then
  echo "${GREEN}✓ All ${PASS} checks passed${RESET}"
  exit 0
else
  echo "${RED}✗ ${FAIL} failure(s), ${PASS} passed${RESET}"
  echo "${RED}Failed:${RESET}"
  for url in "${FAILED_URLS[@]}"; do
    echo "  - ${BASE}${url}"
  done
  exit $FAIL
fi
