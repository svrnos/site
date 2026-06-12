#!/usr/bin/env bash
# Template-channel lint for the insights collection.
# Structural blocks (sources, related, callout, CTA) live in frontmatter and are
# rendered by InsightArticle.astro. Hand-rolled body sections bypass the template
# and produce inconsistent layout. This gate fails the build when it finds one.
#
# Runs automatically via `npm run build` (prebuild). Exit non-zero = build rejected.

set -u
FAIL=0

for f in src/content/insights/*.md; do
  # body = everything after the closing frontmatter delimiter
  body=$(awk 'c==2{print} /^---$/{c++}' "$f")

  for heading in "## Sources" "## Related" "## References"; do
    line=$(echo "$body" | grep -nF -- "$heading" | head -1)
    if [ -n "$line" ]; then
      echo "✗ $f: body contains \"$heading\" — move it to the frontmatter channel (sources:/related:). The template renders these blocks."
      FAIL=$((FAIL+1))
    fi
  done
done

if [ $FAIL -gt 0 ]; then
  echo "✗ insights lint: $FAIL violation(s). Build rejected."
  exit 1
fi
echo "✓ insights lint: all articles use the template channels"
