import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
await sharp("design/fleet-hero-source.png")
  .resize({ width: 1536, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile("public/images/fleet-hero.webp");
await sharp("design/cstt-mark-source.png")
  .trim()
  .resize({ width: 480 })
  .png()
  .toFile("public/images/cstt-mark.png");
await sharp("design/cstt-mark-source.png")
  .trim()
  .resize({ width: 64, height: 64, fit: "contain", background: "#ffffff" })
  .png()
  .toFile("public/images/favicon.png");
console.log(
  "Optimized fleet image, transparent logo and favicon saved to public/images.",
);
