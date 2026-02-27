import i18n from "../src/LanguageConfig.js";

export default (req, res) => {
  const query = req.body.q,
    mediaType = req.body.isVideo,
    spot = mediaType === "auto" ? true : false;
  if (!query || !mediaType && !spot) {
    return res.status(400).send(i18n.__("no_arguments"));
  } else if (!spot) {
    return res.redirect(`/universal/?video=${mediaType}&q=${query}`);
  } else {
    return res.redirect(`/music/?q=${query}`);
  }
};