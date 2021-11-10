#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::env;
use tauri::{command, WindowBuilder, WindowUrl};

#[command]
fn handle_error(msg: String) {
  eprintln!("{}", msg);
  std::process::exit(1);
}
#[command]
fn finish(msg: String) {
  println!("{}", msg);
  std::process::exit(0);
}

#[command]
fn is_test_env() -> bool {
  env::var("TEST_ENV").is_ok()
}

fn main() {
  let ctx = tauri::generate_context!();

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![is_test_env, handle_error, finish])
    .create_window("main", WindowUrl::default(), |win, webview| {
      let win = win
        .title("Tauri Smooth Resize")
        .resizable(true)
        .transparent(false)
        .decorations(true)
        .always_on_top(false)
        .inner_size(400.0, 300.0)
        .min_inner_size(300.0, 200.0)
        .skip_taskbar(false)
        .fullscreen(false);
      return (win, webview);
    })
    .run(ctx)
    .expect("error while running tauri application");
}
