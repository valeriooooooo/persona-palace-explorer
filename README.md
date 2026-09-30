# Persona 5 Royal – Palace Explorer

Een MapGenie-achtige kaart van alle Palaces uit Persona 5 Royal, in de stijl van de game.
Gemaakt met React + Vite en GSAP. Alle data staat in een **SQLite-database** die je in je browser
kunt bekijken en aanpassen met **Prisma Studio**.

## Eerste keer opstarten

```bash
npm install          # installeert alles (en maakt de database-code aan)
npm run db:setup     # maakt de database aan en vult hem met de data uit prisma/data/
```

## Elke keer als je wilt werken

Open **twee terminals** in de projectmap:

| Terminal 1 | Terminal 2 |
| --- | --- |
| `npm run dev` | `npm run db:studio` |
| De website: <http://localhost:5173> | De database: <http://localhost:5555> |

`npm run dev` start de website én de API (de kleine server die de website de data uit de database geeft).

## De database bekijken en aanpassen (Prisma Studio)

1. `npm run db:studio` opent <http://localhost:5555> in je browser.
2. Links staan de tabellen:
   - **Palace** – alle 8 Palaces (naam, ruler, treasure, …). `status` = `available` of `coming-soon`.
   - **Area** – één rij per kaartafbeelding, in de volgorde van het palace (`order`). `visit` = 1e of 2e keer daar.
   - **Marker** – alles op de kaart: verhaal (`story`), safe rooms, kisten, will seeds, … `x`/`y` zijn procenten van de kaart.
   - **Enemy** + **PalaceEnemy** – shadows en in welk palace ze voorkomen.
   - **Boss** – de bosses per palace.
3. Dubbelklik op een vakje om het aan te passen en bevestig je wijziging. Met **Insert row** maak je een nieuwe rij.
   Met het filter-icoon zoek je snel iets op (bijv. alle Markers met `type` = `chest`).
4. Ververs de website en je ziet je wijziging.

### Je wijzigingen bewaren op GitHub

Het databasebestand (`prisma/dev.db`) gaat **niet** naar GitHub. De inhoud wordt bewaard als leesbare
JSON-bestanden in `prisma/data/`. Na het aanpassen in Prisma Studio:

```bash
npm run db:export    # schrijft de database naar prisma/data/
git add prisma/data
git commit -m "Data bijgewerkt"
git push
```

`npm run db:setup` bouwt de database weer op uit die bestanden (let op: dat overschrijft `dev.db`,
dus altijd eerst exporteren als je in Studio iets hebt veranderd).

## Alle commando's

| Commando | Wat het doet |
| --- | --- |
| `npm run dev` | Website + API starten |
| `npm run db:studio` | Prisma Studio openen (localhost:5555) |
| `npm run db:setup` | Database opnieuw aanmaken en vullen uit `prisma/data/` |
| `npm run db:export` | Database opslaan naar `prisma/data/` |
| `npm run build` | Productie-build van de website |
| `npm run lint` | Code controleren |

## Waar staat wat

- `prisma/schema.prisma` – de tabellen van de database
- `prisma/data/` – alle data (bron voor de database): `palaces.json`, `enemies.json` en per palace een map (`kamoshida/areas.json`, `markers.json`, `bosses.json`, `enemies.json`)
- `server/` – de API (`/api/palaces` en `/api/palaces/<slug>`)
- `src/` – de website (React)
- `public/images/` – afbeeldingen en kaarten (zie `public/images/README.md`)
- `content/kamoshida-invullen.md` – wat er voor Kamoshida nog ontbreekt of gecheckt moet worden
- `content/*.pdf` – guides als PDF (alleen lokaal, staan niet op GitHub)

## Een nieuw palace toevoegen

1. Zet de kaarten in `public/images/<palace>/maps/`.
2. Zet in Prisma Studio bij het palace `status` op `available`.
3. Voeg per kaart een **Area** toe en per punt op de kaart een **Marker**
   (of stuur de kaarten naar Claude, dan worden de posities uitgelezen).
