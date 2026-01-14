# frozen_string_literal: true

source "https://rubygems.org"

# Enforce modern Ruby for local dev and CI
ruby ">= 3.1.0"

# gem "rails"
gem "jekyll", "~> 4.3"

# Performance and SEO plugins
gem "jekyll-feed", "~> 0.12"
gem "jekyll-sitemap", "~> 1.4"
gem "jekyll-seo-tag", "~> 2.8"

# Windows file watcher (only install on Windows)
gem "wdm", '>= 0.1.0', platforms: [:mingw, :x64_mingw, :mswin]
gem "csv"
gem "base64"
gem "bigdecimal"
gem "rexml", ">= 3.4.2"

# Use sass-embedded (required by jekyll-sass-converter >= 3)
# Keep within 1.x for stability; works with Ruby 3.1+
gem "sass-embedded", "~> 1.97"

group :development do
  gem "bundler-audit", "~> 0.9", require: false
end
