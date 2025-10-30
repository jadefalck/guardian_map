import fs from "node:fs";
import path from "node:path";

const SITE = "https://guardianmap.com";
const routesTxt = fs.readFileSync("scripts/routes.txt", "utf8")
  .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

// encodage propre des URLs (accents/espaces)
const urlTag = (p) => {
  const loc = `${SITE}${encodeURI(p === "/" ? "" : p)}`;
  const lastmod = new Date().toISOString();
  const changefreq = p === "/" || p.startsWith("/continents") || p.startsWith("/pays2") ? "weekly" : "monthly";
  const priority = p === "/" || p.startsWith("/continents") ? "1.0" : "0.8";
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routesTxt.map(urlTag).join("\n")}
</urlset>`;

fs.mkdirSync("public", { recursive: true });
fs.writeFileSync(path.join("public","sitemap.xml"), xml, "utf8");
console.log("✅ sitemap.xml généré -> public/sitemap.xml (", routesTxt.length, "URL )");
