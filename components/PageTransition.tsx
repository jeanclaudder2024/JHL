import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
    children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const curveRef = useRef<SVGPathElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [displayChildren, setDisplayChildren] = useState(children);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevPath = useRef(location.pathname);

    // Animation on route change
    useLayoutEffect(() => {
        if (location.pathname !== prevPath.current && !isAnimating) {
            setIsAnimating(true);

            const ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        setDisplayChildren(children);
                        prevPath.current = location.pathname;

                        // Animate out
                        gsap.timeline()
                            .to(overlayRef.current, {
                                y: '-100%',
                                duration: 0.6,
                                ease: 'power3.inOut'
                            })
                            .to(curveRef.current, {
                                attr: { d: 'M 0 0 Q 50 0, 100 0 L 100 0 L 0 0' },
                                duration: 0.6,
                                ease: 'power3.inOut'
                            }, '-=0.6')
                            .set(overlayRef.current, { y: '100%' })
                            .set(curveRef.current, {
                                attr: { d: 'M 0 100 Q 50 100, 100 100 L 100 100 L 0 100' }
                            })
                            .call(() => setIsAnimating(false));
                    }
                });

                // Set initial state
                gsap.set(overlayRef.current, { y: '100%' });
                gsap.set(curveRef.current, {
                    attr: { d: 'M 0 100 Q 50 100, 100 100 L 100 100 L 0 100' }
                });

                // Animate in
                tl.to(overlayRef.current, {
                    y: '0%',
                    duration: 0.6,
                    ease: 'power3.inOut'
                })
                    .to(curveRef.current, {
                        attr: { d: 'M 0 100 Q 50 120, 100 100 L 100 0 L 0 0' },
                        duration: 0.3,
                        ease: 'power2.out'
                    }, '-=0.4')
                    .to(curveRef.current, {
                        attr: { d: 'M 0 0 Q 50 0, 100 0 L 100 0 L 0 0' },
                        duration: 0.3,
                        ease: 'power2.in'
                    }, '-=0.1');

            }, containerRef);

            return () => ctx.revert();
        } else if (location.pathname === prevPath.current) {
            setDisplayChildren(children);
        }
    }, [location.pathname, children, isAnimating]);

    // Initial render
    useLayoutEffect(() => {
        gsap.set(overlayRef.current, { y: '100%' });
    }, []);

    return (
        <div ref={containerRef} className="relative">
            {displayChildren}

            {/* Curved Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[9998] pointer-events-none"
                style={{ transform: 'translateY(100%)' }}
            >
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        ref={curveRef}
                        d="M 0 100 Q 50 100, 100 100 L 100 100 L 0 100"
                        fill="#000000"
                    />
                </svg>
            </div>
        </div>
    );
};
