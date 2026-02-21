# EmbedDLP

API that allows you to embed or download every video and audio from [supported sites by yt-dlp](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) on platforms like Discord, Telegram, WhatsApp and more.

> [!Note]
>
> This project wasnt supposed to see daylight and some things could still be related to my stuff

# Installation

```bash
# Clone this repository
git clone https://git.nadeko.net/BlackusPL/EmbedDLP.git
cd EmbedDLP
```

### Use via...
<details>
<summary>Deno (Recommended)</summary>

```bash
deno install
deno run start # or 'deno src/app.js'
```
</details>

<details>
<summary>Nodejs</summary>

```bash
npm install
npm start # or 'node src/app'
```
</details>

# Endpoints

`/` - Opens home page

`/universal` - Main endpoint, arguments:
- `?q=<url>` - video/audio link that should be embeded
- `?video=<true/1/false/0>` - if embeded file should be a video or audio (optional, default=false)

`/music` - Embeds spotify songs as a audio file, arguments:
- `?q=<url>` - spotify link that should be embeded as a audio file
- `?ss=<int>` - choose in order wich song should be used (optional, default=1)

# Outputs

Embeded files have 5 minutes before get terminated in next execution of app. They are stored in `output/files_expiration.json`.

Example structure:
```json
{
    "example.mp3": {
        "created_at": "1771544044840",
        "expiration": "1771544345231",
        "source_urls": [
            "http://example.com/example.mp3"
        ]
    }
}
```
Temporary videos and audios are stored in `output` directory and are not accesible trough site.

# Standalone Builds

Using Deno you can compile this app to binary file that can be run anywhere. Simply type `deno run build` and you good to go.