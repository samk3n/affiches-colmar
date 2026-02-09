import Image from "next/image";
import { ShoppingCart } from "lucide-react";

const PRODUCTS = [
    {
        id: 1,
        title: "La Petite Venise",
        price: "19,90 €",
        image: "/sequence/frame_100.jpg",
        description: "Le clapotis de l'eau et les façades colorées. Une fenêtre ouverte sur la douceur de vivre colmarienne.",
    },
    {
        id: 2,
        title: "Maison Pfister",
        price: "19,90 €",
        image: "/sequence/frame_050.jpg",
        description: "Symbolique et intemporelle. L'élégance de la Renaissance renaît dans votre salon.",
    },
    {
        id: 3,
        title: "Canal au Printemps",
        price: "19,90 €",
        image: "/sequence/frame_150.jpg",
        description: "La Lauch en fleurs. Un instant de poésie pure pour illuminer votre intérieur.",
    },
];

export default function ProductGrid() {
    return (
        <section className="py-24 px-6 bg-cream text-timber">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="font-serif text-4xl md:text-5xl">Invitez Colmar chez Vous</h2>
                    <p className="max-w-xl mx-auto text-lg opacity-80">
                        Ces rues que vous connaissez par cœur. Ces lumières qui ont bercé votre enfance. Redécouvrez Colmar.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {PRODUCTS.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            {/* Card Frame */}
                            <div className="relative aspect-3/4 p-6 bg-white shadow-xl transition-transform duration-500 ease-out group-hover:-translate-y-2">
                                <div className="relative w-full h-full border border-gray-100 overflow-hidden">
                                    {/* Image */}
                                    <div className="absolute inset-0 bg-gray-200">
                                        <Image
                                            src={product.image}
                                            alt={product.description || product.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Overlay Button */}
                                    <div className="absolute inset-0 bg-timber/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button className="bg-cream text-timber px-6 py-3 rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:bg-timber hover:text-cream">
                                            <ShoppingCart size={18} />
                                            Ajouter au Panier
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-6 text-center space-y-1">
                                <h3 className="font-serif text-2xl">{product.title}</h3>
                                <p className="text-brick font-medium">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <button className="px-10 py-4 bg-timber text-cream rounded-sm uppercase tracking-widest text-sm hover:bg-brick transition-colors duration-300 shadow-xl">
                        Redécouvrir ma ville
                    </button>
                </div>
            </div>
        </section>
    );
}
