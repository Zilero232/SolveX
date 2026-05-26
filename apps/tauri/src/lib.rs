#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        use tauri::Manager;
        use tauri_plugin_deep_link::DeepLinkExt;

        builder = builder
            .plugin(tauri_plugin_global_shortcut::Builder::new().build())
            .plugin(tauri_plugin_updater::Builder::new().build())
            .plugin(tauri_plugin_os::init())
            .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.unminimize();
                    let _ = window.show();
                    let _ = window.set_focus();
                }
                // Forward deep-link URLs received via a second-instance launch
                // (Windows/Linux pass the URL as an argv entry) to the plugin so
                // JS subscribers receive an onOpenUrl event.
                app.deep_link().handle_cli_arguments(args.into_iter());
            }));
    }

    builder
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            // Register the chatovo:// scheme with the OS at runtime so dev
            // builds can receive deep-link callbacks without a full installer.
            // Production bundles register the scheme through the installer
            // (MSI/NSIS on Windows, Info.plist on macOS, .desktop on Linux),
            // but `tauri dev` skips that step.
            #[cfg(desktop)]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                if let Err(err) = app.deep_link().register_all() {
                    eprintln!("deep-link register_all failed: {err}");
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
