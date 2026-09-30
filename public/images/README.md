# Images

All images are referenced from the database (Prisma Studio) as a path inside
this folder, e.g. `kamoshida/ruler.jpg`.

Tip: the file extension must match the real format. Renaming a `.png` to
`.jpg` does not convert it; save it as JPG (or keep `.png` and use that name
in the database).

| Path | Used for |
| --- | --- |
| `intro/take-your-heart.jpg` | Logo in the opening animation |
| `<palace>/ruler.jpg` | Ruler portrait (Palace.portrait) |
| `<palace>/castle.jpg` | Banner on the selection screen (Palace.banner) |
| `<palace>/red-will-seed.jpg` etc. | Will Seed markers (Marker.image) |
| `<palace>/boss.jpg` | Boss picture (Boss.image) |
| `<palace>/treasure.jpg` | Treasure marker (Marker.image) |
| `<palace>/maps/*.jpg` | One map per Area (Area.mapImage) |

Map file names: a space means one image shows several areas, `-2` means the
second visit.
