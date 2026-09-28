# Images

The site shows a red halftone placeholder for any image that is missing.
Filenames must match exactly (including the extension, which must match the
real file format: a PNG must be named `.png`, an AVIF `.avif`, etc.).

| File | Used for |
| --- | --- |
| `intro/take-your-heart.jpg` | Logo in the opening "Take Your Heart" animation |
| `kamoshida/ruler.jpg` | Kamoshida's portrait in the header |
| `kamoshida/castle.jpg` | Palace card on the select screen + "Palace Intel" panel |
| `kamoshida/red-will-seed.png` | Red Will Seed marker |
| `kamoshida/green-will-seed.png` | Green Will Seed marker |
| `kamoshida/blue-will-seed.png` | Blue Will Seed marker |
| `kamoshida/boss.avif` | Shadow Kamoshida marker (Throne Room) |
| `kamoshida/treasure.png` | The Treasure (Crown) marker |

To link an image to another marker, add `image: 'kamoshida/<name>'` to that
marker in `src/data/kamoshida.js`. Optional: `imageFit: 'contain'` for cut-out
images, `imagePosition: 'center top'` to choose which part stays in view.
