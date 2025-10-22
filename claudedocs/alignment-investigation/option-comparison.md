# About Section Alignment - 3 Option Comparison

**Testing Date:** October 20, 2025
**Viewport:** 1200px width
**Problem:** About section text and image columns not visually aligned despite `align-items: center`

---

## Test Results Summary

| Option | Approach | Text Height | Image Height | Top Difference | Result |
|--------|----------|-------------|--------------|----------------|---------|
| **Option 1** | Remove `.flow` from text | 655px | 360px | **147px** | ❌ FAILED |
| **Option 2** | Change to `.flow-tight` (12px) | 647px | 360px | **143px** | ❌ FAILED |
| **Option 3** | Add `.flow` to image column | 715px | 360px | **177px** | ❌ FAILED |

---

## Option 1: Remove `.flow` Class

**Change:** `<div class="about-thumb flow">` → `<div class="about-thumb">`

**Measurements:**
- Text column: top=1175px, height=655px
- Image column: top=1323px, height=360px
- **Misalignment: 147px**

**Why it failed:** Removing spacing reduced text height from 715px to 655px, but the image still sits 147px lower due to `align-items: center` centering the containers at their midpoints.

---

## Option 2: Use `.flow-tight` (12px spacing)

**Change:** `<div class="about-thumb flow">` → `<div class="about-thumb flow-tight">`

**Measurements:**
- Text column: top=1175px, height=647px
- Image column: top=1319px, height=360px
- **Misalignment: 143px**

**Why it failed:** Reducing spacing from 48px to 12px made text slightly shorter (647px vs 655px), but only improved alignment by 4px. Still 143px misaligned.

---

## Option 3: Add `.flow` to Image Column

**Change:** Added `<div class="flow">` wrapper around picture element

**Measurements:**
- Text column: top=1175px, height=715px
- Image column: top=1353px, height=360px
- **Misalignment: 177px**

**Why it failed:** The `.flow` class only adds margins between multiple children (`.flow>*+*`). With only one child (picture element), it has no effect. This is actually the same as the original state.

---

## Root Cause Analysis

### The Real Problem

`align-items: center` **IS working correctly** - it's centering the flex containers at their midpoints.

But the containers have very different heights:
- **Text column:** 715px tall (h3 + 2 paragraphs + 48px spacing × 2)
- **Image column:** 360px tall (just the image)

When you center items with a **355px height difference**, the taller item's top edge sits **177px higher** than the shorter item.

### Visual Impact

```
Text Column (715px)          Image Column (360px)
┌─────────────┐
│ H3          │ ← starts 177px higher
│             │
│ Paragraph 1 │              ┌─────────────┐
│             │              │             │
│ Paragraph 2 │ ← CENTER →  │   Image     │ ← CENTER
│             │              │             │
│ Link        │              └─────────────┘
│             │
└─────────────┘ ← ends 177px lower
```

The **MIDPOINTS** align perfectly, but the **CONTENT** looks misaligned.

---

## Next Investigation

### Hypothesis: `align-items: start` might be the solution

Instead of centering containers at midpoints, align their **top edges**.

```css
.row {
  align-items: start; /* instead of align-items: center */
}
```

This would make:
- Text top: 1175px
- Image top: 1175px
- **Misalignment: 0px** ✅

### Trade-off

- ✅ **Pro:** Visual content alignment at the top
- ❌ **Con:** May not look centered if image is significantly taller than text (not the case here)

---

## Screenshots

- Option 1: `/tmp/option1-alignment.png`
- Option 2: `/tmp/option2-alignment.png`
- Option 3: `/tmp/option3-alignment.png`

---

## Recommendation

**Test Option 4: Change `align-items: center` to `align-items: start`**

This addresses the root cause (midpoint vs top-edge alignment) rather than trying to manipulate container heights.
