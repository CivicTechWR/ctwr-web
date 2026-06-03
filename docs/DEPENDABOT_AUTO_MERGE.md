# Dependabot Auto-Merge Setup

This PR enables automatic merging of Dependabot PRs for minor and patch updates, following [GitHub's official automation guide](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/automating-dependabot-with-github-actions).

## What's Included

### New Workflow `.github/workflows/dependabot-auto-merge.yml`
- Uses `dependabot/fetch-metadata` (SHA-pinned to v2.5.0) to get update type
- Auto-approves Dependabot PRs for minor/patch updates
- Enables auto-merge after approval
- Uses `pull_request` trigger (not `pull_request_target`)
- Only runs for `dependabot[bot]` actor
- Workflow-level permissions locked to `{}` — write access scoped to the job only

## Required Repository Settings

⚠️ **Action Required**: A repository admin needs to enable auto-merge in GitHub settings:

1. Go to **Settings** → **General**
2. Scroll to **Pull Requests** section
3. Check ✅ **Allow auto-merge**
4. Recommended additional settings:
   - ✅ **Allow squash merging**
   - ✅ **Automatically delete head branches**

## How It Works

1. Dependabot creates a PR for a minor or patch update
2. The `dependabot-auto-merge` workflow runs on `pull_request` event
3. Workflow fetches metadata to determine update type
4. If minor/patch update:
   - Workflow auto-approves the PR
   - Workflow enables auto-merge with squash
5. Once all required CI checks pass, the PR auto-merges
6. Branch is automatically deleted (if setting enabled)

## Benefits

- ✅ Reduces manual review overhead for safe updates
- ✅ Keeps dependencies up-to-date automatically
- ✅ Only applies to minor/patch (backwards-compatible changes)
- ✅ Still requires all CI checks to pass before merging
- ✅ Major updates still require manual review
- ✅ Follows GitHub's recommended automation pattern

## Existing Dependabot PRs

After this PR merges and auto-merge is enabled in repository settings, manually enable auto-merge on existing Dependabot PRs that have passed CI:

```bash
# For each passing Dependabot PR
gh pr review --approve <PR_NUMBER>
gh pr merge <PR_NUMBER> --auto --squash
```
## Testing

After enabling auto-merge in repository settings:
1. Trigger a Dependabot PR (or wait for the next scheduled run)
2. Verify the workflow runs and approves it
3. Verify auto-merge is enabled
4. Verify it merges automatically after all CI checks pass

## Security Considerations

- Uses `pull_request` trigger (not `pull_request_target`) for safety
- Only runs when actor is `dependabot[bot]`
- Requires all branch protection rules to pass before merging
- Only auto-merges semver-minor and semver-patch updates
