import registerSettings from "./module-settings.js";
import FFmpegMusicMetadata from "./ffmpeg-manager.js";

const MODULE_ID = "music-metadata-ffmpeg-wasm";

Hooks.once("init", async () => {
  console.log(`${MODULE_ID} initialized.`);
  registerSettings(MODULE_ID);

  window.FFmpegMusicMetadata = FFmpegMusicMetadata;
  Hooks.callAll(MODULE_ID + ".ready", FFmpegMusicMetadata);
});
