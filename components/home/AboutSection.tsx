import Image from "next/image";

export default function AboutSection() {
    return (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-cream text-timber relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text Column */}
                <div className="space-y-8">
                    <h2 className="font-serif text-5xl md:text-6xl leading-tight">
                        Plus qu'un souvenir.<br />Un morceau d'<span className="text-brick italic">histoire</span>.
                    </h2>
                    <div className="space-y-6 text-lg font-light leading-relaxed opacity-90">
                        <p>
                            Colmar n'est pas juste une destination, c'est une <strong>identité</strong>. Du bruissement de la Lauch aux ombres portées des colombages, chaque coin de rue raconte une histoire que les vrais colmariens connaissent.
                        </p>
                        <p>
                            Nos affiches sont conçues pour ceux qui portent l'Alsace au cœur. <strong>Imaginées et imprimées en France</strong>, elles ne capturent pas seulement une vue, mais l'émotion d'être chez soi.
                        </p>
                    </div>
                    <button className="group mt-4 px-8 py-3 border border-timber rounded-full uppercase tracking-widest text-sm hover:bg-timber hover:text-cream transition-colors duration-300">
                        Notre Histoire
                    </button>
                </div>

                {/* Image Column */}
                <div className="relative">
                    <div className="relative aspect-4/5 rounded-md overflow-hidden shadow-2xl skew-y-1 transform transition-transform duration-700 hover:skew-y-0">
                        {/* Placeholder for now - normally would be a specific Colmar photo */}
                        <div className="absolute inset-0 bg-teal/20 mix-blend-multiply z-10"></div>
                        {/* Using a placeholder frame from our sequence or a solid color for mock */}
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-timber/30 font-serif text-4xl">
                            [About Image]
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-brick/40"></div>
                    <div className="absolute -top-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-brick/40"></div>
                </div>
            </div>
        </section>
    );
}
