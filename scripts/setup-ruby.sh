#!/usr/bin/env bash
set -euo pipefail

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "❌ Missing required command: $1" >&2
    exit 1
  }
}

echo "🔧 Checking Ruby environment..."

require_cmd ruby
require_cmd gem

RV=$(ruby -e 'v=RUBY_VERSION.split(".").map(&:to_i); print(sprintf("%d.%d.%d", *v))')
echo "➡️  Ruby detected: ${RV}"

MIN="3.1.0"
compare_versions() { printf '%s\n%s' "$1" "$2" | sort -C -V; }

if ! compare_versions "$MIN" "$RV"; then
  echo "❌ Ruby ${RV} is too old. Need ${MIN}+ (recommended 3.4.5)." >&2
  echo "👉 Install and select Ruby 3.4.5 with rbenv or asdf, e.g.:" >&2
  echo "   rbenv install 3.4.5 && rbenv local 3.4.5" >&2
  echo "   # or" >&2
  echo "   asdf install ruby 3.4.5 && asdf local ruby 3.4.5" >&2
  exit 2
fi

echo "📦 Ensuring Bundler present..."
gem list -i bundler >/dev/null || gem install bundler

echo "🧹 Cleaning old vendor bundle..."
rm -rf vendor/bundle

echo "📥 Installing gems..."
bundle config set path 'vendor/bundle'
bundle install --jobs 4 --retry 3

echo "✅ Ruby environment ready. Try: bundle exec jekyll build"
