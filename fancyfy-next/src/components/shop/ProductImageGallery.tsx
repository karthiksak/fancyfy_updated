"use client";

import { useState } from "react";

interface Props {
    images: string[];
    productName: string;
}

export default function ProductImageGallery({ images, productName }: Props) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <div className="space-y-3">
            {/* Main Image — constrained height on mobile */}
            <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm aspect-square md:aspect-square max-h-[70vw] md:max-h-none w-full">
                <img
                    src={images[selectedIndex] || "/placeholder.svg"}
                    alt={productName}
                    className="object-cover w-full h-full transition-opacity duration-300"
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">NEW</span>
                </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedIndex === i
                                ? "border-pink-500 shadow-md scale-95"
                                : "border-transparent hover:border-pink-200"
                                }`}
                        >
                            <img src={img} alt="" className="object-cover w-full h-full" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
