export default (_req, res) => {
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <title>EmbedDLP</title>
    <meta charset="UTF-8">
    <link rel="icon" href="data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QDGRXhpZgAATU0AKgAAAAgABgEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAExAAIAAAAjAAAAZgEyAAIAAAAUAAAAiodpAAQAAAABAAAAngAAAAAACvyAAAAnEAAK/IAAACcQUGhvdG9wZWEgRWRpdG9yICh3d3cucGhvdG9wZWEuY29tKQAAMjAyNjowMzoyOSAwMzowNTo0NwAAAqACAAQAAAABAAAAuKADAAQAAAABAAAAuAAAAAAAAP/hAvFodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIiPg0KCTxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIj4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJPC9yZGY6UkRGPg0KPC94OnhtcG1ldGE+DQo8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAIAAgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+mvG/wAcfBHw+/tGLWPEFnHqNjGskmmxyh7pt2NqrGOSTkfnk4HNfNGo/GzxP8b/ABfp1hY6E3hWzmE0Bv52VituyEt52T8qgqr52gqVBBFW/wBtDStO0zx54NuwsRab7RNLCY1Hzkxr5hfG45xjaTjIyBknPCaP4kstBhiubaSC4uZI3E9t5ZwQwKsGwBksCeh/Gvm8fmMqFZUorTr/AMA/X+FOEqOa5fVxtWdpdFZO1usrpqza8tFvrY9k8BfHLxP4W1CCz8ZmW4XzDBPG+0ywkAA/wgkg9eTkV9J6Vq1prdjHeWM63FtJ9119e4I6gg8EHkV8JeJvGs3jv+27i/sYf7TsYptRUq5ZZLWJQ0kZLfMXjQF0YsTtRkOcJt9k/Zg+IFxqqm7vY5YtN1eEG1nOSJJYgAwcAnEm04yPvBBnJFPAYipGXLOXNB7P9GTxPleErUVWoUlSxFPScFZJ6XUopJJ3Wumtt11KP7b/AMM9T8UaZoPiHSh5j6f5ltcR7sHY5VlYfQq3HU5AHJr598JeE7LU0iim1NtK1m0l2XVnfAJuAYjMbZ+Y9OPbgkEY/SVdOtNXkWyv41lsJ9yXCuoZdm0k7geCvAz7Zr5r/ae/Z9jt/A2teJbK0je808fa5ZdpA8kOEdUx/cUg/wDASe/PVi8BGtNVVuv+B/kfOZHxLXyzD1MHB2jUVn9zWvl7z/D5/L/j+zk0vV2tbe/uLeO68yGWaNirujAq4YD+EgspAJBGeTmvrb9lH9m/+w9M/tW/s54XjVLiK5uN4i81VYYUfcIwQA4BPzEZrzz9gr4WWnjnUpvHfiBBc6Poj/2fZWN2mVurv5nDEHIKxoynp1PTI5/Qe01C41bVFiVERUG8SydUHT5I8deo3N0546rV0cE4VnVk9L6IyzHPqeJwVPCU6fvxVnNvV2d0l+R//9k=" type="image/icon type">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://darknessair.ovh/index.css" rel="stylesheet">
</head>
<body class="flex items-center place-content-center gap-3">
    <h1 class="text-green-800 text-5xl font-bold">EmbedDLP</h1>
    <form method="POST" action="/submit">
        <input type="text" class="text-green-800 font-bold w-[25vw]" placeholder="Type your query here" name="q" required /></div>
        <div class="space-x-5">
            <input type="radio" name="isVideo" value="false" class="inline-block">audio
            <input type="radio" name="isVideo" value="true">video
            <input type="radio" name="isVideo" value="auto">music
            <button type="submit" class="bg-sky-500 hover:bg-sky-700">Get Music</button>
    </form>
</body>
</html>
    `;
    res.send(html);
}