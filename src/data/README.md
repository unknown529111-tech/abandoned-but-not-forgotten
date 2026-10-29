# Data: Abandoned but not Forgotten

Verified body and equipment data for the interactive space exploration archive.

## Files
- `bodies.json` — 12 bodies (8 planets + Moon + Pluto + Ceres + a "deep space / other" container).
- `equipment.json` — 56 spacecraft (Mars landers/rovers, lunar missions, deep-space probes).

## Sources
Primary sources (NASA / ESA / JPL / NSSDC):
- NASA GISS Mars24 lander list (coords + dates): https://www.giss.nasa.gov/tools/mars24/help/landers.html
- NASA Moon missions table: https://science.nasa.gov/moon/missions/
- NSSDC planetary chronology: https://nssdc.gsfc.nasa.gov/planetary/chronology.html
- NSSDC Apollo landing site coordinates: https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html
- NASA Science mission pages (Voyager, Hubble, JWST, Cassini, etc.)
- NASA JPL news (Mars 3, Ingenuity end)
- LROC (NASA/GSFC/ASU) for Chang'e 3 / Lunokhod 2 / SLIM coords
- JAXA press releases (SLIM)

## Conventions
- Dates are ISO (YYYY-MM-DD) and only included when documented by a cited source; unknown dates are omitted (never fabricated).
- Coordinates (lat/lon, degrees, east-positive) only when documented; each coord carries its `source`.
- Equipment status: concluded | lost-contact | inactive | uncertain | active.
- Arabic strings are best-effort translations; uncertain renderings are noted here.
- `bodyId: "other"` groups deep-space/multi-destination spacecraft under the "Deep Space / Other" body.

## Gaps / uncertainties
- Some Moon coords omitted where no NASA/ESA/JPL citation was found (Surveyor 1/3, Apollo LM coords only where NSSDC lists them).
- Statuses for Chang'e 3/Yutu and Chang'e 4/Yutu-2 reflect latest documented state; marked active/inactive accordingly.
- Arabic translations are best-effort; some terms (e.g. "سبيريت") are transliterations.
- modelUrl / textureUrl / imageUrl omitted: no verified asset URLs were included to avoid broken links.
- Specs included only where verified; many entries omit specs.
- Some last-contact/end dates omitted where exact day is not documented.
