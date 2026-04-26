# Changelog

### 26.04.2026

## Added

- `YT_DLP_PATH` - you can point where yt-dlp is located (For now its must have but Im working on detection of system env one or installed in app root dir)
- Now embeded files should have names, thumbnails and metadata if they are available
    - files in `output` directory now uses title names instead of ids

## Changed

- `yt-dlp-wrap` replaced with new `ytdlp-nodejs`

## Fixed

- Fixed console error for spotify downloader

## Removed

- `package-lock.json`

### 25.04.2026

### Changed

- Changed how to run this app in `README.md` in Deno
- Github Actions now uses Nodejs v24

## 20.04.2026

### Fixed

- Fixed console error
- Fixed an issue where the error message in console doesn't show up because 'error' is an object that needs to be converted to string.

### Changed

- Changed default download option from Music to Audio.

## 8.04.2026

### Added

- New string: `type_query_here`

### Changed

- Website has been revamped. Now it uses Material UI 3 instead of Tailwind

## 2.04.2026

### Added

- Added option to set expiration time of downloaded files. They are defined in seconds. In `.env` use ex. `EXPIRATION_TIME=300` to make files expire after 5 minutes

## 29.03.2026

### Added

- Icon for:
    - website page
    - standalone build
- Added option to change on what ip is app hosted. In `.env` use ex. `IP=127.0.0.1`

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