export default function GlobalJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://colmar-posters.com/#organization",
                "name": "Colmar Posters",
                "url": "https://colmar-posters.com",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://colmar-posters.com/logo.png",
                    "width": 112,
                    "height": 112
                },
                "sameAs": [
                    "https://www.instagram.com/colmarposters",
                    "https://www.pinterest.com/colmarposters"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+33-3-89-20-68-92",
                    "contactType": "customer service",
                    "areaServed": "FR",
                    "availableLanguage": "French"
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://colmar-posters.com/#website",
                "url": "https://colmar-posters.com",
                "name": "Colmar Posters",
                "description": "Affiches vintage et décoration alsacienne",
                "publisher": {
                    "@id": "https://colmar-posters.com/#organization"
                },
                "inLanguage": "fr-FR"
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
