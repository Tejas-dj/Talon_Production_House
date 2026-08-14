# Alt-text keyword guidance

Written from the site's own content (`content/photography.json`, `content/studio.json`)
plus the Cloudinary folder names (which mirror the series titles exactly — no
extra categorization hidden there). Ground truth for "what is this actually
a photo of" still comes from looking at each image; this file is the
per-series *angle*, not a substitute for looking.

## Rules for every alt text (read this before writing any)

1. **Describe the actual photo first.** What's really in frame — subject,
   pose/action, setting, light — based on looking at the image. Never invent
   detail you can't see (no guessed locations, no guessed brand names beyond
   what the series data already states).
2. **Work in one, at most two, of the phrases below per image** — naturally,
   as part of a real descriptive sentence. Never a keyword tacked onto the
   end. If a phrase doesn't fit the actual photo, drop it — a plain accurate
   description beats a forced keyword.
3. **No repeated sentences within a series.** Every image in "Faces in
   Frame" is a portrait, but each alt should differ in what pose/expression/
   framing it names — vary the sentence structure too, not just the number.
4. **No generic filler words** as the payload — "image", "photo", "picture
   of" adds nothing; say what's *in* it instead.
5. **Length**: roughly 70–150 characters. Long enough to be specific, short
   enough that a screen reader isn't reading a paragraph.
6. **Talon Production House is a Bengaluru-based production house** — that
   fact can anchor a handful of images (especially studio/portrait work) but
   should not appear on every single one, or it reads as stuffing.

## Per-series angle

**coastline-reverie** ("Coastline Reverie") — portrait series shot on a
volcanic-rock coastline at golden hour.
Angle: *golden hour portrait photography*, *coastal location photoshoot*,
*natural light portrait session*. Describe actual pose/setting per image
(sitting on rocks, walking the shoreline, silhouette against the sky, etc.)
— don't claim a specific place name (e.g. "Goa") since that isn't confirmed
in the source data.

**faces-in-frame** ("Faces in Frame") — studio portrait series, dramatic
single-light setup, headshot to half-body framing.
Angle: *studio portrait photography*, *dramatic lighting headshot*,
*professional portrait photoshoot Bengaluru*. Vary: close-up vs half-body,
expression (serious, candid, laughing), lighting side.

**indyvarna-the-lookbook** ("INDYVARNA | The Lookbook") — full apparel
catalog/lookbook shoot for the clothing label INDYVARNA.
Angle: *fashion lookbook photography*, *clothing brand catalog shoot*,
*apparel product photography*, *fashion editorial photoshoot*. Describe the
actual garment/pose/backdrop per image — this is the largest series (68
images) so precision here matters most for avoiding repetition.

**the-ensemble** ("The Ensemble") — group portrait series, all-black
wardrobe, studio, dramatic light.
Angle: *group portrait photography*, *studio ensemble photoshoot*,
*monochrome group portrait*. Note how many people/arrangement per image.

**behind-the-hymn** ("Behind the Hymn") — on-set production stills from a
devotional/community music video shoot.
Angle: *behind-the-scenes production photography*, *music video BTS stills*,
*on-set documentation*. Describe what's actually happening on set (crew,
setup, candid moment) rather than claiming performance shots unless the
photo shows one.

**draped-in-legacy** ("Draped in Legacy") — editorial portrait series,
silk and gold, heritage styling.
Angle: *editorial heritage portrait photography*, *traditional silk saree
photoshoot*, *cultural fashion editorial*. Describe drape/jewellery/pose
specifics per image.

**eva-chemlinks** ("EVA CHEMLINKS") — product photography for an industrial
client.
Angle: *industrial product photography*, *commercial product photoshoot*.
Name the actual product/material texture visible per image rather than a
generic "product shot".

**skill-beyond-education** ("Skill Beyond Education | Event Coverage") — live
event documentation for an education-initiative event.
Angle: *corporate event photography*, *candid event coverage*, *conference
documentation photography*. Describe what's actually happening (speaker,
audience, keynote moment, group shot).

**talon-studio** (Studio page: hero + 2 interior shots, J. P. Nagar,
Bengaluru) — the physical rental studio itself.
Angle: *photography studio rental Bengaluru*, *J. P. Nagar studio space*,
*production studio interior*. Describe the actual backdrop/lighting rig/
room visible — this is the studio Talon rents out, so accuracy here doubles
as a real product description for potential renters.

## What NOT to do

- Don't force "Bengaluru" or "Talon Production House" into every alt — a few
  is enough, the rest should read as natural photo descriptions.
- Don't write the exact same template with only the number changing (that's
  the current state — it's exactly what we're fixing).
- Don't claim things not visible (named locations, brand names not already
  in the source JSON, emotions you can't actually see).
