# CivicTechWR CSS Refactoring Roadmap

**Based on:** CSS Audit Report (October 14, 2025)
**Goal:** Reduce CSS from 56KB to 40KB (-29%) while improving maintainability
**Timeline:** 8-12 days total

---

## Quick Stats

### Current State
- 2,786 total lines of CSS
- 56KB total file size
- 68 `!important` declarations
- 7 different button systems
- 30+ duplicate selectors
- 25 hard-coded color values

### Target State
- 1,800 total lines of CSS (-35%)
- 40KB total file size (-29%)
- 18 `!important` declarations (utilities only)
- 1 unified button system
- 0 duplicate selectors
- 0 hard-coded color values

---

## Phase 1: Quick Wins (Days 1-2)

### Day 1 Morning: Deduplication

**Task 1.1: Clean up critical.css**
- Remove 30+ duplicate selectors also in style.css
- Keep only true above-fold styles (navbar skeleton, hero background, preloader)
- **Target:** 8KB → 2KB (75% reduction)
- **Files:** `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/css/critical.css`
- **Effort:** 1 hour

**Task 1.2: Remove dead code**
- Delete all commented-out CSS blocks
- Remove empty media queries
- **Lines to remove:**
  - style.css:1494-1516 (commented contact form)
  - style.css:1613-1643 (commented old footer)
  - style.css:1758-1761 (commented hover)
  - style.css:2170-2182 (commented contact info)
  - style.css:1987-1997 (empty media queries)
  - style.css:2019-2023 (empty media query)
- **Savings:** 100+ lines
- **Effort:** 30 minutes

### Day 1 Afternoon: Add Design Tokens

**Task 1.3: Expand CSS variables**
- Add gray scale palette (gray-50 through gray-950)
- Add button color variants
- Add standardized border-radius tokens
- **File:** `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/css/style.css:25-56`
- **Effort:** 30 minutes

**Task 1.4: Replace hard-coded values**
- Replace 25+ hard-coded color values with variables
- Standardize border-radius values
- **Search/replace across:** style.css lines 721-1939
- **Effort:** 1.5 hours

### Day 2 Morning: Fix Specificity Wars

**Task 1.5: Remove problematic !important**
- Fix button !important declarations (lines 380-387, 934-967)
- Fix navbar !important declarations (lines 448, 469, 478, 485-492)
- Fix footer button !important (lines 783-851)
- **Strategy:** Increase specificity naturally or use proper cascade
- **Effort:** 2 hours
- **Testing:** Visual regression testing required

### Day 2 Afternoon: Standardize Media Queries

**Task 1.6: Convert to Bootstrap 4 syntax**
- Replace range syntax (`width >=`, `width <=`) with standard (`min-width:`, `max-width:`)
- Consolidate to 8 breakpoints (576px, 768px, 992px, 1200px)
- **Lines:** style.css:1943-2023, critical.css:216-228
- **Effort:** 1 hour

**Phase 1 Checkpoint:**
- Run visual regression tests
- Verify no layout breaks
- Check all 3 pages (index, about, projects)
- Lighthouse audit

---

## Phase 2: Component Consolidation (Days 3-5)

### Day 3: Unified Button System

**Task 2.1: Design new button system**
- Create BEM-based button components
- Design variants: primary, outline, outline-light
- Design modifiers: sm, lg, full
- **New file:** `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/css/components/buttons.css`
- **Effort:** 2 hours

**Task 2.2: Migrate existing buttons**
- Update HTML to use new button classes
- Remove 7 old button implementations
- **Files:** index.html, about.html, projects.html, header.html
- **Effort:** 3 hours
- **Testing:** All buttons must look identical

**Task 2.3: Update documentation**
- Document new button system
- Create usage examples
- **File:** Create `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/docs/BUTTON_SYSTEM.md`
- **Effort:** 1 hour

### Day 4-5: Footer Consolidation

**Task 2.4: Identify active footer**
- Check `_includes/footer.html` to see which footer is used
- Verify footer implementation on all pages
- **Effort:** 30 minutes

**Task 2.5: Remove unused footers**
- Keep only active footer implementation
- Remove 2 unused footer style blocks
- **Potential lines to remove:**
  - Old `.site-footer` (lines 1686-1762) - 76 lines
  - Or `.footer-redesign` (lines 720-905) - 185 lines
  - Or `.footer` (lines 1807-2023) - 216 lines
- **Savings:** 250-400 lines
- **Effort:** 2 hours

**Phase 2 Checkpoint:**
- All buttons working and consistent
- Footer displays correctly
- No visual regressions
- Code is cleaner and more maintainable

---

## Phase 3: Modular Architecture (Days 6-8)

### Day 6: Plan Module Structure

**Task 3.1: Create directory structure**
```bash
mkdir -p css/base
mkdir -p css/layout
mkdir -p css/components
mkdir -p css/utilities
```

**Task 3.2: Split variables and base styles**
- Extract to `css/base/variables.css` (lines 25-56)
- Extract to `css/base/typography.css` (lines 65-124)
- Extract to `css/base/accessibility.css` (lines 164-221)
- **Effort:** 2 hours

### Day 7: Extract Layout and Components

**Task 3.3: Extract layout modules**
- Create `css/layout/navbar.css` (lines 395-549)
- Create `css/layout/hero.css` (lines 554-1003)
- Create `css/layout/footer.css` (active footer only)
- **Effort:** 3 hours

