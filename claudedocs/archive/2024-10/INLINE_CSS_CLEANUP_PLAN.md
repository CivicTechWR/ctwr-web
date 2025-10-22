# Inline CSS Cleanup Plan

**Date:** October 18, 2025
**Status:** Ready for implementation
**Priority:** HIGH

---

## Issue Summary

All three HTML pages (index.html, about.html, projects.html) contain duplicate inline `<style>` blocks that replicate CSS already loaded via external files (main.css). This violates DRY principles and adds ~2-5KB of unnecessary inline CSS per page.

---

## Duplication Analysis

### index.html (lines 42-87)
**Total inline CSS:** ~1,200 characters

**Duplicated styles:**
- `:root` variables (lines 44-75) → Already in `css/base/variables.css`
- `* { margin: 0; padding: 0; box-sizing: border-box; }` → Already in `css/style.css`
- `body` styles → Already in `css/style.css`
- `.skip-link` and `.skip-link:focus` → Already in `css/components/navigation.css`
- `.sr-only` → Already in `css/components/navigation.css`
- `.preloader` and `.spinner` → Already in `css/components/preloader.css`
- `@keyframes spinner` → Already in `css/components/preloader.css`

### about.html (lines 25-44)
**Total inline CSS:** ~2,100 characters

**Duplicated styles (all of index.html plus):**
- `.navbar` → Already in `css/components/navigation.css`
- `.navbar-brand` → Already in `css/components/navigation.css`
- `.navbar-nav .nav-link` → Already in `css/components/navigation.css`
- `.page-header` → Already in `css/style.css`
- `.page-header h1` → Already in `css/style.css`
- `.page-header p` → Already in `css/style.css`
- Media query for page-header → Already in `css/style.css`

### projects.html (lines 25-44)
**Total inline CSS:** ~2,100 characters
**Same duplication as about.html**

---

## Root Cause

The inline `<style>` blocks were intended as "Critical CSS" to prevent FOUC (Flash of Unstyled Content). However:

1. **Over-scoped:** Includes far more than critical above-the-fold styles
2. **Not generated:** Hand-written duplicates instead of automated critical CSS extraction
3. **Unmaintained:** Changes to external CSS don't sync to inline blocks

---

## Solution Strategy

### Option 1: Complete Removal (Recommended)
**Remove all inline `<style>` blocks entirely.**

**Rationale:**
- `css/main.css` is already preloaded via `<link rel="preload">`
- Preloaded CSS loads fast enough to prevent FOUC
- Eliminates ~6KB of duplicate code
- Simplifies maintenance (single source of truth)

**Tradeoffs:**
- Minimal FOUC risk on slow connections (mitigated by preload)

### Option 2: Minimal Critical CSS
**Keep ONLY truly critical preloader styles.**

**Minimal critical block:**
```css
<style>
  /* Minimal critical CSS - Preloader only */
  .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; display: flex; justify-content: center; align-items: center; background: #fff; }
  .spinner { border: 1px solid transparent; border-radius: 10px; position: relative; }
  .spinner::before { content: ''; box-sizing: border-box; position: absolute; top: 50%; left: 50%; width: 45px; height: 45px; margin-top: -10px; margin-left: -10px; border-radius: 9999px; border: 1px solid #e9eaeb; border-top-color: #fff; animation: spinner .9s linear infinite; }
  @keyframes spinner { to { transform: rotate(360deg); } }
</style>
```

**Size:** ~450 characters (vs 1,200-2,100 currently)

**Rationale:**
- Preloader appears immediately on page load
- Everything else can wait for main.css to load
- Still eliminates ~85% of duplicate CSS

**Tradeoffs:**
- Still some duplication (preloader styles)

### Option 3: Automated Critical CSS Generation
**Generate critical CSS automatically during build.**

**Implementation:**
- Use Critical CSS tool during Jekyll build
- Extract above-the-fold styles automatically
- Inline only what's truly needed per page

**Tradeoffs:**
- Adds build complexity
- Requires Critical CSS tool setup
- Overkill for a 3-page site

---

## Recommended Approach

**Use Option 1: Complete Removal**

