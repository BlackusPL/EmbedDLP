# Changelog

## 27.02.2026

### Added

- Language system
    - You can add new one in `locales` directory
    - You can change default locale in `.env` file, ex. `DEFAULT_LOCALE=en`
- Example `.env` file
- This changelog file

### Fixed

- Expired files hasn't been deleted in standalone build
- Expired files only been deleted after new entrance in `file_expiration.json`
- Spotify songs apears as undefined file

### Changed

- Title name in web page

### Removed

- Old system aka seperated `audio.js` and `video.js`

## 21.02.2026

### Changed

- Leftover from local version

### Removed

- Copies of some files
    - `app.js`
    - `spotify_downloader.js`
- Display images page because it was useless

## 20.02.2026

### Added

- Option to change port
- Songs from Spotify are autolimited to their lenght

### Changed

- Moved `file_expiration.json` to `output` directory

### Removed

- `@distube/ytdl-core` because its outdated and not been used

## 19.02.2026

### Added

- Checks if `src` folder exist in standalone build (later been removed)

### Changed

- `index.html` is now `index.js`

## 16.02.2026

### Added

- Error Handler
- Option to display songs from Spotify

### Fixed

- Spotify songs should work again

## 15.02.2026

### Changed

- Rewrited everything from CommonJS to ESM

## 13.02.2026

This updated only updates packages to latest versions

## 14.09.2025

### Added

- Support for all websites that yt-dlp supports

### Changed

- Now `universal` endpoint checks from `video` parameter if its true or false instead of checking if value is video or audio

## 18.07.2025

This update seperate everything from one single JavaScript file into multiple one to make work easier

## [Before this date]

Multiple tries to host it on Vercel, nothing special