# Alt-text batch progress

188 images total (185 in `content/photography.json`, 3 studio images in
`content/studio.json`), split into 7 batches of 30 (last batch = 8) — see
`content/alt-text/batches.json` for the exact, fixed image list per batch
(don't regenerate it; the split is deterministic but re-running the
generator after this file changes could reorder things).

Each image's finished alt text lives in `content/photo-alt-text.json`, keyed
by Cloudinary public id. Components already read from it with a generic
fallback for any id not yet present (see `src/lib/media/photo-alt-text.ts`),
so partially-done batches are safe to ship — nothing breaks if a batch is
still mid-flight.

Keyword/style guidance for whoever writes a batch: `content/alt-text/keywords.md`.

## Status

| Batch | Images | Series covered | Status | Commit |
|---|---|---|---|---|
| 1 | 30 | coastline-reverie (1-19, all), faces-in-frame (1-11) | done | 8631f42 |
| 2 | 30 | faces-in-frame (12-41) | done | pending |
| 3 | 30 | faces-in-frame (42-60, rest), indyvarna-the-lookbook (1-11) | not started | |
| 4 | 30 | indyvarna-the-lookbook (12-41) | done | 95d91a5 |
| 5 | 30 | indyvarna-the-lookbook (42-68, rest), the-ensemble (1-3) | done | c3d94c8 |
| 6 | 30 | the-ensemble (4-7, rest), behind-the-hymn (1-7, all), draped-in-legacy (1-7, all), eva-chemlinks (1-6, all), skill-beyond-education (1-6) | done | eb0fdeb |
| 7 | 8 | skill-beyond-education (7-11, rest), talon-studio hero + gallery (all 3) | done | e8a74e3 |

Update the Status column (`pending` → `done`) and Commit column (short hash)
as each batch lands. `pending` = agent dispatched, not yet committed.

## Resuming after an interruption

1. Check this table for the first `not started` (or `pending` with no
   commit) batch.
2. Read that batch's image list from `content/alt-text/batches.json`
   (`batches[N-1]`, 0-indexed).
3. Cross-check against `content/photo-alt-text.json` — any id already
   present as a key is done; skip it even mid-batch.
4. Follow `content/alt-text/keywords.md` for tone/keyword guidance.
5. For each image: build its Cloudinary URL from the id (cloud name is
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env.local`) at a small width
   (e.g. `.../image/upload/w_500,q_auto,f_auto/<id>`), download it, look at
   it, write one accurate, non-generic alt text (~70-150 chars), add it to
   `content/photo-alt-text.json`.
6. Commit + push that batch's JSON update, then update this table.
