# Changelog

All notable changes to this project are documented in this file.

## [1.3.0] - 2026-07-04

### Added
- Cross-browser support for Chrome (111+) and Firefox (128+) via `world: "MAIN"` injection.
- Automatic `rweb_age_assurance_flow_enabled` override on page load.
- Optional selfie upload helper via toolbar click.

### Changed
- Replaced DOM `script` injection with manifest-declared main-world content scripts (CSP-safe on x.com).
- Expanded host match patterns to include `*.x.com` and `*.twitter.com`.