**Task 3.4: Extract component modules**
- Create `css/components/buttons.css` (already done in Phase 2)
- Create `css/components/meeting.css` (lines 1126-1356)
- Create `css/components/cards.css` (lines 1442-1488)
- Create `css/components/sponsors.css` (lines 1074-1112)
- Create `css/components/forms.css` (lines 1521-1606)
- **Effort:** 3 hours

### Day 8: Update Imports and Test

**Task 3.5: Create new main style.css**
- Replace 2,398-line style.css with import-based structure
- Add `@import` statements for all modules
- **Effort:** 1 hour

**Task 3.6: Update HTML files**
- Ensure correct load order (critical.css → style.css)
- Verify no duplicate imports
- **Files:** index.html, about.html, projects.html
- **Effort:** 30 minutes

**Task 3.7: Comprehensive testing**
- Visual regression across all pages
- Mobile responsive testing (320px, 768px, 992px, 1200px)
- Cross-browser testing (Chrome, Firefox, Safari)
- Lighthouse performance audit
- **Effort:** 3 hours

**Phase 3 Checkpoint:**
- Modular CSS structure in place
- All pages render identically
- Improved maintainability
- Better caching (only changed modules re-download)

---

## Phase 4: Optional Enhancements (Days 9-10)

### Day 9: Component Includes

**Task 4.1: Convert meeting section to include**
- Create `_includes/meeting-section.html`
- Update index.html, about.html, projects.html
- **Benefit:** Even better DRY
- **Effort:** 1 hour

**Task 4.2: Create other reusable includes**
- Header (already done)
- Footer (already done)
- Sponsor grid
- **Effort:** 2 hours

### Day 10: Documentation

**Task 4.3: Component library documentation**
- Document all components (buttons, cards, forms, etc.)
- Create usage examples
- Add screenshots
- **File:** Create `/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/docs/COMPONENT_LIBRARY.md`
- **Effort:** 4 hours

**Task 4.4: Update CLAUDE.md**
- Update architecture section
- Document new CSS structure
- Add refactoring completion notes
- **Effort:** 1 hour

---

## Testing Checklist

After each phase, verify:

### Visual Testing
- [ ] Homepage renders correctly
- [ ] About page renders correctly
- [ ] Projects page renders correctly
- [ ] All buttons styled consistently
- [ ] Footer displays properly
- [ ] Meeting section identical across pages
- [ ] Sponsors grid displays correctly

### Responsive Testing
- [ ] Mobile (320px-575px) - all pages
- [ ] Tablet (576px-991px) - all pages
- [ ] Desktop (992px-1199px) - all pages
- [ ] Large desktop (1200px+) - all pages

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Performance Testing
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse SEO > 90
- [ ] Total CSS < 40KB

### Code Quality
- [ ] No console errors
- [ ] Valid CSS (W3C validator)
- [ ] No duplicate selectors
- [ ] All colors use variables
- [ ] Consistent media queries
- [ ] `!important` only in utilities

---

## Rollback Plan

If issues arise during refactoring:

1. **Git is your friend:**
   ```bash
   # Create checkpoint before each phase
   git add .
   git commit -m "feat: Complete Phase X of CSS refactoring"

   # If needed, rollback to previous phase
   git log --oneline  # Find commit hash
   git revert <commit-hash>
   ```

2. **Test in development:**
   - Never commit broken code
   - Test locally before pushing
   - Use feature branches for major changes

3. **Keep old CSS temporarily:**
   - Don't delete old style.css until new structure is tested
   - Rename to `style.css.backup` during migration
   - Delete only after Phase 3 is complete and tested

---

## Success Metrics

### Code Quality (Target)
- ✓ 1,800 lines of CSS (down from 2,786)
- ✓ 18 `!important` (down from 68)
- ✓ 1 button system (down from 7)
- ✓ 0 duplicate selectors (down from 30+)
- ✓ 0 hard-coded colors (down from 25)

### Performance (Target)
- ✓ 40KB total CSS (down from 56KB)
- ✓ 2KB critical CSS (down from 8KB)
- ✓ Lighthouse Performance > 90
- ✓ First Contentful Paint < 1.5s

### Maintainability (Target)
- ✓ Modular file structure (15+ focused files)
- ✓ Clear naming conventions (BEM)
- ✓ Comprehensive design tokens
- ✓ Component documentation

---

## Daily Standup Template

Use this template to track progress:

**Day X Progress:**
- **Completed:** [List tasks completed]
- **In Progress:** [Current task]
- **Blockers:** [Any issues encountered]
- **Next:** [Tomorrow's first task]
- **Tests Passed:** ✓/✗ Visual, ✓/✗ Responsive, ✓/✗ Performance

---

## Resources

### Documentation
- [CSS Audit Report](/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/docs/CSS_AUDIT_REPORT.md)
- [CLAUDE.md](/Users/andrelevesque/Projects/CTWR-Org/ctwr-web/CLAUDE.md)
- [BEM Naming Convention](http://getbem.com/naming/)
- [Bootstrap 4 Breakpoints](https://getbootstrap.com/docs/4.1/layout/grid/#grid-options)

### Tools
- [CSS Validator](https://jigsaw.w3.org/css-validator/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Roadmap Version:** 1.0
**Last Updated:** October 14, 2025
**Next Review:** After Phase 1 completion
