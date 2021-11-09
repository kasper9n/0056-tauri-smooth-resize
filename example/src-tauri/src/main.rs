#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::api::shell;
use tauri::{Submenu, WindowBuilder, WindowUrl};

mod menu;

fn main() {
  let ctx = tauri::generate_context!();

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![])
    .create_window("main", WindowUrl::default(), |win, webview| {
      let win = win
        .title("Tauri Template")
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
    .menu(menu::new(vec![
      #[cfg(target_os = "macos")]
      menu::default_app_submenu(&ctx.package_info().name),
      menu::default_file_submenu(),
      menu::default_edit_submenu(),
      menu::default_view_submenu(),
      menu::default_window_submenu(),
      menu::Item::Submenu(Submenu::new("Help", menu::new(vec![]))),
    ]))
    .on_menu_event(|event| {
      let event_name = event.menu_item_id();
      match event_name {
        "Learn More" => {
          shell::open(
            "https://github.com/probablykasper/tauri-template".to_string(),
            None,
          )
          .unwrap();
        }
        _ => {}
      }
    })
    .run(ctx)
    .expect("error while running tauri application");
}
