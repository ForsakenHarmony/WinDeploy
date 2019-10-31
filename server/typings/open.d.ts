declare module 'open' {
  interface Options {
    /**
     Wait for the opened app to exit before fulfilling the promise. If `false` it's fulfilled immediately when opening the app.

     Note that it waits for the app to exit, not just for the window to close.

     On Windows, you have to explicitly specify an app for it to be able to wait.

     @default false
     */
    readonly wait?: boolean;

    /**
     __macOS only__

     Do not bring the app to the foreground.

     @default false
     */
    readonly background?: boolean;

    /**
     Specify the app to open the `target` with, or an array with the app and app arguments.

     The app name is platform dependent. Don't hard code it in reusable modules. For example, Chrome is `google chrome` on macOS, `google-chrome` on Linux and `chrome` on Windows.

     You may also pass in the app's full path. For example on WSL, this can be `/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe` for the Windows installation of Chrome.
     */
    readonly app?: string | readonly string[];

    /**
     Uses `encodeURI` to encode the `target` before executing it.

     The use with targets that are not URLs is not recommended.

     Especially useful when dealing with the [double-quotes on Windows](https://github.com/sindresorhus/open#double-quotes-on-windows) caveat.

     @default false
     */
    readonly url?: boolean;
  }

  export default function(target: string, options: Options): void;
}

