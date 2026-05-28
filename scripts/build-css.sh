#!/bin/bash
set -euo pipefail

# Bundle css/src/main.css (entry point with @imports) through the PostCSS
# pipeline and write the assembled, vendor-prefixed output to css/main.css.
# css/main.css and css/main.min.css are committed because GitHub Pages only
# runs Jekyll — no npm scripts execute during the Pages build.
if [ -f css/src/main.css ]; then
	npx postcss css/src/main.css --output css/main.css --config postcss.config.js
else
	npx postcss css/main.css --replace --config postcss.config.js
fi
