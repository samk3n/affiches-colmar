"use client";

import { useScroll, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ScrollSequenceProps {
    frameCount: number;
    // Function to get the path for a given frame index
    getFramePath: (index: number) => string;
}

export default function ScrollSequence({ frameCount, getFramePath }: ScrollSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    // We need to track the current frame index visually
    const scrollIndex = useMotionValue(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll (0 to 1) to frame index (0 to frameCount-1)
    const indexTransform = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1], { clamp: true });

    useEffect(() => {
        // Sync the motion value
        const unsubscribe = indexTransform.on("change", (latest) => {
            scrollIndex.set(latest);
            renderFrame(Math.round(latest));
        });
        return () => unsubscribe();
    }, [indexTransform, scrollIndex, images]);

    // Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];
        const promises: Promise<void>[] = [];

        for (let i = 0; i < frameCount; i++) {
            const promise = new Promise<void>((resolve) => {
                const img = new Image();
                img.src = getFramePath(i);
                img.onload = () => {
                    loadedCount++;
                    setLoadProgress((loadedCount / frameCount) * 100);
                    resolve();
                };
                img.onerror = () => {
                    // Skip error frames or handle gracefully
                    console.error(`Failed to load frame ${i}`);
                    resolve();
                };
                imgArray[i] = img;
            });
            promises.push(promise);
        }

        Promise.all(promises).then(() => {
            setImages(imgArray);
            setIsLoading(false);
            console.log("Images loaded:", imgArray.length);
        });
    }, [frameCount, getFramePath]);

    // Initial Render Effect
    useEffect(() => {
        if (!isLoading && images.length > 0) {
            // Force a render of the first frame once loading is done
            // Use a small timeout to ensure layout is stable
            const timer = setTimeout(() => {
                renderFrame(0);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isLoading, images]);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = images[index];

        if (!canvas || !ctx || !img) {
            // console.warn("Missing canvas or image for frame", index);
            return;
        }
        // console.log("Rendering frame", index);

        // Handle high pixel density
        const dpr = window.devicePixelRatio || 1;

        // Check if canvas size matches window size (responsive)
        // We rely on ResizeObserver or simple client check usually, 
        // but for now let's ensure canvas internal matches display.
        const rect = canvas.getBoundingClientRect();

        // Only resize if necessary to avoid clearing canvas frequently
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        // Object-cover logic
        // Calculate aspect ratios
        const canvasAspect = rect.width / rect.height;
        const imgAspect = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            // Canvas is wider than image -> match width
            drawWidth = rect.width;
            drawHeight = rect.width / imgAspect;
            offsetX = 0;
            offsetY = (rect.height - drawHeight) / 2;
        } else {
            // Canvas is taller -> match height
            drawHeight = rect.height;
            drawWidth = rect.height * imgAspect;
            offsetX = (rect.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            // Re-render current frame on resize
            renderFrame(Math.round(scrollIndex.get()));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [scrollIndex, images]); // Depend on images so we can render if they are loaded

    return (
        <div ref={containerRef} className="h-[500vh] relative bg-timber">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-cream z-50">
                        <div className="text-center">
                            <p className="font-serif text-2xl mb-2 text-timber">Chargement de l'expérience</p>
                            <div className="w-64 h-1 bg-timber/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-brick transition-all duration-300 ease-out"
                                    style={{ width: `${loadProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="w-full h-full block object-cover"
                />

                {/* Optional Text Overlays based on scroll progress can go here or in parent */}
            </div>
        </div>
    );
}
