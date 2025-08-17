module.exports = (req, res) => {
    const imageUrl = req.query.image;
    const shareLink = req.protocol + '://' + req.get('host') + req.originalUrl;

    // Generowanie HTML
    let htmlContent = `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta property="og:image" content="${imageUrl}">
    <title>Wyświetlacz Obrazów</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        img {
            max-width: 80%;
            max-height: 60vh;
            margin-bottom: 20px;
            border: 2px solid #333;
            border-radius: 5px;
        }
        .error {
            color: red;
            font-weight: bold;
        }
        .link-container {
            margin-top: 20px;
            text-align: center;
        }
        input {
            width: 300px;
            padding: 5px;
            margin-top: 10px;
        }
        button {
            padding: 5px 10px;
            margin-left: 10px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Wyświetlacz Obrazów</h1>
    <div id="image-container">
    `;
    if (!imageUrl) {
        htmlContent += '<p class="error">Brak adresu obrazu w URL. Dodaj parametr ?image=adres_obrazu</p>';
    } else {
        htmlContent += `<img src="${imageUrl}" alt="Obraz z URL" onerror="this.parentElement.innerHTML='<p class=\\'error\\'>Nie udało się załadować obrazu. Sprawdź poprawność adresu URL.</p>'">`;
    }

    htmlContent += `
    </div>
    <div class="link-container">
        <p>Link do udostępnienia:</p>
        <input type="text" id="share-link" value="${imageUrl ? shareLink : ''}" readonly>
        <button onclick="copyLink()">Kopiuj</button>
    </div>
    <script>
        function copyLink() {
            const shareLinkInput = document.getElementById('share-link');
            shareLinkInput.select();
            document.execCommand('copy');
            alert('Link skopiowany do schowka!');
        }
    </script>
</body>
</html>
    `;

    res.send(htmlContent);
}