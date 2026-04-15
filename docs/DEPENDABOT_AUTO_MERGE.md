# Dependabot Auto-Merge Setup

This PR enables automatic merging of Dependabot PRs for minor and patch updates.

## What's Included

### 1. Updated `.github/dependabot.yml`
- Added `groups` configuration for npm, bundler, and GitHub Actions
- Groups minor and patch updates together
- Auto-merge will only apply to these update types
- Major updates still require manual review

### 2. New Workflow `.github/workflows/dependabot-auto-merge.yml`
- Auto-approves Dependabot PRs for minor/patch updates
- Enables auto-merge after CI passes
- Only runs for `dependabot[bot]` actor

## Required Repository Settings

⚠️ **Action Required**: A repository admin needs to enable auto-merge in GitHub settings:

1. Go to **Settings** → **General**
2. Scroll to **Pull Requests** section
3. Check ✅ **Allow auto-merge**
4. Optionally, also check:
   - ✅ **Allow squash merging** (recommended)
   - ✅ **Automatically delete head branches**

## How It Works

1. Dependabot creates a PR for a minor or patch update
2. The `dependabot-auto-merge` workflow runs:
   - Checks if the update is minor or patch
   - Auto-approves the PR
   - Enables auto-merge with squash
3. Once all CI checks pass, the PR auto-merges
4. Branch is automatically deleted (if setting enabled)

## Benefits

- ✅ Reduces manual review overhead for safe updates
- ✅ Keeps dependencies up-to-date automatically
- ✅ Only applies to minor/patch (backwards-compatible changes)
- ✅ Still requires CI to pass before merging
- ✅ Major updates still require manual review

## Existing Dependabot PRs

After this PR merges and auto-merge is enabled in settings, you can manually enable auto-merge on existing Dependabot PRs that have passed CI:

```bash
# For each passing Dependabot PR
gh pr merge <PR_NUMBER> --auto --squash
```

Or the workflow will automatically handle new Dependabot PRs going forward.

## Testing

After enabling auto-merge in repository settings:
1. Wait for the next Dependabot PR to be created
2. Verify the workflow runs and approves it
3. Verify auto-merge is enabled
4. Verify it merges automatically after CI passes

## Related PRs

- #74, #73, #72, #71, #69, #68, #67, #66, #65 - Existing Dependabot PRs that can use auto-merge
