<p align="center">
<table>
<tr>
<td valign="middle">
<pre style="margin:0; background:transparent; border:none;">
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣷⣶⣴⣾⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣀⣤⣤⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣤⣤⣄⠀⠀⠀⠀
⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀
⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀
⢀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⢈⢻⣿⣿⣿⣿⣿⣿⣿
⢿⣿⣿⣿⣿⣿⣿⣿⡿⠻⣿⣿⣿⣿⣿⣿⣿⠟⠁⠠⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿
⢈⣿⣿⣿⣿⣿⣿⣯⡁⠀⠈⠻⣿⣿⣿⠟⠁⢀⣐⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⡁
⣾⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠈⠛⠁⠂⢔⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⢐⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁
⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀
⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀
⠀⠀⠀⠀⠉⠛⠛⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠛⠛⠉⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⠿⢿⡻⠿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀
</pre>
</td>
<td valign="middle">
<h1 style="margin:0; padding-left:20px;">xbypass</h1>
</td>
</tr>
</table>
</p>

<p align="center">
  <a href="https://x.com/Itsvurzum"><img src="https://img.shields.io/badge/X-@Itsvurzum-000000?style=for-the-badge&logo=x&logoColor=white" alt="X / Twitter"></a>
  <a href="https://github.com/Animus-exe/C-Password-Generator"><img src="https://img.shields.io/badge/Repo-C--Password--Generator-24292f?style=for-the-badge&logo=github&logoColor=white" alt="C-Password-Generator"></a>
  <a href="https://github.com/Animus-exe/ORC-Rust-Torrent-Client"><img src="https://img.shields.io/badge/Repo-ORC--Rust--Torrent--Client-24292f?style=for-the-badge&logo=github&logoColor=white" alt="ORC-Rust-Torrent-Client"></a>
  <a href="https://github.com/Animus-exe/PenguinRadio"><img src="https://img.shields.io/badge/Repo-PenguinRadio-24292f?style=for-the-badge&logo=github&logoColor=white" alt="PenguinRadio"></a>
  <a href="https://github.com/Animus-exe/V-Companion"><img src="https://img.shields.io/badge/Repo-V--Companion-24292f?style=for-the-badge&logo=github&logoColor=white" alt="V-Companion"></a>
</p>

<p align="center">By <strong>vurzum</strong></p>

Browser extension for [x.com](https://x.com) (and legacy `twitter.com` domains) that disables the web age-assurance prompt by overriding a client-side feature flag. It also includes an optional selfie upload helper for account-level age verification.

Works in **Chrome** (111+) and **Firefox** (128+).

## How it works

### Primary mode (automatic)

On page load, `hook.js` runs at `document_start` in the page's main JavaScript world and intercepts `window.__INITIAL_STATE__`. When X sets feature switches, the extension forces:

```js
featureSwitch.customOverrides.rweb_age_assurance_flow_enabled = false
```

That prevents the adult-content age-assurance flow from appearing in the web client.

### Alternative mode (toolbar click)

Click the extension icon on an x.com tab to inject the selfie upload helper (`inject.js`). That script:

1. Hooks `XMLHttpRequest` to capture auth headers from `/graphql/viewer_context.json`
2. Uploads a JPEG selfie via `upload.x.com`
3. Calls X's GraphQL age-verification endpoints
4. Polls until verification completes

This path can mark your account as age-verified (useful on mobile), but it is more invasive: **XHR on that tab is blocked until you reload the page.**

## Installation

### Chrome / Chromium / Edge

1. Clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the repository folder.

### Firefox

1. Clone this repository.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on** and choose `manifest.json`.

For a permanent Firefox install you will need to sign the extension through Mozilla Add-ons or use Firefox Developer Edition with `xpinstall.signatures.required` disabled. Update `browser_specific_settings.gecko.id` in `manifest.json` before publishing under your own name.

## Usage

### Age-assurance bypass (default)

1. Install the extension.
2. Open [https://x.com](https://x.com) while logged in.
3. Browse normally. The age-assurance prompt should not appear.

If you still see the prompt, hard-refresh the page (`Ctrl+Shift+R` / `Cmd+Shift+R`) so the hook runs before `__INITIAL_STATE__` is set.

### Selfie verification helper

1. Open your timeline on x.com.
2. Click the extension icon.
3. Wait for **Got headers! Pick an image now** in the terminal overlay. If it stays on "Waiting for authentication headers", scroll the timeline.
4. Click **Pick a selfie image** and choose a **JPEG** photo.
5. On success, click **Reload page**.

## Warnings

- **Use at your own risk.** This project is not affiliated with, endorsed by, or supported by X Corp.
- You are responsible for complying with X's Terms of Service and applicable laws in your jurisdiction.
- The selfie helper may occasionally leave an account in a bad state ("You have already verified your age. Please restart your app to continue"). Reports suggest this can happen even with valid-looking images.
- For the selfie path, use a real adult photo in **JPEG** format only. PNG and obviously invalid images appear more likely to cause issues.
- GraphQL operation IDs in `inject.js` are hardcoded and may break when X updates its web client.
- The primary bypass is client-side only. X may change `__INITIAL_STATE__` or feature-switch behavior at any time.

## Project layout

```
xbypass/
  manifest.json    Extension manifest (MV3)
  hook.js          Automatic feature-flag override
  background.js    Toolbar click handler for selfie helper
  inject.js        Selfie upload / verification flow
  icons/           Extension icons
```

## Permissions

| Permission | Why |
|---|---|
| `scripting` | Inject the selfie helper on toolbar click |
| `activeTab` | Run only on the tab you interact with |
| `host_permissions` for x.com / twitter.com / upload.x.com | Content scripts and API calls |

The extension requests no `cookies`, `storage`, or broad `<all_urls>` access.

## Building a release zip

From the repository root:

```sh
zip -r xbypass.zip . -x '*.git*' -x '.DS_Store' -x 'xbypass.zip'
```

Upload the zip to the Chrome Web Store or sign it for Firefox distribution.

## Contributing

Issues and pull requests are welcome. Keep changes small and focused. Do not commit signing keys, personal Firefox extension IDs, or packaged `.crx` / `.xpi` files.

## License

MIT — Copyright (c) 2026 vurzum. See [LICENSE](LICENSE).
