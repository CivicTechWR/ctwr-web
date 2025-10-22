# Mobile Centering Issue - Deep Investigation Required

## Problem Statement
All content on index.html appears shifted slightly to the right on mobile screens (375px width). This creates a misaligned, non-centered appearance across all sections.

## What's Been Tried
1. ✅ Added universal column padding selector `[class*="col-"]` to bootstrap-custom.css
2. ✅ Rebuilt main.css from component files using `npm run build:main-css`
3. ❌ Issue persists - content still not properly centered on mobile

## Current State
- **File**: `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/css/bootstrap-custom.css`
- **Lines 44-50**: Universal column padding added
- **File**: `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/css/main.css`
- **Lines 688-692**: Column padding rule now included in compiled CSS
- **Server**: Jekyll running on http://localhost:4000
- **Viewport**: 375x667 (mobile)

## Investigation Needed

### 1. Verify CSS Application
- Check if column padding is actually being applied in browser DevTools
- Verify no conflicting CSS rules with higher specificity
- Check if any inline styles or other classes override the padding

### 2. Horizontal Overflow Analysis
- Measure actual scrollWidth vs viewport width
- Identify which elements extend beyond viewport
- Check for:
  - Images without `max-width: 100%`
  - Fixed-width elements
  - Negative margins without proper offsets
  - Padding calculations that don't account for box-sizing

### 3. Bootstrap Grid System Audit
- Verify all rows are properly wrapped in containers
- Check if any columns are missing the `col-*` class pattern
- Verify row negative margins are properly offset by column padding
- Check for any custom grid modifications

### 4. Mobile-Specific Issues
- Review all `@media` queries for mobile breakpoints
- Check for:
  - Viewport meta tag configuration
  - Touch-specific CSS that might affect layout
  - Mobile-first vs desktop-first approach conflicts

### 5. Section-by-Section Analysis
For each section on index.html:
- Hero
- About
- Meeting
- Projects
- Sponsors
- Footer

Check:
- Container width and margins
- Row/column structure
- Any section-specific CSS overrides
- Text overflow or whitespace issues

## Expected Outcome
- Content perfectly centered on 375px mobile viewport
- No horizontal scroll (scrollWidth === viewport width)
- All sections aligned consistently
- Container margins should be symmetric (auto or equal left/right)

## Tools Available
- Playwright browser automation (http://localhost:4000 already loaded)
- Browser DevTools via `evaluate()`
- All CSS files in `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/css/`
- Jekyll site structure

## Success Criteria
1. ✅ scrollWidth === 375px (no overflow)
2. ✅ Container marginLeft === marginRight
3. ✅ All columns have paddingLeft: 15px, paddingRight: 15px
4. ✅ Visual inspection shows centered content
5. ✅ Mobile screenshot shows no rightward shift

## Agent Instructions
Use Playwright to:
1. Navigate to http://localhost:4000
2. Resize to 375x667 viewport
3. Use DevTools evaluation to inspect computed styles systematically
4. Take screenshots before/after any fixes
5. Identify root cause(s) and implement proper solution(s)
6. Verify fix works across all sections

Focus on finding the actual root cause, not just adding more CSS rules. The issue might be:
- A more specific selector overriding the column padding
- A structural HTML problem
- A CSS calculation error (calc(), viewport units, etc.)
- An image or fixed-width element causing overflow

Work in the project directory: `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/`
