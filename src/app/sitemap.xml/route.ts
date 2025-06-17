import { db } from "@/utils/firebase/Firebase";

import { collection, getDocs } from "firebase/firestore";

import { slugify } from "@/base/helper/helpers";

import metadata from "@/base/meta/Metadata";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

const SITE_NAME = metadata.openGraph.siteName;

const SITE_DESCRIPTION = metadata.openGraph.description;

// Add XML escape function
function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

interface BlogData {
    slug: string;
}

interface ContentData {
    title: string;
}

async function getBlogSlugs() {
    try {
        const blogsRef = collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_BLOG as string);
        const querySnapshot = await getDocs(blogsRef);
        const blogs = querySnapshot.docs.map(doc => doc.data() as BlogData);
        return blogs.map((blog) => blog.slug);
    } catch (error) {
        console.error("Error fetching blog slugs:", error);
        return [];
    }
}

async function getProducts() {
    try {
        const productsRef = collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string);
        const querySnapshot = await getDocs(productsRef);
        const products = querySnapshot.docs.map(doc => doc.data() as ContentData);
        const titles = new Set<string>();

        products.forEach((product) => {
            if (product.title) {
                titles.add(product.title);
            }
        });

        return Array.from(titles);
    } catch (error) {
        console.error("Error fetching product titles:", error);
        return [];
    }
}

async function getAbout() {
    try {
        const aboutRef = collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_ABOUT_CONTENT as string);
        const querySnapshot = await getDocs(aboutRef);
        const about = querySnapshot.docs.map(doc => doc.data() as ContentData);
        const titles = new Set<string>();

        about.forEach((item) => {
            if (item.title) {
                titles.add(item.title);
            }
        });

        return Array.from(titles);
    } catch (error) {
        console.error("Error fetching about titles:", error);
        return [];
    }
}

async function getGallery() {
    try {
        const galleryRef = collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_GALLERY as string);
        const querySnapshot = await getDocs(galleryRef);
        const gallery = querySnapshot.docs.map(doc => doc.data() as ContentData);
        const titles = new Set<string>();

        gallery.forEach((item) => {
            if (item.title) {
                titles.add(item.title);
            }
        });

        return Array.from(titles);
    } catch (error) {
        console.error("Error fetching gallery titles:", error);
        return [];
    }
}

async function generateSitemap() {
    const blogSlugs = await getBlogSlugs();
    const productTitles = await getProducts();
    const aboutTitles = await getAbout();
    const galleryTitles = await getGallery();

    const staticUrls = [
        "/",
        "/about",
        "/products",
        "/blog",
        "/gallery",
    ];

    const dynamicUrls = [
        ...blogSlugs.map((slug) => `/blog/${slug}`),
        ...productTitles.map((title) => `/products/${slugify(title)}`),
    ];

    const urls = [...staticUrls, ...dynamicUrls];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
            .map((url) => {
                const isHomePage = url === "/";
                const path = url.split("/").pop() || "";
                const title = isHomePage
                    ? metadata.title
                    : `${path.charAt(0).toUpperCase() + path.slice(1)} | ${SITE_NAME}`;
                const description = isHomePage
                    ? SITE_DESCRIPTION
                    : `${title} - ${SITE_DESCRIPTION}`;

                return `
  <url>
    <loc>${escapeXml(BASE_URL)}${escapeXml(url)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="${escapeXml(
                    metadata.openGraph.locale
                )}" href="${escapeXml(BASE_URL)}${escapeXml(url)}" />
    <image:image>
      <image:loc>${escapeXml(BASE_URL)}${escapeXml(
                    metadata.openGraph.images[0].url
                )}</image:loc>
      <image:title>${escapeXml(metadata.openGraph.images[0].alt)}</image:title>
      <image:caption>${escapeXml(description)}</image:caption>
      <image:license>${escapeXml(SITE_NAME)}</image:license>
    </image:image>
  </url>`;
            })
            .join("")}
</urlset>`;

    return sitemapXml;
}

export async function GET() {
    try {
        const body = await generateSitemap();

        return new Response(body, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control":
                    "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        console.error("Error generating sitemap:", error);

        // Fallback to basic sitemap with static URLs only
        const staticUrls = [
            "/",
            "/about",
            "/products",
            "/blog",
            "/gallery",
        ];

        const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
                .map((url) => `
  <url>
    <loc>${escapeXml(BASE_URL)}${escapeXml(url)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
                .join("")}
</urlset>`;

        return new Response(fallbackSitemap, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    }
}