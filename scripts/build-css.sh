#!/bin/bash
set -euo pipefail

# Build CSS
# Run postcss to clean/sort/optimize css
npx postcss css/main.css --replace --config postcss.config.js
