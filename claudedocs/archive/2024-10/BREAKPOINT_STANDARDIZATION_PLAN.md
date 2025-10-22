# Breakpoint Standardization Plan

**Date:** October 18, 2025
**Status:** Ready for implementation
**Priority:** HIGH

---

## Issue Summary

Media queries across the codebase use **4 different syntaxes** and **10 different breakpoint values** with several inconsistencies (767 vs 768, 991 vs 992). This creates maintenance challenges and potential responsive design bugs.

---

## Current State Analysis

### Syntax Inconsistencies (4 types)

1. **Modern range syntax:** `@media (width <= 768px)`
2. **Traditional max-width:** `@media (max-width: 768px)`
3. **Modern with screen:** `@media screen and (width <= 768px)`
4. **Traditional min-width:** `@media (min-width: 768px)`
5. **Range min-width:** `@media (width >= 768px)`

**Problem:** Mixing syntaxes makes code harder to read and maintain.

### Breakpoint Value Inconsistencies

| Breakpoint | Occurrences | Issue |
|------------|-------------|-------|
| 480px | 15 times | ✅ Standard mobile |
| 576px | 9 times | ✅ Bootstrap sm |
| **767px** | 2 times | ❌ Should be 768px |
| 768px | 24 times | ✅ Standard tablet |
| **900px** | 2 times | ❌ Non-standard |
| **991px** | 7 times | ❌ Should be 992px |
| **991.98px** | 2 times | ❌ Fractional, should be 992px |
| 992px | 7 times | ✅ Bootstrap md/lg boundary |
| 1200px | 4 times | ✅ Bootstrap xl |
| 1600px | 2 times | ⚠️ Large desktop (document if intentional) |

### Critical Issues

1. **navigation.css line 217:** `max-width: 767px` should be 768px
2. **Footer 900px:** Non-standard breakpoint, no clear rationale
3. **Services 991 vs 991.98:** Inconsistent sub-pixel breakpoints
4. **Syntax inconsistency:** 50+ media queries using 4 different syntaxes

---

## Recommended Breakpoint System

### Standard Breakpoints (Bootstrap 4 Compatible)

```css
/* Mobile-first breakpoints */
--breakpoint-xs: 0px;      /* Extra small devices (portrait phones) */
--breakpoint-sm: 576px;    /* Small devices (landscape phones) */
--breakpoint-md: 768px;    /* Medium devices (tablets) */
--breakpoint-lg: 992px;    /* Large devices (desktops) */
--breakpoint-xl: 1200px;   /* Extra large devices (large desktops) */
--breakpoint-xxl: 1600px;  /* Custom: Ultra-wide monitors */

/* Custom breakpoints */
--breakpoint-mobile: 480px;   /* Small mobile devices */
--breakpoint-tablet: 768px;   /* Tablets (alias for md) */
--breakpoint-desktop: 992px;  /* Desktop (alias for lg) */
```

### Rationale

1. **Bootstrap alignment:** Matches existing Bootstrap grid
2. **Industry standard:** Common breakpoints used by most frameworks
3. **Mobile-first:** Smallest to largest progression
4. **Named aliases:** `--breakpoint-mobile` is clearer than remembering 480px

---

## Standardization Strategy

### Phase 1: Add Breakpoint Variables to variables.css

**File:** `css/base/variables.css`

**Add after spacing variables (line 91):**

```css
/* Breakpoint System - Mobile-first responsive design */
/* Based on Bootstrap 4 breakpoints for grid compatibility */

/* Standard breakpoints */
--breakpoint-xs: 0;        /* Extra small: 0px and up */
--breakpoint-sm: 576px;    /* Small: 576px and up */
--breakpoint-md: 768px;    /* Medium: 768px and up */
--breakpoint-lg: 992px;    /* Large: 992px and up */
--breakpoint-xl: 1200px;   /* Extra large: 1200px and up */
--breakpoint-xxl: 1600px;  /* Extra extra large: 1600px and up */

/* Semantic aliases for clarity */
--breakpoint-mobile: 480px;   /* Small mobile devices */
--breakpoint-tablet: 768px;   /* Tablets (same as md) */
--breakpoint-desktop: 992px;  /* Desktop (same as lg) */

/* Max-width boundaries (for use in media queries) */
/* Note: CSS custom properties can't be used directly in @media queries */
/* These are for documentation and JavaScript access only */
--breakpoint-xs-max: 575px;   /* Max before sm */
--breakpoint-sm-max: 767px;   /* Max before md */
--breakpoint-md-max: 991px;   /* Max before lg */
--breakpoint-lg-max: 1199px;  /* Max before xl */
--breakpoint-xl-max: 1599px;  /* Max before xxl */
```

### Phase 2: Fix Off-By-One Errors

**Critical fixes (must be exact):**

1. `navigation.css:217` - Change `max-width: 767px` to `max-width: 768px`
2. All `991px` → `992px` (7 occurrences)
3. All `991.98px` → `992px` (2 occurrences)

### Phase 3: Standardize Syntax

**Recommended syntax:** Modern range syntax (most readable)

**Examples:**
```css
/* ❌ Old syntax */
@media (max-width: 768px) { ... }
@media (min-width: 768px) { ... }
@media screen and (width <= 768px) { ... }

/* ✅ New standardized syntax */
@media (width <= 768px) { ... }
@media (width >= 768px) { ... }
@media (width >= 768px) and (width < 992px) { ... }
```

**Remove unnecessary `screen and`** - not needed for width-based queries

### Phase 4: Handle Non-Standard Breakpoints

**900px breakpoint (footer.css):**
- **Current:** `@media (width <= 900px)` in footer
- **Options:**
  1. Change to 992px (standard desktop boundary)
  2. Keep 900px but document why (e.g., specific footer layout requirement)
