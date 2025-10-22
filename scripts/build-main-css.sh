#!/bin/bash

# Build main.css by concatenating all component files in the correct order
# This replaces @import statements with actual CSS content

set -e

echo "🎨 Building main.css from component files..."

# Create the main.css file by concatenating all components
cat > css/main.css << 'EOF'
/**
 * CivicTechWR Master CSS Loader
 * Built from component files in correct order for optimal loading
 *
 * Load Order:
 * 1. Base Layer - Variables, resets, typography
 * 2. Layout Layer - Grid system, utilities
 * 3. Component Layer - Reusable UI components
 * 4. Page Layer - Page-specific styles
 * 5. Utility Layer - Abstract shapes, helpers
 */

/* ==========================================================================
   BASE LAYER - Foundation styles
   ========================================================================== */

EOF

# Add base layer files
echo "/* Browser Fallbacks - For older browsers without CSS custom property support */" >> css/main.css
echo "/* These hardcoded values will be overridden by CSS custom properties in modern browsers */" >> css/main.css
cat css/base/fallbacks.css >> css/main.css

echo "" >> css/main.css
echo "/* CSS Custom Properties - Overrides fallbacks in modern browsers */" >> css/main.css
cat css/base/variables.css >> css/main.css

echo "" >> css/main.css
echo "/* Typography - Base text styles using CSS custom properties */" >> css/main.css
cat css/base/typography.css >> css/main.css

echo "" >> css/main.css
echo "/* ==========================================================================" >> css/main.css
echo "   LAYOUT LAYER - Grid system and utilities" >> css/main.css
echo "   ========================================================================== */" >> css/main.css

echo "" >> css/main.css
echo "/* Custom Bootstrap - Only includes used classes (2.7KB vs 237KB) */" >> css/main.css
cat css/bootstrap-custom.css >> css/main.css

echo "" >> css/main.css
echo "/* ==========================================================================" >> css/main.css
echo "   COMPONENT LAYER - Reusable UI components" >> css/main.css
echo "   ========================================================================== */" >> css/main.css

# Add component files
echo "" >> css/main.css
echo "/* Navigation - Header and navigation system */" >> css/main.css
cat css/components/navigation.css >> css/main.css

echo "" >> css/main.css
echo "/* Buttons - Unified button system with BEM methodology */" >> css/main.css
cat css/components/buttons.css >> css/main.css

echo "" >> css/main.css
echo "/* Hero - Main landing section */" >> css/main.css
cat css/components/hero.css >> css/main.css

echo "" >> css/main.css
echo "/* Services - What we do section */" >> css/main.css
cat css/components/services.css >> css/main.css

echo "" >> css/main.css
echo "/* Footer - Site footer */" >> css/main.css
cat css/components/footer.css >> css/main.css

echo "" >> css/main.css
echo "/* Avatar - Profile and user images */" >> css/main.css
cat css/components/avatar.css >> css/main.css

echo "" >> css/main.css
echo "/* Preloader - Loading spinner */" >> css/main.css
cat css/components/preloader.css >> css/main.css

echo "" >> css/main.css
echo "/* Icons - SVG icon styling */" >> css/main.css
cat css/components/icons.css >> css/main.css

echo "" >> css/main.css
echo "/* Featured - Featured numbers and statistics */" >> css/main.css
cat css/components/featured.css >> css/main.css

echo "" >> css/main.css
echo "/* Sponsors - Partner and sponsor logos */" >> css/main.css
cat css/components/sponsors.css >> css/main.css

echo "" >> css/main.css
echo "/* Projects - Project showcase cards */" >> css/main.css
cat css/components/projects.css >> css/main.css

echo "" >> css/main.css
echo "/* Forms - Contact forms and inputs */" >> css/main.css
cat css/components/forms.css >> css/main.css

echo "" >> css/main.css
echo "/* Organizers - Team and organizers section */" >> css/main.css
cat css/components/organizers.css >> css/main.css

echo "" >> css/main.css
echo "/* Profile - Profile cards and about section */" >> css/main.css
cat css/components/profile.css >> css/main.css

echo "" >> css/main.css
echo "/* Meeting - Meeting section and details */" >> css/main.css
cat css/components/meeting.css >> css/main.css

echo "" >> css/main.css
echo "/* Page Header - Page titles and headers */" >> css/main.css
cat css/components/page-header.css >> css/main.css

echo "" >> css/main.css
echo "/* ==========================================================================" >> css/main.css
echo "   PAGE LAYER - Page-specific styles" >> css/main.css
echo "   ========================================================================== */" >> css/main.css

echo "" >> css/main.css
echo "/* About page specific styles */" >> css/main.css
cat css/pages/about.css >> css/main.css

echo "" >> css/main.css
echo "/* Projects page specific styles */" >> css/main.css
cat css/pages/projects.css >> css/main.css

echo "" >> css/main.css
echo "/* ==========================================================================" >> css/main.css
echo "   UTILITY LAYER - Abstract shapes and helpers" >> css/main.css
echo "   ========================================================================== */" >> css/main.css

echo "" >> css/main.css
echo "/* Abstract Shapes - Decorative background elements */" >> css/main.css
cat css/abstract-shapes.css >> css/main.css

echo "" >> css/main.css
echo "/* Fonts - Self-hosted font files */" >> css/main.css
cat css/fonts.css >> css/main.css

echo "" >> css/main.css
echo "/* ==========================================================================" >> css/main.css
echo "   MAIN STYLES - Remaining styles from original style.css" >> css/main.css
echo "   ========================================================================== */" >> css/main.css

echo "" >> css/main.css
echo "/* Main stylesheet - Contains remaining styles after component extraction */" >> css/main.css
cat css/style.css >> css/main.css

echo "✅ main.css built successfully from component files!"
echo "📊 File size: $(du -h css/main.css | cut -f1)"

