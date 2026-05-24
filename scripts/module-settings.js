export default function registerSettings(id) {
  game.settings.register(id, "concurrencyLimit", {
    name: "FFmpeg.wasm process concurrency limit",
    hint:
      "How many files is FFmpeg.wasm allowed to process at a time? Speed-up at the cost of additional resources.",
    scope: "client",
    config: true,
    type: Number,
    default: 1,
  });
}
