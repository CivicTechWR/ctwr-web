# Desktop Alignment & Image Consistency Issues

## Problem Statement
On larger screens (≥768px), images and text content are not properly aligned. Additionally, images lack consistent presentation across the site. These issues need to be fixed WITHOUT breaking the mobile layout we just fixed.

## Critical Constraint
⚠️ **DO NOT BREAK MOBILE**: The mobile centering issue was just resolved with `box-sizing: border-box`. Any changes MUST maintain mobile functionality (375px viewport, no horizontal scroll).

## Issues Identified

### 1. Weekly Hacknights Section - Poor Image/Text Alignment
**Location**: index.html - "Weekly hacknights. Every Wednesday." section

**Problem**:
- Image on left, text on right
- On larger screens, vertical alignment is off
- Image and text don't align at the same baseline/center
- Creates unbalanced visual appearance

**Expected**:
- Image and text should be vertically centered relative to each other
- Equal visual weight on both sides
- Professional, balanced layout on desktop/tablet

### 2. Featured Projects Section - Card Alignment Issues
**Location**: index.html - "Featured Projects" section (CouncilBot, ConnectedKW, Waterloo Region Votes cards)

**Problem**:
- Project cards don't align properly on larger screens
- Inconsistent spacing or positioning
- Cards may not be properly centered or distributed

**Expected**:
- Cards should align in a clean grid on larger screens
- Equal spacing between cards
- Cards should be vertically aligned (tops/bottoms at same level)
- Responsive: 1 column mobile → 2-3 columns desktop

### 3. Meeting Section Image - Inconsistent Presentation
**Location**: Multiple pages (index.html, about.html, projects.html)

**Problem**:
- Meeting section image is presented differently than other images on the site
- Same image appears on multiple pages but lacks consistent styling
- Doesn't match the presentation pattern of other images (hero, about, hacknights sections)

**Expected**:
- Consistent image presentation across all instances
- Should match the styling/presentation pattern used for other images
- Same treatment on index, about, and projects pages
- Maintain aspect ratio and responsive behavior

## Investigation Required

### 1. Audit Current Breakpoints
Check all `@media` queries for:
- Desktop breakpoints (≥992px, ≥1200px)
- Tablet breakpoints (≥768px)
- Any conflicting responsive rules

### 2. Review Grid/Flexbox Usage
For each problematic section:
- Check if using Bootstrap grid properly
- Verify flexbox alignment properties
- Look for conflicting CSS rules
- Check for missing alignment classes

### 3. Image Presentation Patterns
Compare how images are presented across:
- Hero section (likely the reference pattern)
- About section
- Hacknights section
- Projects section
- Meeting section

Identify:
- Common CSS classes/patterns
- Wrapper structures
- Responsive image handling
- Aspect ratio preservation

## Files to Review

### HTML Files
- `/index.html` - All three problem sections
- `/about.html` - Meeting section image usage
- `/projects.html` - Meeting section image usage

### CSS Files (Likely Relevant)
- `/css/components/hero.css` - Reference for image presentation
- `/css/components/meeting.css` - Meeting section styles
- `/css/components/projects.css` - Project cards styles
- `/css/pages/about.css` - About page specific styles
- `/css/main.css` - Compiled CSS (will need rebuilding after changes)

### Build Process
After making changes:
1. Run `npm run build:main-css` to rebuild main.css
2. Copy to _site: `cp css/main.css _site/css/main.css`
3. Verify in browser at multiple breakpoints

## Success Criteria

### Desktop/Tablet (≥768px)
1. ✅ Hacknights image and text vertically centered to each other
2. ✅ Project cards aligned in clean grid with equal spacing
3. ✅ Meeting section image uses consistent presentation pattern
4. ✅ All images maintain aspect ratio and don't distort

### Mobile (375px) - MUST NOT BREAK
1. ✅ No horizontal scroll (scrollWidth === 375px)
2. ✅ Content remains centered
3. ✅ Single column layout works properly
4. ✅ All existing mobile fixes remain intact

### Cross-Page Consistency
1. ✅ Meeting section image styled identically on index, about, projects
2. ✅ Image presentation pattern matches site-wide standards
3. ✅ Responsive behavior consistent across all pages

## Testing Requirements

**Test at these breakpoints**:
- 375px (mobile - must not break!)
- 768px (tablet)
- 992px (desktop)
- 1200px (large desktop)

**For each breakpoint, verify**:
- No horizontal scroll
- Proper alignment of images/text
- Consistent spacing
- No layout breaks or overlaps

## Recommended Approach

### Phase 1: Investigation
1. Take screenshots of all three issues at 992px and 1200px
2. Inspect computed styles for alignment properties
3. Identify what's different between working sections (hero, about) and broken sections
4. Document the pattern that should be applied

### Phase 2: Fix Hacknights Alignment
1. Review hero section for vertical centering pattern
2. Apply same alignment approach to hacknights section
3. Test at all breakpoints
4. Verify mobile not broken

### Phase 3: Fix Project Cards
1. Review Bootstrap grid usage for cards
2. Check for missing flexbox alignment classes
3. Ensure equal spacing with proper gap/margin utilities
4. Test responsive behavior from mobile → desktop

### Phase 4: Standardize Meeting Image
1. Identify the correct image presentation pattern (likely from hero)
2. Apply to meeting section on index.html
3. Apply to meeting section on about.html
4. Apply to meeting section on projects.html
5. Verify consistency across all three pages

### Phase 5: Comprehensive Testing
1. Test all changes at all breakpoints
2. Verify mobile still works (375px, no scroll)
3. Take before/after screenshots
4. Document changes made

## Tools Available

- Playwright browser automation (http://localhost:4000)
- Browser DevTools for responsive testing
- Jekyll dev server already running
- All source files in `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/`

## Agent Instructions

Work in: `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/`

1. Read this specification thoroughly
2. Take "before" screenshots at multiple breakpoints
3. Systematically investigate each issue
4. Implement fixes following the site's existing patterns
5. Rebuild CSS and deploy to _site
6. Test comprehensively at all breakpoints
7. Take "after" screenshots
8. Document all changes made

**Priority**: Desktop alignment improvements WITHOUT breaking mobile layout.

**Deliverables**:
- Fixed alignment on larger screens
- Consistent image presentation
- Working mobile layout (no regressions)
- Before/after screenshots
- Documentation of changes
