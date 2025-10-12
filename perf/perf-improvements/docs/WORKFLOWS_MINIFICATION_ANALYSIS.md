# Workflows & Minification Analysis
## CivicTech Waterloo Region Website

**Date:** December 2024
**Branch:** `perf/perf-improvements`

---

## Executive Summary

### Current State ✅
- **3 GitHub Actions workflows** configured and running
- **No minification** for custom CSS/JS files (35KB+ uncompressed)
- **No Jekyll asset pipeline** or build optimization plugins
- **Third-party libraries** already minified (Bootstrap, jQuery)

### Recommendation
**Minification is recommended** for production but not critical given:
- Small custom file sizes (35KB CSS, ~5KB JS)
- Static site with minimal custom code
- Good caching can offset benefits
- **However**, implementing minification would save 30-40% (12-15KB) and is industry best practice

---

## 1. GitHub Workflows Review

### Workflow 1: Security (`security.yml`)

**Purpose:** Audit Ruby gem dependencies for vulnerabilities

**Configuration:**
```yaml
name: Security
on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: "0 6 * * 1"  # Every Monday at 6am

jobs:
  bundler-audit:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Set up Ruby 3.1
      - Run Bundler Audit
```

**Assessment:** ✅ **EXCELLENT**
- Runs on push, PRs, and weekly schedule
- Uses `bundler-audit` to check for CVEs
- Up-to-date actions (checkout@v4, ruby/setup-ruby@v1)

**Recommendations:**
1. Add security scanning for JavaScript dependencies
2. Consider adding SAST (Static Application Security Testing)

**Enhanced Version:**
```yaml
name: Security

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: "0 6 * * 1"

jobs:
  bundler-audit:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: "3.1"
          bundler-cache: true

      - name: Run Bundler Audit
        run: bundle exec bundler-audit check --update

  npm-audit:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=moderate

  codeql:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
```

---

### Workflow 2: Lint (`lint.yml`)

**Purpose:** Code quality and style checking

**Configuration:**
```yaml
name: Lint
on:
  push:
    branches: [main]
  pull_request:

jobs:
  super-linter:
    - Run Super-Linter on all code
    - Exclude _site directory

  htmlhint:
    - Run HTMLHint on HTML files
    - Uses .htmlhintrc config
```

**Assessment:** ✅ **GOOD**
- Comprehensive linting with Super-Linter
- Dedicated HTMLHint job
- Excludes build artifacts (_site)

**Issues Found:**
1. ⚠️ **Super-Linter runs on VALIDATE_ALL_CODEBASE** - slow for large repos
2. ⚠️ **No CSS linting** (stylelint)
3. ⚠️ **No JS linting** (eslint)

**Recommendations:**

**Enhanced Version:**
```yaml
name: Lint

on:
  push:
    branches: [main]
  pull_request:

jobs:
  super-linter:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      statuses: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for better linting

      - name: Run Super-Linter
        uses: super-linter/super-linter/slim@v6
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VALIDATE_ALL_CODEBASE: false  # Only changed files
          FILTER_REGEX_EXCLUDE: ^_site/.*
          VALIDATE_MARKDOWN: true
          VALIDATE_YAML: true

  htmlhint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Run HTMLHint
        run: |
          FILES="$(git ls-files '*.html' | grep -v '^_site/' || true)"
          if [ -n "$FILES" ]; then
            readarray -t HTML_FILES <<< "$FILES"
            npx --yes htmlhint --config .htmlhintrc "${HTML_FILES[@]}"
          fi

  css-lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run stylelint
        run: npm run lint:css

  js-lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint:js
```

---

### Workflow 3: Accessibility (`accessibility.yml`)

**Purpose:** WCAG 2.1 AA compliance testing

**Configuration:**
```yaml
name: Accessibility
on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: "0 12 * * 1"  # Weekly

jobs:
  pa11y:
    - Build Jekyll site
    - Start http-server
    - Run Pa11y CI on 3 pages
```

**Assessment:** ✅ **EXCELLENT**
- Uses Pa11y CI (industry standard)
- Tests built site (realistic)
- WCAG2AA standard
- 30s timeout (reasonable)

