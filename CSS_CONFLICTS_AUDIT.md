# CSS Conflicts and Overlaps Audit Report

**Date**: October 18, 2025
**Issue**: Multiple component files contain overlapping button styles causing conflicts

---

## 🚨 Critical Conflicts Found

### 1. Button Styles Outside buttons.css

**Problem**: Button styles scattered across multiple component files, causing specificity wars and unpredictable behavior.

#### hero.css (Line 184-186)
```css
.site-header .btn {
  margin-top: var(--space-3);
}
```
**Issue**: Adds margin-top to ALL buttons in site header
**Impact**: Could cause vertical alignment issues in header button groups
**Recommendation**: Remove - should use button group spacing instead

#### hero.css (Lines 172-180)
```css
.hero-actions .btn-group {
  flex-direction: column;
  gap: var(--space-4);
}

.hero-actions .btn-group .btn {
  width: 100%;
  max-width: 100%;
}
```
**Issue**: Overrides button group behavior specifically for hero
**Impact**: Different button group behavior in hero vs. rest of site
**Recommendation**: Keep if intentional, but document why hero needs different behavior

#### navigation.css (Lines 278-281)
```css
.navbar-collapse .ms-auto .btn {
  width: 100%;
  text-align: center;
}
```
**Issue**: Overrides button width in mobile navigation
**Impact**: Buttons behave differently in navbar vs. other locations
**Recommendation**: Use `.btn--full-mobile` modifier class instead

#### projects.css (Lines 74-79)
```css
.projects-thumb .btn--badge,
.project-card .btn--badge {
  max-width: 100%;
  word-wrap: break-word;
  white-space: normal;
}
```
**Issue**: Badge button overrides for mobile
**Impact**: Badge buttons behave differently on project cards
**Recommendation**: Move to buttons.css as `.btn--badge` responsive styles

---

### 2. Duplicate :root Definitions

**Problem**: CSS variables defined in multiple files, causing maintenance issues and potential override conflicts.

**Files with :root definitions:**
- `css/main.css` (line 21) - Compiled from components
- `css/main.css` (line 441) - Duplicate :root block!
- `css/critical.css` (line 9) - Subset for critical CSS
- `css/base/fallbacks.css` (line 10) - Fallback values
- `css/base/variables.css` (line 4) - **CANONICAL SOURCE**

**Issue**: Multiple :root blocks mean variables could be redefined/overwritten
**Impact**: Unpredictable variable values, difficult debugging
**Recommendation**:
1. Only keep variables.css as source
2. Ensure build script only includes it once in main.css
3. Remove duplicates from fallbacks.css (use @supports instead)

---

### 3. Component-Specific Overrides Creating Fragility

**Pattern Found**: Components override global button styles instead of using modifiers

**Examples:**
1. Hero overrides button groups
2. Navigation overrides button width
3. Projects overrides badge buttons

**Problem**:
- Hard to predict button behavior in different contexts
- Breaking changes when modifying buttons.css
- Developers must check multiple files to understand button behavior

**Better Approach**:
- Use modifier classes (`.btn--full`, `.btn--stacked`)
- Keep ALL button logic in buttons.css
- Components only add layout/positioning (not button internals)

---

## 🔧 Recommended Fixes

### Priority 1: Remove Dangerous Overrides

**hero.css line 184-186** - DELETE THIS:
```css
/* REMOVE - causes alignment issues */
.site-header .btn {
  margin-top: var(--space-3);
}
```

### Priority 2: Consolidate Button Overrides

**Move to buttons.css:**
```css
/* Mobile badge button responsive behavior */
@media (width <= 480px) {
  .btn--badge {
    max-width: 100%;
    word-wrap: break-word;
    white-space: normal;
  }
}
```

**Then remove from projects.css lines 74-79**

### Priority 3: Fix Variable Duplication

**In build-main-css.sh**, verify variables.css is only included ONCE:
```bash
# Check current includes
grep -n "variables.css" scripts/build-main-css.sh
```

**In main.css**, verify only ONE :root block exists after build

### Priority 4: Use Modifier Classes

**navigation.css** - Instead of:
```css
.navbar-collapse .ms-auto .btn {
  width: 100%;
}
```

Use in HTML:
```html
<a href="#" class="btn btn--primary btn--full-mobile">Link</a>
```

---

## 📊 Impact Assessment

**Current State**:
- 4+ files modifying button behavior
- 5+ :root definitions across files
- Unpredictable button behavior in different contexts
- Difficult to debug alignment/spacing issues

**After Cleanup**:
- 1 file (buttons.css) controls all button behavior
- 1 canonical :root definition (variables.css)
- Predictable button behavior site-wide
- Easy debugging and maintenance

---

## ✅ Action Plan

1. **Immediate** (fixes alignment bug):
   - Remove `.site-header .btn` margin from hero.css

2. **Short-term** (prevent future conflicts):
   - Move badge button responsive styles to buttons.css
   - Replace width overrides with modifier classes

3. **Medium-term** (architectural cleanup):
   - Audit and remove duplicate :root blocks
   - Document which components can override buttons (if any)
   - Create style guide for when overrides are acceptable

---

## 🎯 Prevention Strategy

**Rule**: Components should ONLY add:
- Layout (flexbox, grid positioning)
- Spacing (margin, gap between elements)
- Context-specific positioning

**Components should NEVER modify**:
- Button internals (padding, height, text styles)
- Button colors or states
- Button behavior (unless using documented modifiers)

**Exception**: Responsive overrides allowed ONLY in buttons.css

---

**Status**: Audit complete - awaiting approval to proceed with fixes
