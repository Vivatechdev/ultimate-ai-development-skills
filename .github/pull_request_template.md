## Description
<!-- Provide a clear summary of the changes introduced by this PR. -->

## Type of Change
- [ ] New Skill (`.agents/skills/<new-skill>/`)
- [ ] Enhancement to Existing Skill
- [ ] Bug Fix / Flakiness Elimination in Testbed
- [ ] Documentation Update
- [ ] CI / Automation Improvement

## Verification Checklist
- [ ] Follows the open Agent Skills specification (`SKILL.md` with valid YAML frontmatter).
- [ ] Directory name is lowercase and hyphenated, matching the frontmatter `name`.
- [ ] Contains all 10 standardized sections.
- [ ] Includes supporting `references/` and a working `examples/` practical testbed.
- [ ] All inter-file markdown links are relative POSIX paths (no absolute `C:\Users\` or `file:///` URIs).
- [ ] Contains zero proprietary, confidential, or sensitive personal data.
- [ ] Executed `node scripts/validate-library.js` locally with **0 errors and 100% passing tests**.

## Test Results
```text
<!-- Paste output from node scripts/validate-library.js -->
```

