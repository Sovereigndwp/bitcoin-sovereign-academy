# BSA Paths Cleanup Notes

## Purpose

Clean the copied BSA paths workspace by separating runtime path content from support files.

## Scope

This cleanup applies only to:
- apps/bsa/source-current/paths

It does not change the live `paths/` folder.

## Support file types to separate
- markdown planning docs
- backup files

## Rule

Do not move runtime HTML path content.
Only move support and backup files out of the copied path tree.
