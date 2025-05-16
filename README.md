# git-rollback README

Quickly rollback file changes.

## Usage

1. Open any file that has been modified in editor;
2. Press `Cmd+R Cmd+R` to rollback file.

## Internal

Rollback changes on file:

- For untracked file, use `git clean -fx <file>`
- For tracked file, use `git restore -WS <file>`

## Requirements

- git >= 2.23