- **Recommendation:** Test at 900px vs 992px, use 992px if no visual difference

**480px breakpoint:**
- **Status:** Commonly used for small mobile
- **Action:** Keep, add as `--breakpoint-mobile` variable
- **Rationale:** Targets older/smaller phones (iPhone SE, etc.)

---

## Implementation Plan

### Step 1: Add Variables (5 min)
**File:** `css/base/variables.css`
**Action:** Add breakpoint variables after existing variables

### Step 2: Fix Critical Off-By-One (10 min)
**Files:** `navigation.css`, multiple others
**Action:** Find/replace incorrect values

**Critical replacements:**
```bash
# In navigation.css line 217
max-width: 767px → max-width: 768px

# In all files
991px → 992px (7 occurrences)
991.98px → 992px (2 occurrences)
```

### Step 3: Standardize Syntax (30 min)
**All CSS files**
**Action:** Convert all media queries to modern range syntax

**Automated replacements:**
```bash
# Traditional to range syntax
@media (max-width: 768px) → @media (width <= 768px)
@media (min-width: 768px) → @media (width >= 768px)

# Remove unnecessary screen type
@media screen and (width <= 768px) → @media (width <= 768px)
```

### Step 4: Validate Footer 900px (5 min)
**File:** `footer.css`
**Test:** Does footer break between 900-992px?
**Action:** If no, change to 992px. If yes, document rationale.

### Step 5: Rebuild and Test (10 min)
```bash
# Rebuild CSS
bash scripts/build-main-css.sh
npm run minify:css

# Visual test at each breakpoint
# - 480px (mobile)
# - 576px (sm)
# - 768px (md)
# - 992px (lg)
# - 1200px (xl)
# - 1600px (xxl)
```

---

## Testing Checklist

### Automated Validation
- [ ] Build passes: `bundle exec jekyll build`
- [ ] No CSS syntax errors
- [ ] Grep for old syntax patterns (should find 0):
  ```bash
  grep -r "max-width: 767px" css/
  grep -r "991.98px" css/
  grep -r "screen and (width" css/
  ```

### Visual Regression Testing
**Test each breakpoint with Chrome DevTools:**

| Breakpoint | Width | Pages to Test | Check |
|------------|-------|---------------|-------|
| Mobile | 480px | All 3 pages | Navigation hamburger, content stacking |
| Small | 576px | All 3 pages | Grid columns, button sizing |
| Tablet | 768px | All 3 pages | Layout transitions, navigation |
| Desktop | 992px | All 3 pages | Full navigation, multi-column layouts |
| Large | 1200px | All 3 pages | Max-width containers |
| XL | 1600px | index.html | Hero section special styles |

**Edge cases to test:**
- [ ] 767px → 768px boundary (navigation hamburger)
- [ ] 991px → 992px boundary (desktop navigation)
- [ ] 900px → 992px footer (if changed)

---

## Rollback Plan

**If visual regressions detected:**

```bash
# Revert changes
git restore css/

# Or revert specific commit
git revert [commit-hash]
```

**Then:** Investigate specific breakpoint causing issue

---

## Expected Outcomes

### Code Quality
- ✅ Single standardized syntax (modern range)
- ✅ Documented breakpoint system (CSS variables)
- ✅ Fixed off-by-one errors (767→768, 991→992)
- ✅ Consistent breakpoint values across all files

### Maintainability
- ✅ Clear breakpoint documentation in variables.css
- ✅ Easy to update breakpoints (single source of truth for values)
- ✅ Consistent pattern for future media queries

### Performance
- ⚪ Neutral (same compiled CSS size)

---

## Documentation

### For Future Developers

**In variables.css (add comment):**
```css
/**
 * BREAKPOINT SYSTEM
 *
 * Standard breakpoints follow Bootstrap 4 convention:
 * - xs: 0px (default, no media query needed)
 * - sm: 576px and up
 * - md: 768px and up
 * - lg: 992px and up
 * - xl: 1200px and up
 * - xxl: 1600px and up (custom)
 *
 * Usage in media queries:
 * @media (width <= 768px) { ... }  // Mobile and tablet
 * @media (width >= 992px) { ... }  // Desktop and up
 * @media (width >= 768px) and (width < 992px) { ... }  // Tablet only
 *
 * NOTE: CSS custom properties cannot be used directly in @media queries.
 * The variables below are for documentation and JavaScript access.
 */
```

---

## Future Enhancement (Optional)

### Sass/SCSS Breakpoint Mixins

**If migrating to Sass in future:**

```scss
// Breakpoint mixins for easier responsive design
@mixin mobile-only {
  @media (width <= 767px) { @content; }
}

@mixin tablet-and-up {
  @media (width >= 768px) { @content; }
}

@mixin desktop-and-up {
  @media (width >= 992px) { @content; }
}

// Usage:
.my-element {
  @include mobile-only {
    font-size: 14px;
  }
  @include desktop-and-up {
    font-size: 18px;
  }
}
```

**Not implementing now:** Project uses vanilla CSS, not Sass/SCSS

---

## Notes

- Modern range syntax (`width <= 768px`) is supported in all modern browsers (Chrome 104+, Firefox 102+, Safari 16+)
- Fractional pixels (991.98px) were likely used to avoid conflicts between adjacent breakpoints, but unnecessary with modern range syntax
- The `screen and` media type is redundant for width-based queries (defaults to `all` which includes screen)

---

**Last Updated:** October 18, 2025
**Status:** Ready for implementation
**Estimated Time:** 60 minutes
**Risk Level:** Low (visual testing required)
