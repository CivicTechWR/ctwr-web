# Mobile Centering Issue - Investigation & Solution Report

**Date**: October 20, 2025
**Issue**: Content shifted rightward on mobile (375px viewport)
**Status**: ✅ RESOLVED

## Problem Summary

All content on index.html appeared shifted slightly to the right on mobile screens (375px width), creating a misaligned, non-centered appearance with horizontal scrolling across all sections.

## Root Cause Analysis

### Investigation Results

Using Playwright DevTools evaluation, I systematically investigated the mobile layout and identified TWO critical root causes:

#### 1. Missing `box-sizing: border-box` Declaration (CRITICAL)
- **Finding**: All elements had `box-sizing: content-box` (browser default)
- **Impact**: Padding was ADDED to element widths instead of being included
- **Example**: A 345px column + 30px padding = 375px total width (causing overflow)
- **Evidence**: Container width was 405px (375px + 15px left + 15px right padding)

#### 2. Column Padding Rule Not Applied Initially
- **Finding**: Column padding rule existed in source CSS but wasn't being served
- **Cause**: Jekyll's `_site` directory had stale CSS (last updated Oct 19, source was Oct 20)
- **Impact**: Columns had `paddingLeft: 0px` and `paddingRight: 0px` initially
- **Solution**: Required manual CSS rebuild and copy to `_site` directory

### Measured Overflow
- **Before Fix**: scrollWidth = 421px vs viewport = 375px (46px overflow)
- **After Fix**: scrollWidth = 375px (perfect match, no overflow)

## Solution Implemented

### Fix #1: Added Universal Box-Sizing Rule

**File**: `/css/bootstrap-custom.css` (lines 4-9)

```css
/* Box-sizing fix - critical for proper grid layout */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

**Rationale**: Bootstrap requires `border-box` for its grid system to work correctly. Without this, padding is added ON TOP of widths rather than being included, causing all containers and columns to overflow.

### Fix #2: Column Padding Rule (Already Existed, Just Needed Deployment)

**File**: `/css/bootstrap-custom.css` (lines 44-50)

```css
/* All columns need padding to offset row's negative margins */
[class*="col-"] {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
```

**Deployment Steps**:
1. Rebuilt CSS: `npm run build:main-css`
2. Copied to Jekyll site: `/bin/cp css/main.css _site/css/main.css`

## Verification Results

All success criteria met:

### ✅ Success Criteria Checklist

1. **No Horizontal Overflow**: scrollWidth === 375px (viewport width)
   - Before: 421px
   - After: 375px ✅

2. **Columns Have Proper Padding**: All columns paddingLeft/Right = 15px
   - Before: 0px / 0px
   - After: 15px / 15px ✅

3. **Box-Sizing Border-Box**: All elements use border-box
   - Before: content-box
   - After: border-box ✅

4. **Containers Centered**: marginLeft === marginRight (both 0px on mobile)
   - Before: marginRight = -30px (asymmetric)
   - After: marginLeft = 0px, marginRight = 0px ✅

### Sample Column Verification
```javascript
{
  "classes": "col-lg-7 col-12",
  "paddingLeft": "15px",     // ✅ Correct
  "paddingRight": "15px",    // ✅ Correct
  "boxSizing": "border-box"  // ✅ Correct
}
```

### Container Verification
```javascript
{
  "width": 375,              // ✅ Matches viewport
  "marginLeft": "0px",       // ✅ Symmetric
  "marginRight": "0px",      // ✅ Symmetric
  "boxSizing": "border-box"  // ✅ Correct
}
```

## Technical Explanation

### Why Box-Sizing Matters

**With `content-box` (default)**:
```
Total Width = width + paddingLeft + paddingRight + borderLeft + borderRight
Container: 375px (width) + 15px + 15px = 405px (OVERFLOW!)
```

**With `border-box` (required for Bootstrap)**:
```
Total Width = width (includes padding and border)
Container: 375px (includes padding) = 375px (PERFECT!)
```

### Bootstrap Grid System Requirements

Bootstrap's grid system relies on:
1. **Rows** with negative margins (-15px left/right) to offset column padding
2. **Columns** with positive padding (15px left/right) to create gutters
3. **Box-sizing: border-box** to ensure padding doesn't add to width

Without `border-box`, the math breaks:
- Row negative margins: -30px total
- Column padding: +30px total
- Result: Elements extend beyond their containers

## Files Modified

1. **`/css/bootstrap-custom.css`**
   - Added universal `box-sizing: border-box` rule (lines 4-9)
   - Column padding rule already existed (lines 44-50)

2. **`/css/main.css`** (compiled output)
   - Rebuilt from component files via `npm run build:main-css`
   - Deployed to `_site/css/main.css`

## Prevention & Best Practices

### For Future CSS Work

1. **Always Include Box-Sizing Reset**: Any project using Bootstrap or custom grid systems MUST include the universal `box-sizing: border-box` rule at the top of the CSS

2. **Jekyll Build Process**: Be aware that Jekyll may serve stale CSS from `_site`. After CSS changes:
   ```bash
   npm run build:main-css  # Rebuild compiled CSS
   /bin/cp css/main.css _site/css/main.css  # Deploy to Jekyll
   ```

3. **Verify in Browser**: Use DevTools to check:
   - `box-sizing` computed style
   - `scrollWidth` vs viewport width
   - Container and column padding values

### CSS Architecture Note

The project uses a component-based CSS architecture:
- **Source**: Individual component files in `/css/`
- **Build**: `npm run build:main-css` concatenates components
- **Serve**: Jekyll serves from `_site/css/main.css`

Changes to component files require rebuilding AND deploying to `_site`.

## Screenshot Evidence

**After Fix** (mobile 375px viewport):
- Screenshot saved: `/Users/andrelevesque/.playwright-mcp/mobile-centering-FIXED.png`
- Shows perfectly centered content with no horizontal scroll
- All sections aligned consistently

## Lessons Learned

1. **Box-sizing is foundational**: Before debugging grid issues, verify `box-sizing: border-box` is set
2. **Build systems matter**: Always check if changes are actually being served
3. **DevTools over assumptions**: Systematic browser evaluation revealed the exact root cause
4. **Bootstrap requirements**: Custom Bootstrap implementations must follow Bootstrap's CSS reset requirements

## Conclusion

The mobile centering issue was caused by TWO problems:
1. Missing `box-sizing: border-box` universal rule (CRITICAL)
2. Stale CSS in Jekyll's `_site` directory (DEPLOYMENT)

Both issues are now resolved. The site renders perfectly on mobile with:
- No horizontal overflow
- Proper column padding (15px gutters)
- Centered containers
- Consistent alignment across all sections

**Status**: Production-ready ✅
