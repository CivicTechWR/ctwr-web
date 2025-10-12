# Scripts Directory

This directory contains utility scripts for the CTWR website.

## Available Scripts

### `setup-preview.sh`
Creates a preview branch for testing changes before merging to main.

**Usage:**
```bash
# Make sure you're on the perf/perf-improvements branch
git checkout perf/perf-improvements

# Run the setup script
./scripts/setup-preview.sh
```

**What it does:**
1. Builds the Jekyll site
2. Creates a preview branch with the built site
3. Pushes it to GitHub
4. Provides you with the preview URL

**Preview URL format:**
`https://civictechwr.github.io/ctwr-web/preview-perf-improvements/`

**Cleanup:**
```bash
# Remove the preview branch locally and remotely
git branch -D preview-perf-improvements
git push origin --delete preview-perf-improvements
```

## Notes

- The preview branch is separate from your main branch
- It only contains the built `_site` directory
- You can create multiple preview branches for different features
- Remember to clean up preview branches when done
