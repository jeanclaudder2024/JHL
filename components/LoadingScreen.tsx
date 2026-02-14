import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
    onComplete?: () => void;
    minDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    onComplete,
    minDuration = 3500
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isComplete, setIsComplete] = useState(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Master timeline
            const tl = gsap.timeline({
                onComplete: () => {
                    setTimeout(() => {
                        setIsComplete(true);
                        onComplete?.();
                    }, 400);
                }
            });

            // Initial states
            gsap.set('.logo-mask', { clipPath: 'inset(0 100% 0 0)' });
            gsap.set('.logo-container', { opacity: 0, scale: 0.9 });
            gsap.set('.loader-text-char', { y: 60, opacity: 0, rotateX: -90 });
            gsap.set('.loader-line-left', { scaleX: 0, transformOrigin: 'right center' });
            gsap.set('.loader-line-right', { scaleX: 0, transformOrigin: 'left center' });
            gsap.set('.loader-diamond', { scale: 0, opacity: 0, rotation: -180 });
            gsap.set('.loader-tagline', { y: 30, opacity: 0 });
            gsap.set('.loader-progress', { scaleX: 0, transformOrigin: 'left center' });
            gsap.set('.loader-particle', { scale: 0, opacity: 0 });

            // Animation sequence
            // 1. Fade in logo container
            tl.to('.logo-container', {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'power3.out'
            })

                // 2. Draw/reveal the logo with clip-path
                .to('.logo-mask', {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 2,
                    ease: 'power2.inOut'
                })

                // 3. Logo pulse after reveal
                .to('.logo-container', {
                    scale: 1.02,
                    duration: 0.25,
                    ease: 'power2.inOut',
                    yoyo: true,
                    repeat: 1
                }, '-=0.3')

                // 4. Text reveal with 3D flip
                .to('.loader-text-char', {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    duration: 0.7,
                    stagger: 0.04,
                    ease: 'back.out(1.4)'
                }, '-=0.4')

                // 5. Diamond spin in
                .to('.loader-diamond', {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.5,
                    ease: 'back.out(2)'
                }, '-=0.5')

                // 6. Lines sweep in from diamond
                .to('.loader-line-left', {
                    scaleX: 1,
                    duration: 0.6,
                    ease: 'power4.out'
                }, '-=0.3')
                .to('.loader-line-right', {
                    scaleX: 1,
                    duration: 0.6,
                    ease: 'power4.out'
                }, '-=0.6')

                // 7. Tagline fade in
                .to('.loader-tagline', {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.out'
                }, '-=0.2')

                // 8. Progress bar animation
                .to('.loader-progress', {
                    scaleX: 1,
                    duration: 1.2,
                    ease: 'power2.inOut'
                }, '-=0.3')

                // 9. Floating particles
                .to('.loader-particle', {
                    scale: 1,
                    opacity: 0.5,
                    duration: 0.4,
                    stagger: {
                        each: 0.08,
                        from: 'random'
                    },
                    ease: 'back.out(2)'
                }, '-=1');

            // Continuous animations
            // Logo subtle breathe
            gsap.to('.logo-container', {
                scale: 1.01,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // Particles floating
            gsap.to('.loader-particle', {
                y: '-=25',
                x: 'random(-15, 15)',
                duration: 'random(2.5, 4)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: {
                    each: 0.2,
                    from: 'random'
                }
            });

            // Shimmer effect
            gsap.to('.loader-shimmer', {
                x: '200%',
                duration: 2.5,
                repeat: -1,
                ease: 'power2.inOut',
                repeatDelay: 1.5
            });

        }, containerRef);

        return () => ctx.revert();
    }, [onComplete]);

    // Exit animation
    useLayoutEffect(() => {
        if (isComplete) {
            const ctx = gsap.context(() => {
                gsap.to('.loader-content', {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power3.in'
                });
                gsap.to('.loader-bg', {
                    opacity: 0,
                    duration: 0.6,
                    delay: 0.2,
                    ease: 'power2.inOut'
                });
            }, containerRef);
            return () => ctx.revert();
        }
    }, [isComplete]);

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${isComplete ? 'pointer-events-none' : ''}`}
        >
            {/* Background */}
            <div className="loader-bg absolute inset-0 bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="loader-particle absolute w-1.5 h-1.5 bg-black/20 rounded-full"
                        style={{
                            left: `${12 + (i * 8)}%`,
                            top: `${18 + (i * 6)}%`,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="loader-content relative z-10 flex flex-col items-center">
                {/* Logo with reveal animation */}
                <div className="logo-container relative mb-8">
                    <div className="logo-mask relative overflow-hidden">
                        <img
                            src="./K (4).svg"
                            alt="JHL Logo"
                            className="w-80 h-80 md:w-[420px] md:h-[420px] object-contain"
                        />
                        {/* Shimmer overlay */}
                        <div
                            className="loader-shimmer absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
                                transform: 'translateX(-100%)'
                            }}
                        />
                    </div>
                </div>

                {/* Brand text */}
                <div className="flex items-center justify-center mb-5 overflow-hidden perspective-1000">
                    {'JUST HUMAN LIFE'.split('').map((char, i) => (
                        <span
                            key={i}
                            className="loader-text-char inline-block text-black text-xl md:text-2xl font-serif tracking-[0.25em]"
                            style={{
                                marginRight: char === ' ' ? '0.8rem' : '0',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </div>

                {/* Decorative lines with diamond */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="loader-line-left w-14 h-[1px] bg-gradient-to-r from-transparent via-black/40 to-black" />
                    <div className="loader-diamond w-2 h-2 rotate-45 bg-black/70" />
                    <div className="loader-line-right w-14 h-[1px] bg-gradient-to-l from-transparent via-black/40 to-black" />
                </div>

                {/* Tagline */}
                <p className="loader-tagline text-gray-500 text-[10px] uppercase tracking-[0.35em] mb-10">
                    Premium Meal Experience
                </p>

                {/* Progress bar */}
                <div className="w-44 h-[2px] bg-gray-200 rounded-full overflow-hidden">
                    <div className="loader-progress h-full bg-gradient-to-r from-gray-400 via-black to-gray-400 rounded-full" />
                </div>
            </div>
        </div>
    );
};
