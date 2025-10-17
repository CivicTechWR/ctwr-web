#!/bin/bash

# CivicTechWR CSS Build Script
# Handles minification, purging, and optimization of CSS files

set -e

echo "🎨 Starting CSS build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create directories if they don't exist
mkdir -p css/purged
mkdir -p css/minified

echo -e "${BLUE}📦 Step 1: Running PurgeCSS to remove unused styles...${NC}"
npm run purge:css

echo -e "${BLUE}🔧 Step 2: Running PostCSS optimizations...${NC}"
postcss css/main.css -o css/main.optimized.css
postcss css/style.css -o css/style.optimized.css

echo -e "${BLUE}🗜️  Step 3: Minifying CSS files...${NC}"
npm run minify:css

echo -e "${BLUE}📊 Step 4: Analyzing CSS performance...${NC}"
npm run analyze:css

echo -e "${GREEN}✅ CSS build process completed successfully!${NC}"

# Display file sizes
echo -e "${YELLOW}📏 File size comparison:${NC}"
echo "Original main.css: $(du -h css/main.css | cut -f1)"
echo "Minified main.css: $(du -h css/main.min.css | cut -f1)"
echo "Purged main.css: $(du -h css/purged/main.css | cut -f1)"

echo -e "${GREEN}🚀 CSS optimization complete!${NC}"