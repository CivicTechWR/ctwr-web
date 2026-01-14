#!/bin/bash
set -euo pipefail

echo "Validating CSS budget..."
SIZE=$(wc -c < css/main.css)
LIMIT=100000 # 100KB limit
if [ "$SIZE" -gt $LIMIT ]; then
  echo "CSS file size $SIZE bytes exceeds limit of $LIMIT bytes"
  exit 1
else
  echo "CSS file size $SIZE bytes is within limit of $LIMIT bytes"
fi
