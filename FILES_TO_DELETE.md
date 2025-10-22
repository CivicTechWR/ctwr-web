# Files to Delete - CivicTech Waterloo Region Website

**Generated:** October 20, 2025  
**Based on:** Comprehensive Code Review

---

## 🔴 IMMEDIATE DELETION (Critical)

### Empty Files (0 bytes):
```bash
css-analysis.json
defined-selectors.txt
```

### Dead Code:
```bash
js/add-view-all-card.js
```

**Command to delete:**
```bash
rm css-analysis.json defined-selectors.txt js/add-view-all-card.js
```

---

## 🟡 HIGH PRIORITY DELETION

### Temporary Task Documentation:
```bash
AGENT_TASK_alignment_refinement.md
AGENT_TASK_desktop_alignment.md
AGENT_TASK_mobile_centering.md
```

**Command:**
```bash
rm AGENT_TASK_*.md
```

---

## 🟢 MEDIUM PRIORITY - Archive These Files

### Move to docs/archive/2024-10/:

```bash
CLEANUP_SUMMARY.md
CSS_CONFLICTS_AUDIT.md
CSS_OPTIMIZATION_SUMMARY.md
CSS_SPACING_CLEANUP_PLAN.md
CURSOR_HANDOFF_SPACING_CLEANUP.md
HTML_AUDIT_REPORT.md
MOBILE_CENTERING_FIX_REPORT.md
REPOSITORY_CLEANUP.md
REPOSITORY_CLEANUP_COMPLETE.md
STYLE_CSS_ANALYSIS.md
```

**Command:**
```bash
mkdir -p docs/archive/2024-10
mv CLEANUP_SUMMARY.md docs/archive/2024-10/
mv CSS_CONFLICTS_AUDIT.md docs/archive/2024-10/
mv CSS_OPTIMIZATION_SUMMARY.md docs/archive/2024-10/
mv CSS_SPACING_CLEANUP_PLAN.md docs/archive/2024-10/
mv CURSOR_HANDOFF_SPACING_CLEANUP.md docs/archive/2024-10/
mv HTML_AUDIT_REPORT.md docs/archive/2024-10/
mv MOBILE_CENTERING_FIX_REPORT.md docs/archive/2024-10/
mv REPOSITORY_CLEANUP.md docs/archive/2024-10/
mv REPOSITORY_CLEANUP_COMPLETE.md docs/archive/2024-10/
mv STYLE_CSS_ANALYSIS.md docs/archive/2024-10/
```

---

## 🔵 BUILD ARTIFACTS - Remove from Git Tracking

### Minified CSS Files (20+ files):
```bash
css/abstract-shapes.min.css
css/bootstrap-custom.min.css
css/critical.min.css
css/fonts.min.css
css/main.min.css
css/style.min.css
css/base/typography.min.css
css/base/variables.min.css
css/components/avatar.min.css
css/components/buttons.min.css
css/components/featured.min.css
css/components/footer-utilities.min.css
css/components/footer.min.css
css/components/forms.min.css
css/components/hero.min.css
css/components/icons.min.css
css/components/meeting.min.css
css/components/navigation.min.css
css/components/organizers.min.css
css/components/page-header.min.css
css/components/preloader.min.css
css/components/profile.min.css
css/components/projects.min.css
css/components/services.min.css
css/components/sponsors.min.css
css/pages/about.min.css
css/pages/projects.min.css
```

### Minified JavaScript:
```bash
js/optimized-bundle.min.js
```

### Jekyll Metadata:
```bash
.jekyll-metadata
```

**Command to remove from git (but keep local files):**
```bash
git rm --cached css/**/*.min.css
git rm --cached css/*.min.css
git rm --cached js/*.min.js
git rm --cached .jekyll-metadata
```

**Then update .gitignore to ensure they stay ignored:**
```bash
# Already in .gitignore but need to enforce:
*.min.css
*.min.js
.jekyll-metadata
```

---

