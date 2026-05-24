class FFmpegMusicMetadata {
  static id = "music-metadata-ffmpeg-wasm";

  #ffmpeg = null;

  async getFFmpeg() {
    return await this.#ensureFFmpeg();
  }

  async terminateFFmpeg() {
    await this.#ffmpeg.terminate();
  }

  /**
   * Ensures the FFmpeg instance is initialized and loaded.
   * Creates a new instance if none exists, and loads it.
   * @private
   * @async
   * @returns {Promise<FFmpeg>} The initialized and loaded FFmpeg instance
   */
  async #ensureFFmpeg() {
    if (!this.#ffmpeg) {
      this.#ffmpeg = new FFmpegWASM.FFmpeg();
    }
    if (!this.#ffmpeg.loaded) {
      await this.#ffmpeg.load();
    }
    return this.#ffmpeg;
  }

  /**
   * Recursively searches through an object to find all values associated with a specific key.
   * Uses case-insensitive key matching and a WeakSet to prevent infinite loops on circular references.
   * @private
   * @param {Object} obj - The object to search through
   * @param {string} targetKey - The key to search for (case-insensitive)
   * @returns {Array} Array of all values found for the target key
   */
  #findAllNestedValues(obj, targetKey) {
    const seen = new WeakSet();
    const normalizedTarget = targetKey.toLowerCase();
    const results = [];

    function visit(value) {
      if (value === null || typeof value !== "object") {
        return;
      }
      if (seen.has(value)) {
        return;
      }
      seen.add(value);

      for (const [key, val] of Object.entries(value)) {
        if (key.toLowerCase() === normalizedTarget) {
          results.push(val);
          continue;
        }
        visit(val);
      }
    }

    visit(obj);
    return results;
  }

  /**
   * Recursively converts all object keys to lowercase.
   * Handles nested objects and arrays.
   * @private
   * @static
   * @param {*} obj - The value to transform (object, array, or primitive)
   * @returns {*} A new object/array with lowercase keys, or the original primitive value
   */
  static #lowercaseKeys(obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.#lowercaseKeys(item));
    } else if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = this.#lowercaseKeys(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  /**
   * Reads and extracts metadata from one or more audio files using FFprobe.
   * Fetches the file, writes it to FFmpeg's virtual filesystem, runs ffprobe, and parses the JSON output.
   * @async
   * @param {string|string[]} soundPaths - A single audio file path or array of audio file paths
   * @returns {Promise<Object>} Object mapping sound paths to their metadata objects (with lowercase keys)
   * @throws {Error} If file fetch or FFprobe execution fails
   * @example
   * const metadata = await ffmpegMetadata.readMetadata(['song1.mp3', 'song2.flac']);
   */
  async readMetadata(soundPaths) {
    soundPaths = [].concat(soundPaths);

    const metadata = {};
    const ffmpeg = await this.#ensureFFmpeg();

    for (const soundPath of soundPaths) {
      const song = encodeURIComponent(soundPath);
      const probe = `${song}.json`;
      
      try {
        const res = await fetch(soundPath);
        const data = new Uint8Array(await res.arrayBuffer());
        await ffmpeg.writeFile(song, data);

        await ffmpeg.ffprobe([
          "-v",
          "error",
          "-show_format",
          "-show_streams",
          "-print_format",
          "json",
          song,
          "-o",
          probe,
        ]);

        const jsonStr = await ffmpeg.readFile(probe, "utf8");
        const json = JSON.parse(jsonStr);

        metadata[soundPath] = FFmpegMusicMetadata.#lowercaseKeys(json);
      } finally {
        await ffmpeg.deleteFile(song).catch(() => {});
        await ffmpeg.deleteFile(probe).catch(() => {});
      }
    }

    return metadata;
  }

  /**
   * Extracts tags from audio file metadata.
   * Reads metadata, finds all nested "tags" objects, and merges them for each file.
   * @async
   * @param {string|string[]} soundPaths - A single audio file path or array of audio file paths
   * @returns {Promise<Object>} Object mapping sound paths to their tag objects
   * @example
   * const tags = await ffmpegMetadata.readTags('song.mp3');
   * console.log(tags['song.mp3']); // { artist: "...", title: "...", ... }
   */
  async readTags(soundPaths) {
    const metadata = await this.readMetadata(soundPaths);

    const allTags = {};
    for (const [soundPath, data] of Object.entries(metadata)) {
      const tagsArray = this.#findAllNestedValues(data, "tags") ?? {};
      const tags = Object.assign({}, ...tagsArray);
      allTags[soundPath] = tags;
    }

    return allTags;
  }
}

export default new FFmpegMusicMetadata();
