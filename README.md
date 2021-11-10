# Tauri Smooth Resize

## Usage
1. Make sure you have 

## Tauri `window.innerSize()` bug
There's a bug in Tauri `1.0.0-beta.8` that causes it to return old values for `window.innerSize()` after the user resizes a window. It works correctly in the `next` branch. You can specify a specific commit as a dependency in `Cargo.toml` like this:
```toml
[dependencies]
tauri = { git = "https://github.com/tauri-apps/tauri", rev = "f8b98ed", features = ["api-all"] }
```

## Dev instructions

### Get started

1. Install Node.js (v14 works)
2. Install Rust (v1.50 works)
3. Follow the [Tauri setup guide](https://tauri.studio/en/docs/getting-started/intro)
4. Run `npm install`
5. Run the example:
    - `cd example`
    - `npm install`
    - `npm run dev`

### Commands

- `npm run lint`: Lint
