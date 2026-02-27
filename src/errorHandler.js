import i18n from './LanguageConfig.js';

export default function errorHandler(err, res) {
    switch (true) {
      default:
        return res.status(500).json({ error: i18n.__("server_error") });
      case err.message.includes("DRM protection"):
        return res.status(403).json({ error: i18n.__("drm_protected") });
      case err.message.includes("HTTPError 404: Not Found"):
        return res.status(404).json({ error: i18n.__("video_not_found") });
      case err.message.includes("Unsupported URL"):
        return res.status(400).json({ error: i18n.__("unsupported_url") });
    }
}