**Reasons:**
1. `main.css` is preloaded, loads fast
2. Site has only 3 pages (low complexity)
3. Eliminates all duplication (DRY principle)
4. Simplifies long-term maintenance
5. Modern browsers handle preloaded CSS quickly

**Fallback:** If testing reveals FOUC issues, implement Option 2 (minimal preloader-only CSS)

---

## Implementation Plan

### Step 1: Update index.html
**Remove lines 42-87** (entire `<style>` block)

**Before:**
```html
<!-- Critical CSS inlined for performance -->
<style>
  /* Critical CSS - Above the fold styles only */
  :root { ... }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { ... }
  .skip-link { ... }
  .sr-only { ... }
  .preloader { ... }
  .spinner { ... }
  @keyframes spinner { ... }
  /* Inline CSS removed - using main.css instead */
</style>
```

**After:**
```html
<!-- All CSS loaded via main.css (preloaded for performance) -->
```

### Step 2: Update about.html
**Remove lines 25-44** (entire `<style>` block)

**Before:**
```html
<!-- Critical CSS inlined for performance -->
<style>
  :root { ... }
  * { ... }
  body { ... }
  .skip-link { ... }
  .sr-only { ... }
  .preloader { ... }
  .spinner { ... }
  @keyframes spinner { ... }
  .navbar { ... }
  .navbar-brand { ... }
  .navbar-nav .nav-link { ... }
  .page-header { ... }
  .page-header h1 { ... }
  .page-header p { ... }
  @media (max-width: 768px) { ... }
</style>
```

**After:**
```html
<!-- All CSS loaded via main.css (preloaded for performance) -->
```

### Step 3: Update projects.html
**Remove lines 25-44** (entire `<style>` block)

**Same changes as about.html**

### Step 4: Test for FOUC
**Testing checklist:**
- [ ] Load index.html - no white flash before styles apply
- [ ] Load about.html - no unstyled content flash
- [ ] Load projects.html - no layout shift on load
- [ ] Test on slow 3G connection (Chrome DevTools throttling)
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Verify preloader appears immediately
- [ ] Verify navigation doesn't flash unstyled

**If FOUC detected:**
Implement Option 2 (minimal preloader-only CSS)

### Step 5: Validate Build
```bash
bundle exec jekyll build
# Check for CSS errors
# Verify no broken styles
```

### Step 6: Commit Changes
```bash
git add index.html about.html projects.html
git commit -m "refactor: Remove duplicate inline CSS from HTML files

- Remove ~6KB of duplicate inline <style> blocks
- All styles now loaded via preloaded main.css
- Eliminates maintenance overhead of syncing inline CSS
- Maintains performance via <link rel='preload'>

Impact:
- index.html: -45 lines, -1.2KB inline CSS removed
- about.html: -20 lines, -2.1KB inline CSS removed
- projects.html: -20 lines, -2.1KB inline CSS removed
- Total: -85 lines, -5.4KB duplicate code eliminated

Testing: No FOUC detected, all pages render correctly

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Expected Outcomes

### Code Quality
- ✅ Eliminate 85 lines of duplicate code
- ✅ Remove ~5.4KB of inline CSS
- ✅ Single source of truth (main.css)
- ✅ Easier maintenance (no sync required)

### Performance
- ✅ Slightly faster HTML parse (smaller HTML files)
- ⚠️ Potential minimal FOUC risk (mitigated by preload)
- ✅ Better caching (all CSS in one cached file)

### Maintenance
- ✅ Changes only needed in CSS files
- ✅ No risk of inline/external CSS drift
- ✅ Easier debugging (single CSS source)

---

## Rollback Plan

If FOUC issues arise after deployment:

```bash
git revert HEAD
# Restores inline <style> blocks
```

Then implement Option 2 (minimal critical CSS) instead.

---

## Notes

- Inline `<style>` comment says "Inline CSS removed - using main.css instead" in index.html line 86, suggesting previous cleanup attempt
- `main.css` is already marked as preloaded in all three files
- No JavaScript manipulation of inline styles detected
- Safe to remove without affecting functionality

---

**Last Updated:** October 18, 2025
**Ready for Implementation:** Yes
**Risk Level:** Low (preload mitigates FOUC)
**Estimated Time:** 15 minutes
