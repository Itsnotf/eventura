import { type BrandPortfolio } from '@/types';
import { useRef, useState, type ReactNode } from 'react';

export function PortfolioThumbnail({
    portfolio,
    className,
    fallback,
    children,
}: {
    portfolio: BrandPortfolio;
    className?: string;
    fallback?: ReactNode;
    children?: ReactNode;
}) {
    const [hovering, setHovering] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const thumb = portfolio.images?.[0];

    function handleEnter() {
        setHovering(true);
        videoRef.current?.play().catch(() => {});
    }

    function handleLeave() {
        setHovering(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }

    return (
        <div
            className={`relative overflow-hidden bg-lp-surface-container ${className ?? ''}`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {thumb ? (
                <img
                    src={`/storage/${thumb.image}`}
                    alt={portfolio.title}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${hovering && portfolio.video ? 'opacity-0' : 'opacity-100'}`}
                />
            ) : (
                fallback ?? (
                    <div className="w-full h-full flex items-center justify-center text-lp-on-surface-variant text-sm">
                        Tidak ada foto
                    </div>
                )
            )}
            {portfolio.video && (
                <video
                    ref={videoRef}
                    src={`/storage/${portfolio.video}`}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}
                />
            )}
            {children}
        </div>
    );
}
