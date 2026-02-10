// src/seo/usePageSeo.js
import { useEffect } from "react";

function upsertMetaByName(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProperty(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLinkRel(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function usePageSeo({
  title,
  description,
  canonical,
  ogImage,
  ogTitle,
  ogDescription,
}) {
  useEffect(() => {
    if (title) document.title = title;

    upsertMetaByName("description", description);

    // Canonical
    upsertLinkRel("canonical", canonical);

    // Open Graph
    upsertMetaByProperty("og:title", ogTitle || title);
    upsertMetaByProperty("og:description", ogDescription || description);
    upsertMetaByProperty("og:url", canonical);
    upsertMetaByProperty("og:image", ogImage);

    // (optionnel mais utile)
    upsertMetaByName("twitter:card", "summary_large_image");
    upsertMetaByName("twitter:title", ogTitle || title);
    upsertMetaByName("twitter:description", ogDescription || description);
    upsertMetaByName("twitter:image", ogImage);
  }, [title, description, canonical, ogImage, ogTitle, ogDescription]);
}
