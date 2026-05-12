#!/usr/bin/env bash
# Strip metadata (EXIF, C2PA content credentials, software tags, timestamps) from
# image files. Run before/after copying inbox images into public/.
#
# Why: gpt-image embeds C2PA "content credentials" that LinkedIn renders as a
# small "CR" badge overlay on uploaded images. Cosmetic, not a leak.
#
# Usage:
#   scripts/strip-image-metadata.sh path/to/img.png [more.png ...]
#   scripts/strip-image-metadata.sh public/insights/*/   # strips every .png under matching dirs
#
# Requires: exiftool  (brew install exiftool)

set -e

if ! command -v exiftool >/dev/null 2>&1; then
  echo "✗ exiftool not installed. Run: brew install exiftool" >&2
  exit 1
fi

if [ $# -eq 0 ]; then
  echo "usage: $0 <path> [<path> ...]" >&2
  exit 1
fi

# Resolve args into a list of image files
files=()
for arg in "$@"; do
  if [ -d "$arg" ]; then
    while IFS= read -r -d '' f; do files+=("$f"); done < <(find "$arg" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) -print0)
  elif [ -f "$arg" ]; then
    files+=("$arg")
  else
    echo "skip (not found): $arg" >&2
  fi
done

if [ ${#files[@]} -eq 0 ]; then
  echo "no image files found" >&2
  exit 0
fi

exiftool -all= -overwrite_original "${files[@]}"
