# Quick Fixes Guide
## CivicTech Waterloo Region Website

This is a prioritized action list for fixing the most critical issues identified in the audit.

---

## ⚠️ CRITICAL - Fix Before Merging (2-4 hours)

### 1. Remove Inline Styles from Recent Commits (30 min)
**File:** `index.html` lines 218-250

**Current (BAD):**
```html
<section style="background-color: var(--secondary-color);">
<h2 style="text-align: center;color: white;">
<span style="color: white;">
```

**Fix:** Add to `css/style.css`:
```css
.meeting-section-alt {
  background-color: var(--secondary-color);
}

.meeting-section-alt h2,
.meeting-section-alt .profile-small-title,
.meeting-section-alt span,
.meeting-section-alt p {
  color: white;
}

.meeting-btn-alt {
  background-color: white !important;
  color: var(--secondary-color) !important;
}
```

**Then update HTML:**
```html
<section class="featured section-padding meeting-section-alt" id="section_2">
  <h2 style="text-align: center;">We look forward to seeing you on Wednesdays</h2>
  ...
```

---

### 2. Fix All HTTP Links to HTTPS (15 min)

**Files to update:**
- `footer.html` (lines 47-53)
- `_includes/footer.html`
- `index.html` (line 387)
- `about.html` (line 302)
- `projects.html` (line 225)

**Find and replace:**
```
http://civictechwr.github.io/ → https://civictechwr.github.io/
http://www.meetup.com/ → https://www.meetup.com/
```

---

### 3. Delete Orphaned Assets (10 min)

**Run these commands:**
```bash
# Remove unused images (30MB)
rm images/hacknight-2.jpg
rm images/hacknight-3.jpg
rm images/hacknight-4.jpg
rm images/hacknight-5.jpg
rm images/hacknight-6.jpg
rm images/hacknight-9.jpg
rm images/join-us.jpg

# Remove backup files (13MB)
rm images/hacknight-1-old.jpg
rm images/hacknight-7-old.jpg
rm images/hacknight-8-old.jpg

# Remove old code files (218KB)
rm css/bootstrap.min.css.old.css
rm js/bootstrap.min.js.old.js

# Remove system files
find . -name ".DS_Store" -delete
```

**Verify before committing:**
```bash
git status
# Should show 20 deleted files
```

---

### 4. Add Alt Text to Images (20 min)

**File:** `index.html`

**Lines 167, 195, 332 - Change from:**
```html
<img src="/images/hacknight-1.jpg" alt="" loading="lazy">
```

**To:**
```html
<img src="/images/hacknight-1.jpg"
     alt="CivicTech Waterloo Region community members collaborating at weekly hacknight event"
     loading="lazy">
```

**Other files:**
- `about.html` lines 185, 266
- `projects.html` line 180

---

### 5. Update jQuery (30 min)

**Option A: Upgrade jQuery (quick fix)**
```html
<!-- In HTML files, change from: -->
<script src="js/jquery.min.js"></script>

<!-- To: -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
        crossorigin="anonymous"></script>
```

**Option B: Remove jQuery (recommended, but needs testing)**
See `AUDIT_REPORT.md` section 3.1 for vanilla JS replacements.

---

### 6. Update Bootstrap (1-2 hours)

**Download Bootstrap 5.3.0:**
```bash
# Download from https://getbootstrap.com/docs/5.3/getting-started/download/
# Or use CDN temporarily:
```

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
      crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
        crossorigin="anonymous"></script>
```

**Test:** Mobile menu, navbar, any modals

---

## 🔥 HIGH PRIORITY (4-6 hours)

### 7. Fix Footer Inline Styles
**File:** `footer.html` lines 10, 19, 46

Move to CSS:
```css
.footer-col-title {
  color: var(--secondary-color);
}
```

### 8. Add Skip Navigation Link
**All HTML files** - Add after `<body>` tag:
```html
<a href="#section_1" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### 9. Hide Decorative Elements
Search for all `class="abstract-shape"` and add `aria-hidden="true"`:
```html
<div class="abstract-shape shape-circle" aria-hidden="true"></div>
```

### 10. Add Warning to External Links
All `target="_blank"` links need:
```html
<a href="https://example.com"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Link name (opens in new window)">
```

---

## 📋 TESTING CHECKLIST

After making fixes, test:

```bash
# 1. Install dependencies
npm install

# 2. Run linting
npm run lint

# 3. Build Jekyll site
bundle exec jekyll build

# 4. Serve locally
bundle exec jekyll serve

# 5. Test in browser
# - Check http://localhost:4000
# - Test mobile responsive
# - Test with keyboard only (Tab, Enter)
# - Check browser console for errors
```

**Manual checks:**
- [ ] All images have descriptive alt text
- [ ] No HTTP links (all HTTPS)
- [ ] No inline styles in HTML
- [ ] Skip navigation works
- [ ] Mobile menu works
- [ ] All sponsor logos display
- [ ] Meeting info displays
- [ ] Projects page loads

---

## 📊 VERIFICATION

### Before Merging, Verify:
```bash
# Check file sizes
du -sh images/

# Should be ~3MB (down from 42MB)

# Check for HTTP links
grep -r "http://" *.html _includes/

# Should only find commented links or localhost

# Check for inline styles
grep -r 'style="' *.html

# Should only find semantic cases (text-align)

# Check git status
git status

# Should show:
# - Modified files: index.html, footer.html, css/style.css, .gitignore
# - Deleted files: 20 orphaned assets
# - New files: linting configs, audit reports
```

---

## 🎯 COMMIT MESSAGE TEMPLATE

```
perf: comprehensive audit fixes and cleanup

Critical fixes:
- Remove inline styles from meeting section
- Fix all HTTP links to use HTTPS
- Delete 38.8MB of orphaned/backup assets
- Add descriptive alt text to all images
- Update jQuery 2.2.3 → 3.7.1 (security)
- Update Bootstrap 4.1.3 → 5.3.0 (security)

Improvements:
- Add linting configuration (HTML, CSS, JS)
- Update .gitignore for system/backup files
- Add skip navigation for accessibility
- Hide decorative elements from screen readers

See AUDIT_REPORT.md for full analysis

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 📈 EXPECTED RESULTS

After applying these fixes:

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Repository Size | 42MB | 3.2MB | -92% |
| Page Weight | 3.5MB | 2MB | -43% |
| Security Issues | 3 critical | 0 | ✅ |
| Accessibility Score | ~40% | ~70% | +30% |
| Inline Styles | 15+ | 0 | ✅ |

---

## ❓ NEED HELP?

Refer to:
- `AUDIT_REPORT.md` - Full detailed analysis
- `.claude/README.md` - Claude Code agents documentation
- `package.json` - Linting scripts

Or ask:
```
Claude, help me implement fix #[number]
```
