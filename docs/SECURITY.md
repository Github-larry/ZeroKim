# Security status

Honest status table. Nothing here is claimed beyond what has been run. Last updated: M1.

| Control                                        | State                                               |
| ---------------------------------------------- | --------------------------------------------------- |
| `.env` excluded from Git                       | Implemented (.gitignore). Not independently tested. |
| Secret scanning in CI (gitleaks)               | Configured; NOT TESTED until first push to GitHub   |
| Dependency audit in CI                         | Configured; see docs/TESTING.md for local result    |
| Dependency review in CI                        | Configured; availability on private repos UNKNOWN   |
| Lockfile and exact version pins                | Implemented                                         |
| Package-boundary enforcement                   | Implemented and tested                              |
| Everything in SEC-02 to SEC-12, SEC-14, SEC-15 | NOT STARTED                                         |

Known gaps: GitHub Actions are pinned to major tags, not commit SHAs. Independent security review: not done.
