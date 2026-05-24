# FFmpeg.wasm Music Metadata Reader
A Foundry VTT module for extracting metadata and tags from audio files using FFmpeg WebAssembly.

## Usage

The `readTags` and `readMetadata` functions accept both strings or arrays of strings for batches.
```js
const tags = await window.FFmpegMusicMetadata.readTags("assets/music/21. The Color-Carrying Wind.flac");
console.log(tags);
```
```json
{
  "assets/music/21. The Color-Carrying Wind.flac": {
    "album": "Ar nosurge -ORIGINAL SOUNDTRACK-",
    "artist": "Kazuki Yanagawa",
    "genre": "Game",
    "title": "The Color-Carrying Wind",
    "album_artist": "Various Artists",
    "composer": "Ken Nakagawa, Akira Tsuchiya, Daisuke Achiwa, Kazuki Yanagawa, Haruka Shimotsuki",
    "date": "2014",
    "organization": "Gust (distributed by Frontier Works)",
    "track": "21",
    "replaygain_track_gain": "-7.66 dB",
    "replaygain_track_peak": "1.000000",
    "replaygain_album_gain": "-7.93 dB",
    "replaygain_album_peak": "1.000000"
  }
}
```

## Dependencies
This module requires the [npm package](https://www.npmjs.com/package/@ffmpeg.wasm/main) of [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) to function. The dependency is included. FFmpeg.wasm is licensed under the MIT License.