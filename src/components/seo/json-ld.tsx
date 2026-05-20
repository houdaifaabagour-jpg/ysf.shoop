export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ysf.shoop",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop",
          description: "Premium watches and glasses curated for style and precision.",
          logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop"}/favicon.ico`,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+966-XXX-XXXX",
            contactType: "customer service",
          },
          sameAs: [],
        }),
      }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ysf.shoop",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop"}/{locale}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }),
      }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: item.url,
          })),
        }),
      }}
    />
  );
}

export function ItemListSchema({ items }: { items: { name: string; url: string; image?: string }[] }) {
  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            url: item.url,
            image: item.image,
          })),
        }),
      }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  price,
  currency = "SAR",
  url,
  image,
  brand,
  availability,
}: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  url: string;
  image: string;
  brand?: string;
  availability?: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          description,
          image,
          url,
          brand: brand ? { "@type": "Brand", name: brand } : undefined,
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability: availability || "https://schema.org/InStock",
          },
        }),
      }}
    />
  );
}
