export default function JsonLd() {
    const products = [
        {
            name: "La Petite Venise",
            image: "https://colmar-posters.com/sequence/frame_100.jpg",
            description: "Affiche vintage officielle de La Petite Venise à Colmar, Alsace. Vue emblématique du canal et des maisons à colombages.",
            sku: "CP-001",
            price: "19.90"
        },
        {
            name: "Maison Pfister",
            image: "https://colmar-posters.com/sequence/frame_050.jpg",
            description: "Illustration artistique de la Maison Pfister, joyau de la Renaissance à Colmar. Décoration murale alsacienne idéale.",
            sku: "CP-002",
            price: "19.90"
        },
        {
            name: "Canal au Printemps",
            image: "https://colmar-posters.com/sequence/frame_150.jpg",
            description: "Affiche Colmar au printemps. Fleurs épanouies le long de la Lauch dans le centre historique.",
            sku: "CP-003",
            price: "19.90"
        }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "@id": "https://colmar-posters.com/#localbusiness",
                "parentOrganization": {
                    "@id": "https://colmar-posters.com/#organization"
                },
                "name": "Colmar Posters Store",
                "image": "https://colmar-posters.com/og-image.jpg",
                "description": "Affiches vintage authentiques et décoration murale de Colmar, Alsace.",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Grand Rue",
                    "addressLocality": "Colmar",
                    "addressRegion": "Grand Est",
                    "postalCode": "68000",
                    "addressCountry": "FR"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 48.0794,
                    "longitude": 7.3585
                },
                "url": "https://colmar-posters.com",
                "priceRange": "$$",
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday"
                        ],
                        "opens": "10:00",
                        "closes": "19:00"
                    }
                ]
            },
            {
                "@type": "ItemList",
                "itemListElement": products.map((product, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Product",
                        "name": product.name,
                        "image": product.image,
                        "description": product.description,
                        "sku": product.sku,
                        "brand": {
                            "@type": "Brand",
                            "name": "Colmar Posters"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": "https://colmar-posters.com",
                            "priceCurrency": "EUR",
                            "price": product.price,
                            "availability": "https://schema.org/InStock",
                            "itemCondition": "https://schema.org/NewCondition"
                        }
                    }
                }))
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
