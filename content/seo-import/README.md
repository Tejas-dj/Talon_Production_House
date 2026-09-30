# Image SEO metadata import — working files

Source: `FINAL_Image_Metadata.xlsx`
(`Documents\CobaltKite.Creatives\WebServices\Talon_Prod_House\Website_Assets\Image Assets\`),
client-supplied master spreadsheet, verified source of truth.

**History**: an earlier spreadsheet (`Talon_Production_House_ImageMetadata.xlsx`
from Downloads) was matched and one batch was implemented, then found — by
fetching and visually comparing several images directly against the live
CDN — to describe a completely different photoshoot per series despite
matching filenames exactly. That batch was fully reverted. This
`FINAL_Image_Metadata.xlsx` replaces it and has been independently
re-verified the same way (see "Verification done" below) before any
implementation resumed.

**Matching is already done and verified** (by filename against the real
`imageIds` arrays in `content/photography.json`). Do not re-match. Results:

- 187 spreadsheet rows total.
- 180 matched cleanly, 1:1, to a real site image — every series' count
  matches the site exactly (draped-in-legacy 7, the-ensemble 7,
  skill-beyond-education 11, behind-the-hymn 7, eva-chemlinks 6,
  coastline-reverie 19, faces-in-frame 58, indyvarna-the-lookbook 65) → split
  into `content/seo-import/series/<slug>.json`, one file per photo series,
  ordered by image number. Zero corrupted rows this time (checked with the
  same heuristic that caught the previous file's 27 corrupted
  `faces-in-frame` rows — none here).
- 7 rows (`Curated_pic_1.webp`…`Curated_pic_7.jpg`) don't correspond to any
  series/folder anywhere in this repo's content — flagged, not implemented,
  see `unmatched-curated-rows.md`.
- 0 site images without a spreadsheet row (full coverage).

## Verification done before trusting this file

Fetched the live CDN image and/or cross-checked against the site's existing
(previously human-verified) alt text for a sample across very different
series — `Behind_The_Hymn_pic_1` (visual match: man in red shawl, white
shirt, forehead markings), `Draped_In_Legacy_pic_1` (visual match: black
sari, red/gold border, pink backdrop — this is the exact image the *old*
spreadsheet got wrong as "emerald green saree outdoors"), `Coastline_Reverie_pic_1`
(visual match: sunset over sea framed by wooden poles, no person — the old
spreadsheet wrongly described a man in the surf here), `EVA_CHEMLINKS_pic_1`
(description match: macro shot of blue copper sulphate crystals), `INDYVARNA_pic_1`
(visual match: woman in brown floral halter top and jeans against blue
backdrop). All five matched. Proceed with implementation.

## Per-series file schema (`series/<slug>.json`)

```json
{
  "slug": "draped-in-legacy",
  "title": "Draped in Legacy",
  "images": [
    {
      "r2Id": "Draped_In_Legacy/Draped_In_Legacy_pic_1.webp",
      "filename": "Draped_In_Legacy_pic_1.webp",
      "role": "Gallery",
      "visualDescription": "Soft-focus portrait of a woman in a black sari with a red and gold border, wearing gold jewellery against a pale pink background.",
      "altText": "Soft-focus portrait of a woman in a black sari with a red and gold border.",
      "imageTitle": "Traditional Portrait | Black and Red Sari",
      "searchTopic": "Traditional portrait photography",
      "creator": "Talon Production House | Pratham Raje Urs",
      "client": ""
    }
  ]
}
```

`r2Id` is the exact, already-verified key to use everywhere (alt text file,
title file, description file) — matches `content/photography.json`
`imageIds` and `content/photo-alt-text.json` / `content/photo-dimensions.json`
keys exactly. `client` is a genuine empty string when there's no client
(not a marker string this time) — treat empty/whitespace-only as blank.

## Implementation rules (apply per image)

1. **Alt text** → write `entry.altText` **verbatim** into
   `content/photo-alt-text.json`, keyed by `r2Id`. This is the only file
   that feeds the live `<img alt>` (via `getPhotoAlt()` in
   `src/lib/media/photo-alt-text.ts`, used by `StillsGallery.tsx`). Existing
   keys not in your batch must be left untouched. This spreadsheet's Alt
   Text values are already client-aware and well-formed — no rewriting
   needed, apply as-is.
2. **Image Title** → write `entry.imageTitle` **verbatim** into
   `content/photo-titles.json`, keyed by `r2Id` (same shape/pattern as
   `photo-alt-text.json`). Already in the exact `"<Project/Genre> | <Descriptor>"`
   format the client's reference examples use — apply as-is, don't
   reformat. Feeds `ImageObject.name` in `buildImageGallerySchema`
   (`src/lib/structured-data.ts`), via `getPhotoTitle()` — this plumbing
   already exists (landed in a prior batch), don't recreate it.
3. **Image Description** → **synthesize**, don't copy verbatim (this is the
   one field with no ready-made spreadsheet equivalent). Write into
   `content/photo-descriptions.json`, keyed by `r2Id`. Combine
   `entry.visualDescription` + `entry.client` + `entry.creator` into one
   natural sentence, matching the two reference examples below exactly in
   tone/formula:
   - **Client present** (`entry.client` non-empty): `<genre/subject>
     photograph of <condensed visual gist>, created by Talon Production
     House for <Client>.`
   - **No client** (`entry.client` empty/whitespace): `<genre/subject> of
     <condensed visual gist>, photographed by Talon Production House.`
   - Use `entry.searchTopic` only as a steer for word choice/genre framing
     — never paste it in literally as a keyword string, never write it
     anywhere as a meta-keywords tag (the site has none, keep it that way).
   - Never invent detail not present in `visualDescription`/`client`/
     `creator`. No guessed locations/brand names beyond what's stated.
   - Roughly 100–200 characters, one sentence, no keyword stuffing.
4. **Creator attribution**: already handled site-wide in the plumbing batch
   (`ImageObject.creator`/`creditText` = "Talon Production House" on every
   image in the gallery schema, landed previously — don't touch
   `structured-data.ts` again). `entry.creator` here is sometimes
   `"Talon Production House"` alone, sometimes `"Talon Production House |
   Pratham Raje Urs"` — for the synthesized description (rule 3), credit
   only "Talon Production House" (matches both reference examples, which
   credit the company, not the individual photographer).
5. **Client blank handling**: `entry.client` is a real empty string when
   there's no client (verified — no corrupted marker text this time).
   Never write "personal project" / "independent project" / "self-initiated"
   regardless.

## Reference examples (verbatim from the client's own reference doc)

**With client:**
- Visual Description: "A model wearing a rust tie-dye tunic against a blue studio backdrop."
- Client: INDYVARNA · Creator: Talon Production House
- Description → "Fashion lookbook photograph of a model wearing a rust
  tie-dye tunic against a blue studio backdrop, created by Talon Production
  House for INDYVARNA."

**No client:**
- Visual Description: "A woman in yellow fabric seated on a beach."
- Client: blank · Creator: Talon Production House
- Description → "Coastal portrait of a woman draped in yellow fabric and
  seated on a beach, photographed by Talon Production House."

## After each batch

1. Validate every JSON file you touched is syntactically valid.
2. Confirm every `r2Id` you wrote a key for exists in
   `content/photography.json`'s `imageIds` for that series (pre-verified —
   this is a sanity check against typos you might introduce).
3. **Before writing anything for a batch you haven't done yet, fetch and
   visually check at least 2 images from that series against
   `entry.visualDescription`/`entry.altText`** (same CDN-fetch-and-compare
   method already used to verify this file overall) — cheap insurance
   against a per-series mismatch this session's broader check might have
   missed. If a mismatch turns up, STOP that batch, don't implement it, and
   report the discrepancy instead of proceeding.
4. Update `content/seo-import/progress.md`'s status table for your batch
   (`pending` → `done`).
5. Report back to the orchestrator concisely: counts only (images updated,
   any skipped and why), file paths touched. Do not paste the JSON content
   or full alt-text/description text back — it's already in the files.
