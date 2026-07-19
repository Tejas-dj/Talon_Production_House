import { readFileSync } from "node:fs";

const projects = JSON.parse(readFileSync("content/projects.json", "utf8"));
const photography = JSON.parse(readFileSync("content/photography.json", "utf8"));
const studio = JSON.parse(readFileSync("content/studio.json", "utf8"));

const violations = [];
function check(label, str, min, max) {
  const len = str.length;
  if (len < min || len > max)
    violations.push(`${label}: ${len} ch (want ${min}-${max}) -> "${str}"`);
}

for (const p of projects) {
  check(`project ${p.slug} title`, p.title, 18, 48);
  check(`project ${p.slug} client`, p.client, 8, 28);
  check(`project ${p.slug} runtime`, p.runtime, 5, 8);
  check(`project ${p.slug} role`, p.role, 8, 22);
  check(`project ${p.slug} category`, p.category, 6, 14);
  check(`project ${p.slug} synopsis`, p.synopsis, 300, 600);
  for (const c of p.credits) {
    check(`project ${p.slug} credit.role "${c.role}"`, c.role, 8, 22);
    check(`project ${p.slug} credit.name "${c.name}"`, c.name, 8, 28);
  }
  if (p.credits.length < 4 || p.credits.length > 10)
    violations.push(`project ${p.slug} credits count: ${p.credits.length} (want 4-10)`);
  if (p.stillImageIds.length < 2 || p.stillImageIds.length > 3)
    violations.push(`project ${p.slug} stillImageIds count: ${p.stillImageIds.length} (want 2-3)`);
}

for (const s of photography) {
  check(`series ${s.slug} title`, s.title, 12, 30);
  check(`series ${s.slug} statement`, s.statement, 60, 110);
}

for (const st of studio) {
  check(`studio ${st.slug} name`, st.name, 12, 24);
  check(`studio ${st.slug} location`, st.location, 16, 32);
  check(`studio ${st.slug} specs.dimensions`, st.specs.dimensions, 20, 40);
  check(`studio ${st.slug} specs.cycWall`, st.specs.cycWall, 20, 40);
  check(`studio ${st.slug} specs.power`, st.specs.power, 20, 40);
  check(`studio ${st.slug} specs.sound`, st.specs.sound, 20, 40);
  check(`studio ${st.slug} specs.amenities`, st.specs.amenities, 20, 44);
  for (const g of st.specs.gripAndLighting) {
    check(`studio ${st.slug} gripAndLighting "${g}"`, g, 20, 44);
  }
  if (st.specs.gripAndLighting.length < 4 || st.specs.gripAndLighting.length > 10)
    violations.push(
      `studio ${st.slug} gripAndLighting count: ${st.specs.gripAndLighting.length} (want 6-10, allowing 4+ as placeholder minimum)`,
    );
  check(`studio ${st.slug} terms`, st.terms, 60, 120);
  check(`studio ${st.slug} whatsappCtaText`, st.whatsappCtaText, 20, 34);
  for (const key of ["hourly", "halfDay", "fullDay"]) {
    const row = st.rates[key];
    check(`studio ${st.slug} rates.${key}.item`, row.item, 10, 24);
    check(`studio ${st.slug} rates.${key}.price`, row.price, 6, 10);
  }
  for (const row of st.rates.equipmentAddOns) {
    check(`studio ${st.slug} equipmentAddOns.item "${row.item}"`, row.item, 12, 30);
    check(`studio ${st.slug} equipmentAddOns.price "${row.price}"`, row.price, 6, 10);
  }
}

if (violations.length === 0) {
  console.log("All fields within budget.");
} else {
  console.log(`${violations.length} violation(s):`);
  violations.forEach((v) => console.log(" - " + v));
}
