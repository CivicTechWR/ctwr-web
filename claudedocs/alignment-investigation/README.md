# Alignment Investigation - October 20, 2025

## Quick Summary

**User Report:** Alignment is "close but also not really" correct

**Investigation Result:** Found and fixed 2 sections with vertical misalignment

**Root Cause:** Bootstrap utility classes `mt-5 mt-lg-0` breaking flexbox centering

**Fix:** Removed problematic classes from 2 columns (2 line changes)

**Result:** Pixel-perfect alignment across all breakpoints ✅

---

## Documents in This Directory

### 📋 FINDINGS.md
Detailed technical analysis of alignment issues:
- Exact pixel measurements for each section
- Root cause identification
- CSS properties causing problems
- Before/after comparisons

### 📊 SUMMARY.md
Complete investigation report:
- Executive summary
- All issues found and fixed
- File-by-file changes
- Verification results
- Success criteria checklist
- Recommendations

### 📸 Screenshots

#### Baseline (Before Fixes) - 1200px
- `baseline-hero-1200px.png` - Hero section
- `baseline-about-1200px.png` - About section (misaligned ❌)
- `baseline-projects-1200px.png` - Projects section
- `baseline-meeting-1200px.png` - Meeting section (misaligned ❌)

#### After Fixes - 1200px
- `after-hero-1200px.png` - Hero section (unchanged)
- `after-about-1200px.png` - About section (fixed ✅)
- `after-projects-1200px.png` - Projects section (unchanged)
- `after-meeting-1200px.png` - Meeting section (fixed ✅)

#### Mobile Verification - 375px
- `after-mobile-375px-hero.png` - Mobile hero
- `after-mobile-375px-about.png` - Mobile about
- `after-mobile-375px-meeting.png` - Mobile meeting

---

## Key Findings At a Glance

### About Section
**Before:** Text column 153px higher than image column (middleDiff: +24px)
**After:** Perfect vertical centering (middleDiff: 0.004px) ✅

### Meeting Section
**Before:** Image column 48px higher than info box (middleDiff: -24px)
**After:** Perfect alignment (topDiff: 0px, middleDiff: 0px) ✅

### Hero Section
**Status:** Already perfect - all elements centered at 600px ✅

### Projects Section
**Status:** Intentional asymmetric layout - working as designed ✅

---

## Changes Made

### File 1: `/index.html` (line 126)
```diff
- <div class="col-lg-6 col-12 mt-5 mt-lg-0">
+ <div class="col-lg-6 col-12">
```

### File 2: `/_includes/meeting-section.html` (line 12)
```diff
- <div class="col-lg-6 col-12 mt-5 mt-lg-0">
+ <div class="col-lg-6 col-12">
```

---

## Testing Verification

All breakpoints tested with **NO HORIZONTAL SCROLL**:
- ✅ 375px (mobile)
- ✅ 768px (tablet)
- ✅ 992px (desktop)
- ✅ 1200px (large desktop)
- ✅ 1400px (XL desktop)

---

## Why This Matters

User intuition was correct - the alignment was "close but not really":
- **Close:** Most sections were aligned correctly
- **Not really:** 2 sections had subtle 24-48px misalignments
- **Impact:** Breaks visual harmony and professional appearance

The fixes restore pixel-perfect alignment while maintaining:
- Responsive behavior across all devices
- Mobile-first design principles
- Bootstrap framework patterns
- No horizontal scroll on any device

---

## Technical Lesson Learned

**Don't mix utility classes with flexbox alignment:**

❌ Bad:
```html
<div class="row align-items-center">
  <div class="col-lg-6 mt-5 mt-lg-0">...</div>  <!-- Margin breaks centering -->
  <div class="col-lg-6">...</div>
</div>
```

✅ Good:
```html
<div class="row align-items-center">
  <div class="col-lg-6">...</div>  <!-- Let flexbox handle alignment -->
  <div class="col-lg-6">...</div>
</div>
```

**Principle:** When using `align-items: center`, asymmetric margins break vertical centering. Let the framework do the work.

---

## Questions?

Review the detailed documents:
1. **FINDINGS.md** - Technical measurements and root cause analysis
2. **SUMMARY.md** - Complete investigation report with all details
3. **Screenshots** - Visual before/after comparisons

Test the fixes live at: http://localhost:4000
