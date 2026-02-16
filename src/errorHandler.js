export default function errorHandler(err, res) {
    switch (true) {
      default:
        return res.status(500).json({ error: "Wystąpił błąd podczas pobierania" });
      case err.message.includes("DRM protection"):
        return res.status(403).json({ error: "To wideo/audio jest chronione DRM i nie można go pobrać" });
      case err.message.includes("HTTPError 404: Not Found"):
        return res.status(404).json({ error: "Nie można znaleźć tego wideo" });
      case err.message.includes("Unsupported URL"):
        return res.status(400).json({ error: "Nieobsługiwany URL" });
    }
}