# tauri-smooth-resize

## Tauri `window.innerSize()` bug
There's a bug in Tauri `1.0.0-beta.8` that causes it to return old values for `window.innerSize()` after the user resizes a window. It works correctly in the `next` branch. You can specify a specific commit as a dependency in `Cargo.toml` like this:
```toml
[dependencies]
tauri = { git = "https://github.com/tauri-apps/tauri", rev = "f8b98ed", features = ["api-all"] }
```
