import { useEffect } from "react";

function upsertMeta({ name, property, content }) {
  if (!content) return;

  const selector = name
    ? `meta[name="${name}"]`
    : `meta[property="${property}"]`;

  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement("meta");
    if (name) el.setAttribute("name", name);
    if (property) el.setAttribute("property", property);
    document.head.appendChild(el);
  }

  el.setAttribute("content", content);
}

function upsertLink({ rel, href }) {
  if (!href) return;

  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function usePageSeo({ title, description, canonical, ogImage, type = "website" }) {
  useEffect(() => {
    if (title) document.title = title;

    // Basic SEO
    upsertMeta({ name: "description", content: description });
    upsertLink({ rel: "canonical", href: canonical });

    // Open Graph
    upsertMeta({ property: "og:type", content: type });
    upsertMeta({ property: "og:title", content: title });
    upsertMeta({ property: "og:description", content: description });
    upsertMeta({ property: "og:url", content: canonical });
    upsertMeta({ property: "og:image", content: ogImage });

    // Twitter
    upsertMeta({ name: "twitter:card", content: "summary_large_image" });
    upsertMeta({ name: "twitter:title", content: title });
    upsertMeta({ name: "twitter:description", content: description });
    upsertMeta({ name: "twitter:image", content: ogImage });
  }, [title, description, canonical, ogImage, type]);
}