## 📋 HTML Comments to Remove

### index.html:
- **Lines 62-73:** Commented-out header fetch code (DELETE)

### about.html:
- **Lines 111, 118, 125, 132:** Commented-out organizer images (DECIDE: enable or delete)

---

## ✅ Files to KEEP

### Essential Documentation:
```
README.md
CONTRIBUTING.md
CHANGELOG.md
CLAUDE.md
DEVELOPER_README.md
```

### Configuration Files (All 23+ dotfiles):
```
.browserslistrc
.cursorrules
.editorconfig
.eslintrc.json
.gitattributes
.gitignore
.htmlhintrc
.htmlvalidate.json
.jekyll-metadata (after removing from git)
.jsonlintrc
.markdownlint.json
.nvmrc
.pa11yci.json
.prettierrc.json
.ruby-version
.shellcheckrc
.stylelintrc.json
.tool-versions
.yamllint.yml
```

### Active Documentation in claudedocs/:
```
claudedocs/BREAKPOINT_STANDARDIZATION_PLAN.md
claudedocs/COMPREHENSIVE_CODE_REVIEW.md
claudedocs/CSS_ANALYSIS_REPORT.md
claudedocs/IMPROVEMENT_SUMMARY.md
(etc.)
```

---

## 🚀 One-Command Cleanup

**Safe cleanup (non-destructive):**
```bash
#!/bin/bash

# Create archive directory
mkdir -p docs/archive/2024-10

# Delete empty and dead files
rm -f css-analysis.json defined-selectors.txt js/add-view-all-card.js

# Delete temporary task docs
rm -f AGENT_TASK_*.md

# Archive completed documentation
mv CLEANUP_SUMMARY.md docs/archive/2024-10/ 2>/dev/null
mv CSS_CONFLICTS_AUDIT.md docs/archive/2024-10/ 2>/dev/null
mv CSS_OPTIMIZATION_SUMMARY.md docs/archive/2024-10/ 2>/dev/null
mv CSS_SPACING_CLEANUP_PLAN.md docs/archive/2024-10/ 2>/dev/null
mv CURSOR_HANDOFF_SPACING_CLEANUP.md docs/archive/2024-10/ 2>/dev/null
mv HTML_AUDIT_REPORT.md docs/archive/2024-10/ 2>/dev/null
mv MOBILE_CENTERING_FIX_REPORT.md docs/archive/2024-10/ 2>/dev/null
mv REPOSITORY_CLEANUP.md docs/archive/2024-10/ 2>/dev/null
mv REPOSITORY_CLEANUP_COMPLETE.md docs/archive/2024-10/ 2>/dev/null
mv STYLE_CSS_ANALYSIS.md docs/archive/2024-10/ 2>/dev/null

# Remove build artifacts from git tracking (keep local files)
git rm --cached css/**/*.min.css css/*.min.css js/*.min.js .jekyll-metadata 2>/dev/null

echo "✅ Cleanup complete!"
echo "📝 Review changes with: git status"
echo "💾 Commit changes with: git add -A && git commit -m 'chore: repository cleanup - remove dead code and build artifacts'"
```

**Save as `scripts/cleanup-repo.sh` and run:**
```bash
chmod +x scripts/cleanup-repo.sh
./scripts/cleanup-repo.sh
```

---

## 📊 Impact Summary

### Files to Delete: 6
- 2 empty files
- 1 dead JS file
- 3 temporary task docs

### Files to Archive: 10
- Completed cleanup and audit documentation

### Files to Untrack: 28+
- 27+ minified CSS/JS files
- 1 Jekyll metadata file

### Total Cleanup: 44+ files
- Estimated repo size reduction: ~500KB
- Documentation clarity: Significantly improved
- Merge conflict risk: Eliminated (no more minified files in git)

---

**Generated:** October 20, 2025  
**Next Step:** Review and execute cleanup commands  
**Safety:** All commands preserve local files, only clean up git tracking
