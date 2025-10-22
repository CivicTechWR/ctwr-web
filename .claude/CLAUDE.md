# CTWR Web - Non-Developer Frontend Config

**Project:** Jekyll static site with Bootstrap 4.1.3
**Your Goal:** Fix web design issues without breaking things
**Claude's Job:** Make frontend changes safe and visual

---

## 🎯 Your Simple Workflow

When you want to change layout, styling, or design:

1. **Describe what you want visually** - Claude will handle the technical details
2. **Claude tests it first** - Uses browser automation to verify it works
3. **You approve** - See screenshots before changes go live
4. **Claude commits** - Clean, tested, documented changes

---

## 🛡️ Safety Rules (Claude Enforces Automatically)

### BEFORE Making Changes
- **Always screenshot current state** (Playwright)
- **Check what CSS applies** (Chrome DevTools)
- **Test on mobile, tablet, desktop** (responsive testing)

### DURING Changes
- **Never use `!important`** - Fix specificity properly
- **No inline styles** - All CSS in component files
- **Match Bootstrap patterns** - Don't fight the framework

### AFTER Changes
- **Visual regression test** - Compare before/after
- **Accessibility check** - Contrast, alt text, ARIA
- **Performance check** - Load time < 2s
- **Mobile test** - Must work on phone screens

---

## 🚀 High-Impact MCP Servers for This Project

Claude automatically activates these for frontend work:

### **Playwright** (Browser Testing)
- Test layout changes before committing
- Screenshot responsive breakpoints
- Verify forms and navigation work
- Catch visual regressions early

### **Chrome DevTools** (CSS Debugging)
- Inspect what CSS is actually applied
- Find specificity conflicts
- Debug layout issues
- Performance profiling

### **Magic** (UI Components)
- Generate Bootstrap-compatible components
- Ensure accessibility built-in
- Modern responsive patterns

### **CSS MCP** (Style Analysis)
- Analyze CSS complexity
- Find unused styles
- Check browser compatibility
- Optimize file size

---

## 💡 Common Design Tasks (Simple Commands)

### Fix Layout Issues
```
"The hero section is broken on mobile"
→ Claude: Screenshots current state → Uses DevTools to debug → Tests fix on all screens → Shows you before/after
```

### Add New Component
```
"Add a call-to-action button in the hero section"
→ Claude: Uses Magic to generate Bootstrap button → Tests placement → Checks contrast → Commits with screenshot
```

### Debug CSS Conflicts
```
"The navigation menu overlaps the content"
→ Claude: DevTools inspection → Finds conflicting z-index → Fixes specificity → Tests across breakpoints
```

### Responsive Issues
```
"The footer looks weird on iPad"
→ Claude: Playwright tablet test → Screenshots issue → Adjusts media queries → Validates on all devices
```

---

## 🎨 Design System Reference

**Colors:**
- Primary: `#007bff` (Bootstrap blue)
- Success: `#28a745`
- Danger: `#dc3545`
- Dark: `#343a40`

**Spacing Scale:** (Bootstrap standard)
- `0.25rem` (4px) - `.p-1`, `.m-1`
- `0.5rem` (8px) - `.p-2`, `.m-2`
- `1rem` (16px) - `.p-3`, `.m-3`
- `1.5rem` (24px) - `.p-4`, `.m-4`

**Breakpoints:**
- Mobile: < 576px
- Tablet: 576px - 768px
- Desktop: > 768px

---

## 📦 Component Files (Where CSS Lives)

```
css/
├── components/
│   ├── navigation.css    ← Header/menu
│   ├── hero.css         ← Top banner
│   ├── buttons.css      ← All buttons
│   ├── footer.css       ← Footer
│   └── [component].css  ← Other components
├── pages/
│   ├── about.css        ← About page specific
│   └── projects.css     ← Projects page specific
└── style.css            ← Main imports
```

**Rule:** Only edit the specific component file you need. Don't touch `style.css`.

---

## ⚡ Performance Targets

- **CSS Size:** < 100 KB total
- **Page Load:** < 2 seconds
- **Mobile Score:** > 90 (Lighthouse)
- **Memory:** < 50 MB (Chrome)

Claude will **block commits** that violate these targets.

---

## 🚨 Emergency Rollback

If something breaks:
```bash
git restore .
bundle exec jekyll clean
bundle exec jekyll serve
```

Claude will help you recover and explain what went wrong.

---

## 📸 Visual Testing Workflow

Every layout change includes:

1. **Before screenshot** (current state)
2. **Code change** (targeted fix)
3. **After screenshot** (new state)
4. **Comparison** (side-by-side)
5. **Mobile test** (responsive check)
6. **Commit** (if approved)

---

## 🎓 Learning Mode

When you ask "why does this work?", Claude will:
- Explain CSS specificity
- Show DevTools inspection process
- Teach Bootstrap grid system
- Demonstrate responsive patterns

**Goal:** Make you more confident over time, not more dependent.

---

## 🔄 Typical Session

```
You: "The spacing in the hero section looks off"

Claude:
1. Screenshots current hero section (desktop + mobile)
2. Uses DevTools to inspect applied styles
3. Identifies spacing issue: margin vs padding conflict
4. Proposes fix in css/components/hero.css
5. Tests fix on all breakpoints
6. Shows before/after screenshots
7. Runs performance check
8. Commits if you approve

You: "Looks good!"

Claude: ✅ Committed with visual proof
```

---

## 🎯 Key Principles

1. **Visual First** - You approve based on what you see, not code
2. **Test Before Commit** - Every change validated automatically
3. **Bootstrap Native** - Work with framework, not against it
4. **Component Focused** - One component file at a time
5. **Mobile Mandatory** - Must work on phone screens
6. **Performance Budget** - Load time and size limits enforced

---

**Last Updated:** 2025-10-19
**Your Advantage:** Claude handles the technical complexity. You focus on the design vision.
