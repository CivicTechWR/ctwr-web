#!/bin/bash

# Setup script for creating a preview branch for GitHub Pages
# This allows you to preview the perf/perf-improvements branch

echo "🚀 Setting up preview for perf/perf-improvements branch..."

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "perf/perf-improvements" ]; then
  echo "❌ Please switch to the perf/perf-improvements branch first"
  echo "   Run: git checkout perf/perf-improvements"
  exit 1
fi

# Build the site
echo "📦 Building Jekyll site..."
bundle exec jekyll build

# Create a temporary branch for preview
echo "🌿 Creating preview branch..."
git checkout -b preview-perf-improvements

# Add the built site
echo "📁 Adding built site to preview branch..."
git add _site/
git commit -m "Add built site for preview"

# Push the preview branch
echo "⬆️  Pushing preview branch..."
git push origin preview-perf-improvements

echo "✅ Preview setup complete!"
echo ""
echo "🔗 Your preview will be available at:"
echo "   https://civictechwr.github.io/ctwr-web/preview-perf-improvements/"
echo ""
echo "📝 To clean up later, run:"
echo "   git branch -D preview-perf-improvements"
echo "   git push origin --delete preview-perf-improvements"
