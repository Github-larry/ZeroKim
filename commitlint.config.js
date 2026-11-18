export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "security",
        "test",
        "docs",
        "refactor",
        "chore",
        "ci",
        "build",
        "perf",
        "revert",
        "style",
      ],
    ],
  },
};
