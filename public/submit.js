module.exports = (req, res) => {
    const query = req.body.q;
    const mediaType = req.body.mediaType;
    if (!query || !mediaType) {
        return res.status(400).send('Brak wymaganych parametrów');
    } else {
        return res.redirect(`/universal/?mt=${mediaType}&q=${query}`);
    }
};
