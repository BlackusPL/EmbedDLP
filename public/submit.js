export default (req, res) => {
  const query = req.body.q;
  const mediaType = req.body.isVideo;
  if (!query || !mediaType) {
    return res.status(400).send("Brak wymaganych parametrów");
  } else {
    return res.redirect(`/universal/?video=${mediaType}&q=${query}`);
  }
};