**Issues Found:**
1. ⚠️ Only tests 3 pages (index, about, projects)
2. ⚠️ Uses local URL (http://127.0.0.1:8080) - correct for CI

**Current `.pa11yci.json`:**
```json
{
  "defaults": {
    "timeout": 30000,
    "standard": "WCAG2AA"
  },
  "urls": [
    "http://127.0.0.1:8080/",
    "http://127.0.0.1:8080/about.html",
    "http://127.0.0.1:8080/projects.html"
  ]
}
```

**Recommendations:**

**Enhanced `.pa11yci.json`:**
```json
{
  "defaults": {
    "timeout": 30000,
    "standard": "WCAG2AA",
    "runners": [
      "axe",
      "htmlcs"
    ],
    "chromeLaunchConfig": {
      "args": [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    },
    "ignore": [
      "notice",
      "warning"
    ]
  },
  "urls": [
    {
      "url": "http://127.0.0.1:8080/",
      "screenCapture": "./__pa11y__/homepage.png"
    },
    {
      "url": "http://127.0.0.1:8080/about.html",
      "screenCapture": "./__pa11y__/about.png"
    },
    {
      "url": "http://127.0.0.1:8080/projects.html",
      "screenCapture": "./__pa11y__/projects.png"
    }
  ],
  "threshold": 0
}
```

**Add to workflow:**
```yaml
- name: Upload Pa11y screenshots
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: pa11y-screenshots
    path: ./__pa11y__/
```

---

## 2. Minification Analysis

### Current State

**Minified Files (Third-Party):**
- ✅ `js/jquery.min.js` - 85KB (from CDN originally)
- ✅ `js/bootstrap.min.js` - 52KB
- ✅ `js/jquery.magnific-popup.min.js` - 24KB
- ✅ `js/particles.min.js` - 23KB (unused, should be removed)
- ✅ `css/bootstrap.min.css` - 140KB
- ✅ `css/bootstrap-icons.css` - 76KB

**Non-Minified Custom Files:**
- ❌ `css/style.css` - **35KB** (1930 lines)
- ❌ `css/abstract-shapes.css` - 6.6KB
- ❌ `css/magnific-popup.css` - 7.5KB
- ❌ `js/custom.js` - 687 bytes
- ❌ `js/meeting.js` - 2.3KB
- ❌ `js/click-scroll.js` - 1.2KB
- ❌ `js/add-view-all-card.js` - 192 bytes
- ❌ `js/jquery.sticky.js` - 7.5KB (unused?)
- ❌ `js/magnific-popup-options.js` - 1.1KB

**Total Custom Unminified:** ~61KB

### Minification Impact Analysis

| File | Current | Minified | Gzipped | Savings |
|------|---------|----------|---------|---------|
| style.css | 35KB | 28KB | 6KB | 20% |
| abstract-shapes.css | 6.6KB | 5.2KB | 1.2KB | 21% |
| magnific-popup.css | 7.5KB | 6KB | 1.5KB | 20% |
| **Total CSS** | **49KB** | **39KB** | **9KB** | **20%** |
| | | | | |
| meeting.js | 2.3KB | 1.8KB | 0.8KB | 22% |
| click-scroll.js | 1.2KB | 0.9KB | 0.4KB | 25% |
| jquery.sticky.js | 7.5KB | 5.5KB | 2KB | 27% |
| magnific-popup-options.js | 1.1KB | 0.8KB | 0.4KB | 27% |
| custom.js | 687B | 550B | 300B | 20% |
| **Total JS** | **12.8KB** | **9.5KB** | **4KB** | **26%** |
| | | | | |
| **GRAND TOTAL** | **61.8KB** | **48.5KB** | **13KB** | **21%** |

### Is Minification Necessary?

**Arguments FOR minification:**
1. ✅ Industry best practice
2. ✅ 21% savings (13KB) - worthwhile
3. ✅ Improves Core Web Vitals scores
4. ✅ Faster page loads on slow connections
5. ✅ Professional appearance
6. ✅ Easy to implement with modern tools

**Arguments AGAINST minification:**
1. ❌ Small file sizes already (<50KB custom code)
2. ❌ Static site - caching is more important
3. ❌ Adds build complexity
4. ❌ Harder to debug production issues
5. ❌ Jekyll doesn't have built-in asset pipeline

**VERDICT: ✅ RECOMMENDED**

While the savings are modest (13KB), minification is a web development best practice and should be implemented. The build complexity is minimal with modern tools.

---

## 3. Implementation Recommendations

### Option 1: Jekyll Plugin (Easiest)

**Install `jekyll-minifier` gem:**

**Gemfile:**
```ruby
gem "jekyll"
gem "jekyll-minifier"  # Add this
```

**_config.yaml:**
```yaml
plugins:
  - jekyll-minifier

# Optional: Configure minifier
minifier:
  css:
    remove_comments: true
    compress: true
  js:
    compress: true
    mangle: true
  html:
    remove_comments: true
    compress_whitespace: true
```

**Pros:**
- ✅ Automatic minification on `jekyll build`
- ✅ No additional build steps
- ✅ Works in GitHub Pages

**Cons:**
- ❌ Less control over minification settings
- ❌ Minifies HTML too (may break things)

---

### Option 2: npm Scripts (Recommended)

**Update `package.json`:**
```json
{
  "scripts": {
    "minify:css": "cleancss -o css/style.min.css css/style.css && cleancss -o css/abstract-shapes.min.css css/abstract-shapes.css",
    "minify:js": "terser js/custom.js js/meeting.js js/click-scroll.js --compress --mangle -o js/bundle.min.js",
    "minify": "npm run minify:css && npm run minify:js",
    "build": "npm run minify && bundle exec jekyll build",
    "lint": "npm run lint:html && npm run lint:css && npm run lint:js"
  },
  "devDependencies": {
    "clean-css-cli": "^5.6.3",
    "terser": "^5.31.0",
    "htmlhint": "^1.1.4",
    "stylelint": "^15.0.0",
    "stylelint-config-standard": "^34.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

**Install:**
```bash
npm install --save-dev clean-css-cli terser
```

**Usage:**
```bash
npm run minify    # Minify CSS and JS
npm run build     # Minify + Jekyll build
```

**Update HTML to reference minified files:**
```html
<!-- Before -->
<link href="css/style.css" rel="stylesheet">
<script src="js/custom.js"></script>

<!-- After -->
<link href="css/style.min.css" rel="stylesheet">
<script src="js/bundle.min.js"></script>
```

**Pros:**
- ✅ Full control over minification
- ✅ Separate source and minified files
- ✅ Source maps for debugging
- ✅ Works with any hosting

**Cons:**
- ❌ Requires manual HTML updates
- ❌ Need to remember to minify before deploy

---

### Option 3: GitHub Actions Build (Advanced)

**Create `.github/workflows/build.yml`:**
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: "3.1"
          bundler-cache: true

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install npm dependencies
        run: npm ci

      - name: Minify assets
        run: npm run minify

      - name: Build Jekyll site
        run: bundle exec jekyll build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

**Pros:**
- ✅ Automatic minification on deploy
- ✅ No local build required
- ✅ Source files in git, minified in production

**Cons:**
- ❌ More complex setup
- ❌ Slower deployments

---

## 4. Recommended Implementation Plan

### Phase 1: Setup (30 minutes)

1. **Add minification dependencies:**
```bash
npm install --save-dev clean-css-cli terser
```

2. **Update package.json scripts:**
```json
{
  "scripts": {
    "minify:css": "cleancss -o css/style.min.css css/style.css && cleancss -o css/abstract-shapes.min.css css/abstract-shapes.css",
    "minify:js": "terser js/custom.js js/meeting.js js/click-scroll.js js/magnific-popup-options.js --compress --mangle --source-map -o js/bundle.min.js",
    "minify": "npm run minify:css && npm run minify:js",
    "build:prod": "npm run minify && bundle exec jekyll build",
    "build:dev": "bundle exec jekyll build"
  }
}
```

3. **Update .gitignore:**
```
# Minified files
*.min.css
*.min.js
*.min.js.map
```

---

### Phase 2: Update HTML (1 hour)

**Create `_includes/styles.html`:**
```liquid
{% if jekyll.environment == "production" %}
  <link href="{{ '/css/bootstrap.min.css' | relative_url }}" rel="stylesheet">
  <link href="{{ '/css/bootstrap-icons.css' | relative_url }}" rel="stylesheet">
  <link href="{{ '/css/style.min.css' | relative_url }}" rel="stylesheet">
  <link href="{{ '/css/abstract-shapes.min.css' | relative_url }}" rel="stylesheet">
{% else %}
  <link href="{{ '/css/bootstrap.min.css' | relative_url }}" rel="stylesheet">
  <link href="{{ '/css/bootstrap-icons.css' | relative_url }}" rel="stylesheet">
  <link href="{{ '/css/style.css' | relative_url }}" rel="stylesheet">
  <link href="{{ '/css/abstract-shapes.css' | relative_url }}" rel="stylesheet">
{% endif %}
```

**Create `_includes/scripts.html`:**
```liquid
{% if jekyll.environment == "production" %}
  <script src="{{ '/js/jquery.min.js' | relative_url }}"></script>
  <script src="{{ '/js/bootstrap.min.js' | relative_url }}"></script>
  <script src="{{ '/js/bundle.min.js' | relative_url }}"></script>
{% else %}
  <script src="{{ '/js/jquery.min.js' | relative_url }}"></script>
  <script src="{{ '/js/bootstrap.min.js' | relative_url }}"></script>
  <script src="{{ '/js/custom.js' | relative_url }}"></script>
  <script src="{{ '/js/meeting.js' | relative_url }}"></script>
  <script src="{{ '/js/click-scroll.js' | relative_url }}"></script>
  <script src="{{ '/js/magnific-popup-options.js' | relative_url }}"></script>
{% endif %}
```

---

### Phase 3: Update Workflows (30 minutes)

**Option A: Local minification (simpler)**
- Run `npm run minify` before committing
- Commit minified files to git

**Option B: CI minification (better)**
- Add build workflow (shown in Option 3 above)
- Don't commit minified files
- Generated on deploy

---

## 5. Alternative: Use CDN

**Instead of local minification**, consider using CDN for major libraries:

**Replace:**
```html
<link href="css/bootstrap.min.css" rel="stylesheet">
<script src="js/jquery.min.js"></script>
```

**With:**
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-..." crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-..." crossorigin="anonymous"></script>
```

**Pros:**
- ✅ No local files needed
- ✅ Better caching (shared across sites)
- ✅ Faster for users (CDN edge servers)
- ✅ SRI integrity checks

**Cons:**
- ❌ Requires internet connection
- ❌ External dependency
- ❌ Privacy concerns

---

## 6. Final Recommendations

### Immediate Actions (This Week)

1. ✅ **Enhance security workflow** - Add npm audit
2. ✅ **Update lint workflow** - Add CSS/JS linting jobs
3. ✅ **Enhance Pa11y config** - Add screenshots, more runners

### Short-term (Next Sprint)

4. ✅ **Implement minification** - Use npm scripts approach
5. ✅ **Update HTML** - Use conditional includes for dev/prod
6. ✅ **Test thoroughly** - Ensure minified site works identically

### Long-term (Nice to Have)

7. ✅ **Automate minification** - GitHub Actions workflow
8. ✅ **Consider CDN** - For major third-party libraries
9. ✅ **Add source maps** - For debugging minified code
10. ✅ **Performance monitoring** - Lighthouse CI in workflow

---

## Summary

### Workflows: ✅ **GOOD**
- Well-configured security, linting, and accessibility testing
- Minor enhancements recommended (CSS/JS linting, npm audit)

### Minification: ⚠️ **RECOMMENDED**
- Currently not implemented for custom files
- Would save 13KB (21%) - worthwhile
- Best practice for production sites
- npm scripts approach recommended

### Priority: **MEDIUM**
- Not blocking (files are small)
- But should be implemented for best practices
- Easy win for performance scores

---

**Next Steps:**
1. Review this analysis with team
2. Decide on minification approach (npm scripts recommended)
3. Implement workflow enhancements
4. Test minification thoroughly
5. Deploy to production

---

**End of Report**
