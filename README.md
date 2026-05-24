# Foundry VTT FFmpeg.wasm Music Metadata Reader
A Foundry VTT module for extracting metadata and tags from audio files using FFmpeg WebAssembly. Thanks to FFMpeg's wideranging compatibility, this module should be able to extract relevant metadata from all commonly used audio filetypes.<br>
Supported filetypes include, but are not limited to: mp3, wav, flac, ogg, opus, m4a and webm.

This module is intended to be used as a library. It does not do anything useful with the extracted metadata on its own.

## Usage

The `readTags` and `readMetadata` functions accept both strings or arrays of strings for batches.
```js
const file = "assets/music/21. The Color-Carrying Wind.flac";
const tags = await window.FFmpegMusicMetadata.readTags(file);
console.log(tags);
```
Output:
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

## Adding This Module as a Dependency
Add the following key to your `module.json` or `system.json` file:
```json
  "relationships": {
    "requires": [
      {
        "id": "music-metadata-ffmpeg-wasm",
        "type": "module",
        "manifest": "https://raw.githubusercontent.com/konokonekonoko/music-metadata-ffmpeg-wasm/main/module.json",
        "compatibility": {
          "minimum": "tested compatible versions here",
          "verified": "tested compatible versions here"
        }
      }
    ]
  }
```

## FFmpeg.wasm
This module requires the [npm package](https://www.npmjs.com/package/@ffmpeg.wasm/main) of [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) to function. The dependency is included. FFmpeg.wasm is licensed under the MIT License.