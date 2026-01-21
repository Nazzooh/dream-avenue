import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroScroll() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    // Load images
    useEffect(() => {
        const loadImages = async () => {
            // @ts-ignore
            const imageModules = import.meta.glob('../assets/hero-sequence/*.jpg', { eager: true, query: '?url', import: 'default' });
            const imagePaths = Object.keys(imageModules).sort();

            let loadedCount = 0;
            const total = imagePaths.length;

            const promises = imagePaths.map((path) => {
                return new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.src = imageModules[path] as string;
                    img.onload = () => {
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / total) * 100));
                        resolve(img);
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${path}`);
                        // Resolve with the image object anyway to avoid breaking Promise.all
                        // It will just be a broken image, or we could handle it better, but for now this prevents full crash
                        resolve(img);
                    };
                });
            });

            try {
                const sortedImages = await Promise.all(promises);
                setImages(sortedImages);
                setLoading(false);
            } catch (error) {
                console.error("Error loading hero images:", error);
                setLoading(false);
            }
        };

        loadImages();
    }, []);

    // Scroll logic
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const currentIndex = useTransform(scrollYProgress, [0, 1], [0, 239]);

    // Render loop
    useEffect(() => {
        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas || images.length === 0) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Calculate index
            let index = Math.floor(currentIndex.get());
            index = Math.max(0, Math.min(index, images.length - 1));

            const img = images[index];
            if (!img) return;

            // Set canvas size (handling responsive cover)
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            if (canvas.width !== windowWidth || canvas.height !== windowHeight) {
                canvas.width = windowWidth;
                canvas.height = windowHeight;
            }

            // Draw image cover
            const imgRatio = 1920 / 1080; // Assuming 16:9 frames based on 1080p source
            const winRatio = windowWidth / windowHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (winRatio > imgRatio) {
                drawWidth = windowWidth;
                drawHeight = windowWidth / imgRatio;
                offsetX = 0;
                offsetY = (windowHeight - drawHeight) / 2;
            } else {
                drawWidth = windowHeight * imgRatio;
                drawHeight = windowHeight;
                offsetX = (windowWidth - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.clearRect(0, 0, windowWidth, windowHeight);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

            requestAnimationFrame(render);
        };

        const frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [currentIndex, images]); // Re-run if images change, but rely on RAF for scroll updates

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black text-[#C8D46B]">
                        <div className="text-2xl font-light tracking-widest">
                            LOADING {loadProgress}%
                        </div>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Content Overlay - Existing Hero Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white pointer-events-none">
                    {/* Dark Gradient Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

                    <div className="relative z-20 text-center px-4 max-w-5xl mx-auto space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white">
                                Unfolding <span className="text-[#C8D46B]">Perfection</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto">
                                Experience the ultimate luxury for your grandest celebrations at Calicut's premier convention center.
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex flex-col md:flex-row gap-4 justify-center pointer-events-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <button
                                onClick={() => navigate('/booking')}
                                className="px-8 py-4 bg-[#C8D46B] text-black font-semibold rounded-full hover:bg-[#b0bd55] transition-all flex items-center gap-2"
                            >
                                Plan Your Event <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => document.getElementById('facilities')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
                            >
                                Explore Facilities
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 animate-bounce"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <ChevronDown size={32} />
                </motion.div>
            </div>
        </div>
    );
}
