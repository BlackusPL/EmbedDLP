import i18n from '../src/LanguageConfig.js';

export default (_req, res) => {
  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <title>EmbedDLP</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QDGRXhpZgAATU0AKgAAAAgABgEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAExAAIAAAAjAAAAZgEyAAIAAAAUAAAAiodpAAQAAAABAAAAngAAAAAACvyAAAAnEAAK/IAAACcQUGhvdG9wZWEgRWRpdG9yICh3d3cucGhvdG9wZWEuY29tKQAAMjAyNjowMzoyOSAwMzowNTo0NwAAAqACAAQAAAABAAAAuKADAAQAAAABAAAAuAAAAAAAAP/hAvFodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIiPg0KCTxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIj4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJPC9yZGY6UkRGPg0KPC94OnhtcG1ldGE+DQo8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAIAAgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+mvG/wAcfBHw+/tGLWPEFnHqNjGskmmxyh7pt2NqrGOSTkfnk4HNfNGo/GzxP8b/ABfp1hY6E3hWzmE0Bv52VituyEt52T8qgqr52gqVBBFW/wBtDStO0zx54NuwsRab7RNLCY1Hzkxr5hfG45xjaTjIyBknPCaP4kstBhiubaSC4uZI3E9t5ZwQwKsGwBksCeh/Gvm8fmMqFZUorTr/AMA/X+FOEqOa5fVxtWdpdFZO1usrpqza8tFvrY9k8BfHLxP4W1CCz8ZmW4XzDBPG+0ywkAA/wgkg9eTkV9J6Vq1prdjHeWM63FtJ9119e4I6gg8EHkV8JeJvGs3jv+27i/sYf7TsYptRUq5ZZLWJQ0kZLfMXjQF0YsTtRkOcJt9k/Zg+IFxqqm7vY5YtN1eEG1nOSJJYgAwcAnEm04yPvBBnJFPAYipGXLOXNB7P9GTxPleErUVWoUlSxFPScFZJ6XUopJJ3Wumtt11KP7b/AMM9T8UaZoPiHSh5j6f5ltcR7sHY5VlYfQq3HU5AHJr598JeE7LU0iim1NtK1m0l2XVnfAJuAYjMbZ+Y9OPbgkEY/SVdOtNXkWyv41lsJ9yXCuoZdm0k7geCvAz7Zr5r/ae/Z9jt/A2teJbK0je808fa5ZdpA8kOEdUx/cUg/wDASe/PVi8BGtNVVuv+B/kfOZHxLXyzD1MHB2jUVn9zWvl7z/D5/L/j+zk0vV2tbe/uLeO68yGWaNirujAq4YD+EgspAJBGeTmvrb9lH9m/+w9M/tW/s54XjVLiK5uN4i81VYYUfcIwQA4BPzEZrzz9gr4WWnjnUpvHfiBBc6Poj/2fZWN2mVurv5nDEHIKxoynp1PTI5/Qe01C41bVFiVERUG8SydUHT5I8deo3N0546rV0cE4VnVk9L6IyzHPqeJwVPCU6fvxVnNvV2d0l+R//9k=" type="image/icon type">
    <link href="https://db.onlinewebfonts.com/c/b0c1e82d56a0eb0ab7ce3c9cb56ff1fc?family=Google+Sans" rel="stylesheet" type="text/css"/>
    <script type="importmap">
    {
      "imports": {
        "@material/web/": "https://esm.run/@material/web/"
      }
    }
    </script>
    <script type="module">
      import '@material/web/all.js';
    </script>
    <style>
      @keyframes slide-left-normal {0% { transform: translatey(-5em); opacity: 0;} 100% { transform: translatey(0); opacity: 1;}}
      @font-face {
        font-family: "PerfectDOS";
        font-smooth: never;
        -webkit-font-smoothing: none;
        -moz-osx-font-smoothing: grayscale;
        src: url("https://saltssaumure.github.io/pios-discord-theme/font/PerfectDosVga.ttf");
      }
      :root {
        --md-sys-color-primary: #641919;
        font-family: "PerfectDOS", "Google Sans", sans-serif;
        color: white;
      }
      body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        gap: 2rem;
        background-color: #fbfdf7;
        background-image: url('https://images.unsplash.com/photo-1603366615917-1fa6dad5c4fa?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGl0Y2glMjBibGFja3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1');
        background-size: cover;
        background-position: center;
        animation: slide-left-normal 1s ease 0s 1 normal both;
      }
      h1 {
        color: var(--md-sys-color-primary);
        font-size: 3rem;
        margin: 0;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        width: 100%;
        max-width: 500px;
      }
      md-outlined-text-field {
        width: 100%;
      }
      .radio-group {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }
    </style>
</head>
<body>
    <h1>EmbedDLP</h1>
    <form method="POST" action="/submit">
        <md-outlined-text-field label="${i18n.__('type_query_here')}" name="q" required error-text="Please enter a query"></md-outlined-text-field>
        
        <div class="radio-group">
            <label>
                <md-radio name="isVideo" value="false"></md-radio>
                Audio
            </label>
            <label>
                <md-radio name="isVideo" value="true"></md-radio>
                Video
            </label>
            <label>
                <md-radio name="isVideo" value="auto" checked></md-radio>
                Music
            </label>
        </div>
        
        <md-filled-button type="submit">Get Audio/Video</md-filled-button>
    </form>
</body>
</html>
    `;
  res.send(html);
};
