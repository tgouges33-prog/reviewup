import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://klevano.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cgu`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
