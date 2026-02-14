import React, { useState, useRef, useLayoutEffect } from 'react';
import { ArrowRight, Star, X, Check, MapPin, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Refs for animation context
  const mainRef = useRef<HTMLDivElement>(null);

  // Animation Setup - MIND-BLOWING PROFESSIONAL TRANSITIONS
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ==========================================
      // SECTION 1: EPIC HERO ENTRANCE
      // ==========================================

      const heroTl = gsap.timeline();

      // Cinematic curtain reveal
      gsap.set(".hero-section", { overflow: "hidden" });

      // Title letters split animation
      heroTl.from(".hero-title-line", {
        y: 200,
        opacity: 0,
        rotationX: -90,
        transformOrigin: "bottom center",
        duration: 1.8,
        stagger: 0.3,
        ease: "expo.out"
      })
        .from(".hero-sub", {
          y: 60,
          opacity: 0,
          filter: "blur(20px)",
          duration: 1.2,
          ease: "power3.out"
        }, "-=1.2")
        .from(".hero-btn", {
          scale: 0,
          opacity: 0,
          rotation: -180,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(2)"
        }, "-=0.8");

      // Hero parallax on scroll - Multi-layer depth
      gsap.to(".hero-bg", {
        yPercent: 50,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 0.5
        }
      });

      // Hero content floats up and fades
      gsap.to(".hero-section .relative.z-10", {
        y: -200,
        opacity: 0,
        scale: 0.8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "center top",
          end: "bottom top",
          scrub: 0.3
        }
      });

      // ==========================================
      // SECTION 2: PHILOSOPHY - TEXT MASK REVEAL
      // ==========================================

      // Pin the section briefly for dramatic effect
      ScrollTrigger.create({
        trigger: ".philosophy-section",
        start: "top top",
        end: "+=50%",
        pin: true,
        pinSpacing: true
      });

      // Title reveal with clip-path wipe
      gsap.fromTo(".philosophy-content h2",
        {
          clipPath: "inset(0 100% 0 0)",
          opacity: 1
        },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ".philosophy-section",
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Line grows from center
      gsap.fromTo(".philosophy-line",
        { scaleX: 0, transformOrigin: "center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".philosophy-section",
            start: "top 50%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Paragraph fades in with blur
      gsap.fromTo(".philosophy-content p",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".philosophy-section",
            start: "top 40%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // ==========================================
      // SECTION 3: SERVICES - HORIZONTAL SCROLL
      // ==========================================

      const serviceCards = gsap.utils.toArray(".service-card");

      // Each card reveals with a dramatic scale + rotation
      serviceCards.forEach((card: any, i) => {
        // Initial reveal animation
        gsap.fromTo(card,
          {
            opacity: 0,
            scale: 0.6,
            rotationY: 30,
            x: 100
          },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            x: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Image zoom effect on scroll
        gsap.to(card.querySelector("img"), {
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        // Card elevates on hover-like scroll
        gsap.to(card, {
          y: -20,
          boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 70%",
            end: "top 30%",
            scrub: true
          }
        });
      });

      // ==========================================
      // SECTION 4: TESTIMONIAL - CINEMATIC REVEAL
      // ==========================================

      // Background zoom effect
      gsap.fromTo(".testimonial-section",
        { backgroundSize: "150%" },
        {
          backgroundSize: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".testimonial-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

      // Quote reveals word by word effect (simulated)
      gsap.fromTo(".testimonial-content",
        {
          opacity: 0,
          scale: 0.9,
          y: 100
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".testimonial-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Star icon spins in
      gsap.fromTo(".testimonial-section .mx-auto.mb-10",
        { rotation: -360, scale: 0, opacity: 0 },
        {
          rotation: 0,
          scale: 1,
          opacity: 0.4,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ".testimonial-section",
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // ==========================================
      // SECTION 5: ABOUT - SPLIT SCREEN MAGIC
      // ==========================================

      // Image slides in from left with mask
      gsap.fromTo(".about-image",
        {
          clipPath: "inset(0 100% 0 0)",
          x: -100
        },
        {
          clipPath: "inset(0 0% 0 0)",
          x: 0,
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ".about-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Established badge pops
      gsap.fromTo(".about-image .absolute",
        { scale: 0, rotation: -45 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(2)",
          delay: 0.5,
          scrollTrigger: {
            trigger: ".about-section",
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Text elements cascade in
      const aboutTextElements = gsap.utils.toArray(".about-text > *");
      aboutTextElements.forEach((el: any, i) => {
        gsap.fromTo(el,
          {
            opacity: 0,
            x: 100,
            rotationY: -15
          },
          {
            opacity: 1,
            x: 0,
            rotationY: 0,
            duration: 1,
            delay: i * 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: ".about-section",
              start: "top 65%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // ==========================================
      // SECTION 6: STATS - COUNTER EXPLOSION
      // ==========================================

      // Each stat pops with delay from center
      const statItems = gsap.utils.toArray(".stat-item");
      statItems.forEach((stat: any, i) => {
        const direction = i < 2 ? -1 : 1;
        gsap.fromTo(stat,
          {
            opacity: 0,
            scale: 0,
            x: direction * 100,
            rotation: direction * 20
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            rotation: 0,
            duration: 1,
            delay: i * 0.1,
            ease: "elastic.out(1, 0.6)",
            scrollTrigger: {
              trigger: ".stats-section",
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Numbers count up animation (visual effect)
      gsap.fromTo(".stat-item .text-4xl",
        { opacity: 0, scale: 2, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // ==========================================
      // SECTION 7: CONTACT - FORM REVELATION
      // ==========================================

      // Content slides from left
      gsap.fromTo(".contact-content",
        {
          opacity: 0,
          x: -150,
          rotationY: 15
        },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".contact-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Form slides from right
      gsap.fromTo(".contact-form",
        {
          opacity: 0,
          x: 150,
          rotationY: -15
        },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".contact-section",
            start: "top 65%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Form elements stagger reveal
      gsap.fromTo(".contact-form form > *",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-form",
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // ==========================================
      // GLOBAL: SMOOTH SECTION TRANSITIONS
      // ==========================================

      // Create smooth color/mood transitions between sections
      const sections = gsap.utils.toArray("section");
      sections.forEach((section: any) => {
        // Subtle scale effect when entering viewport
        gsap.fromTo(section,
          { opacity: 0.7 },
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 50%",
              scrub: true
            }
          }
        );
      });

      // ==========================================
      // GLOBAL: MAGNETIC CURSOR EFFECT ON BUTTONS
      // ==========================================

      // Add hover-like effect on scroll for all main buttons
      const mainButtons = gsap.utils.toArray(".hero-btn, .service-card .flex.items-center");
      mainButtons.forEach((btn: any) => {
        gsap.to(btn, {
          scale: 1.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: btn,
            start: "top 80%",
            end: "top 40%",
            scrub: true
          }
        });
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      name: "Plat du Jour",
      price: "$35",
      period: "per day",
      description: "Flexibility for the dynamic schedule.",
      features: ["Single Meal Selection", "Standard Delivery", "24h Pre-order required"],
      highlight: false
    },
    {
      name: "The Executive",
      price: billingCycle === 'monthly' ? "$750" : "$8,100",
      period: billingCycle === 'monthly' ? "per month" : "per year",
      description: "Consistent nourishment for peak performance.",
      features: ["Daily Lunch Delivery (M-F)", "Priority Delivery Window", "Menu Customization", "Concierge Access"],
      highlight: true,
      savings: billingCycle === 'annual' ? "Save $900" : null
    },
    {
      name: "The Visionary",
      price: billingCycle === 'monthly' ? "$1,200" : "$12,960",
      period: billingCycle === 'monthly' ? "per month" : "per year",
      description: "A long-term investment in your well-being.",
      features: ["Daily Lunch & Snack (M-F)", "Event Catering Discount (10%)", "Nutritionist Consultation", "White Glove Service"],
      highlight: false,
      savings: billingCycle === 'annual' ? "Save $1,440" : null
    }
  ];

  return (
    <div className="w-full bg-white" ref={mainRef}>
      {/* Hero Section */}
      <section className="hero-section relative h-[95vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-black text-white">
        {/* Parallax Background */}
        <div
          className="hero-bg absolute inset-0 bg-cover bg-center opacity-70 scale-110"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl mb-8 leading-[0.9] tracking-tight">
            <div className="overflow-hidden"><span className="hero-title-line block">Nourish Your</span></div>
            <div className="overflow-hidden"><span className="hero-title-line block italic font-light">Human Experience</span></div>
          </h1>
          <div className="overflow-hidden mb-12">
            <p className="hero-sub text-gray-300 text-base sm:text-lg md:text-xl tracking-wide max-w-2xl mx-auto font-light leading-relaxed">
              Premium meal subscriptions, corporate wellness, and bespoke event catering designed for the modern lifestyle.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsPlansOpen(true)}
              className="hero-btn bg-white text-black px-10 py-4 uppercase tracking-[0.2em] text-xs font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              Explore Services
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="hero-btn border border-white text-white px-10 py-4 uppercase tracking-[0.2em] text-xs font-medium hover:bg-white hover:text-black transition-colors w-full sm:w-auto backdrop-blur-sm"
            >
              Member Access
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy / About Teaser */}
      <section className="philosophy-section py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6 philosophy-content">
          <h2 className="font-serif text-3xl md:text-5xl text-black mb-8">Just Human Life</h2>
          <div className="philosophy-line w-24 h-0.5 bg-black mx-auto mb-10"></div>
          <p className="text-gray-600 leading-relaxed text-lg md:text-2xl font-light">
            We believe that what you consume shapes who you become. JHL is more than a food service;
            it is a commitment to quality, aesthetic, and well-being. Whether you are an individual seeking
            balance or a company fostering culture, we provide the foundation for a life well-lived.
          </p>
        </div>
      </section>

      {/* Services Grid - Ultra Premium Design */}
      <section id="services" className="services-section bg-gradient-to-b from-zinc-950 via-black to-zinc-950 py-32 md:py-48 relative overflow-hidden">
        {/* Animated background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-amber-400/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-amber-300/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
        </div>

        {/* Decorative lines - Gold */}
        <div className="absolute top-0 left-1/2 w-px h-40 bg-gradient-to-b from-transparent via-amber-400/30 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 w-px h-40 bg-gradient-to-t from-transparent via-amber-400/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header - Enhanced */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-400/60"></div>
              <span className="text-xs uppercase tracking-[0.5em] text-amber-400/80">Premium Collection</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-400/60"></div>
            </div>
            <h2 className="font-serif text-5xl md:text-7xl text-white mb-8 leading-tight">
              Curated <span className="italic font-light bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">Experiences</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto font-light mb-8">
              Three pathways to elevating your culinary journey
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-1 h-1 bg-amber-400/60 rounded-full"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="w-2 h-2 rotate-45 border border-amber-400/40"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="w-1 h-1 bg-amber-400/60 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* Service 1 - The Daily Ritual */}
            <div
              className="service-card group cursor-pointer relative"
              onClick={() => setIsPlansOpen(true)}
            >
              {/* Card glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>

              {/* Card container */}
              <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-10 h-full transition-all duration-700 group-hover:border-amber-400/30 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
                {/* Number indicator with gradient */}
                <div className="absolute -top-5 -left-5 w-14 h-14 bg-gradient-to-br from-white to-gray-200 text-black flex items-center justify-center font-serif text-xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-amber-400/30">
                  01
                </div>

                {/* Image container with frame */}
                <div className="aspect-[4/3] overflow-hidden mb-10 relative border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop"
                    alt="Premium Meals"
                    className="object-cover w-full h-full transition-all duration-1000 ease-out group-hover:scale-115 filter saturate-50 group-hover:saturate-100"
                  />
                  {/* Corner accents */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-white/20 z-20"></div>
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-white/20 z-20"></div>
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-px bg-amber-400/60"></div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400/80">Individual</span>
                  </div>
                  <h3 className="font-serif text-3xl text-white mb-5 transition-all duration-300 group-hover:text-amber-50">
                    The Daily Ritual
                  </h3>
                  <p className="text-white/40 text-sm mb-10 leading-relaxed font-light">
                    The essential subscription for the discerning professional. Seamless, high-performance nutrition delivered with precision.
                  </p>

                  {/* CTA - Enhanced */}
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-amber-400 transition-colors duration-500">View Plans</span>
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-amber-500 group-hover:border-amber-400 transition-all duration-500 group-hover:scale-110">
                      <ArrowRight size={18} className="text-white/40 group-hover:text-black transition-colors duration-500" />
                    </div>
                  </div>
                </div>

                {/* Animated border line */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 w-0 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>

            {/* Service 2 - Corporate Membership (Featured) */}
            <div
              className="service-card group cursor-pointer relative lg:-mt-10 lg:mb-10"
              onClick={() => navigate('/corporate-application')}
            >
              {/* Enhanced glow for featured */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"></div>

              {/* Featured badge - Gold */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] uppercase tracking-[0.2em] px-6 py-2 shadow-lg shadow-amber-500/30 font-medium">✦ Most Popular ✦</span>
              </div>

              {/* Card container - Featured styling */}
              <div className="relative bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-md border border-amber-400/20 p-10 h-full transition-all duration-700 group-hover:border-amber-400/50 group-hover:shadow-2xl group-hover:shadow-amber-500/20">
                {/* Number indicator - Gold */}
                <div className="absolute -top-5 -left-5 w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 text-black flex items-center justify-center font-serif text-xl shadow-xl shadow-amber-500/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  02
                </div>

                {/* Image container */}
                <div className="aspect-[4/3] overflow-hidden mb-10 relative border border-amber-400/10">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop"
                    alt="Corporate Dining"
                    className="object-cover w-full h-full transition-all duration-1000 ease-out group-hover:scale-115 filter saturate-50 group-hover:saturate-100"
                  />
                  {/* Gold corner accents */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-amber-400/40 z-20"></div>
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-amber-400/40 z-20"></div>
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-px bg-amber-400"></div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400">Business</span>
                  </div>
                  <h3 className="font-serif text-3xl text-white mb-5 transition-all duration-300 group-hover:text-amber-100">
                    Corporate Membership
                  </h3>
                  <p className="text-white/50 text-sm mb-10 leading-relaxed font-light">
                    Transform your company culture with bespoke meal programs. Elevate wellness, ignite creativity, foster excellence.
                  </p>

                  {/* CTA - Gold themed */}
                  <div className="flex items-center justify-between pt-8 border-t border-amber-400/20">
                    <span className="text-xs uppercase tracking-[0.2em] text-amber-400/80 group-hover:text-amber-300 transition-colors duration-500">For Business</span>
                    <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-amber-500 transition-all duration-500 group-hover:scale-110">
                      <ArrowRight size={18} className="text-amber-400 group-hover:text-black transition-colors duration-500" />
                    </div>
                  </div>
                </div>

                {/* Animated border - Gold */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 w-0 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>

            {/* Service 3 - Event Services */}
            <div
              className="service-card group cursor-pointer relative"
              onClick={() => navigate('/event-application')}
            >
              {/* Card glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>

              {/* Card container */}
              <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-10 h-full transition-all duration-700 group-hover:border-amber-400/30 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
                {/* Number indicator */}
                <div className="absolute -top-5 -left-5 w-14 h-14 bg-gradient-to-br from-white to-gray-200 text-black flex items-center justify-center font-serif text-xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-amber-400/30">
                  03
                </div>

                {/* Image container */}
                <div className="aspect-[4/3] overflow-hidden mb-10 relative border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop"
                    alt="Event Catering"
                    className="object-cover w-full h-full transition-all duration-1000 ease-out group-hover:scale-115 filter saturate-50 group-hover:saturate-100"
                  />
                  {/* Corner accents */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-white/20 z-20"></div>
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-white/20 z-20"></div>
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-px bg-amber-400/60"></div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400/80">Events</span>
                  </div>
                  <h3 className="font-serif text-3xl text-white mb-5 transition-all duration-300 group-hover:text-amber-50">
                    Event Services
                  </h3>
                  <p className="text-white/40 text-sm mb-10 leading-relaxed font-light">
                    Impeccable catering for moments that matter. From intimate soirées to grand corporate galas.
                  </p>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-amber-400 transition-colors duration-500">Inquire Now</span>
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-amber-500 group-hover:border-amber-400 transition-all duration-500 group-hover:scale-110">
                      <ArrowRight size={18} className="text-white/40 group-hover:text-black transition-colors duration-500" />
                    </div>
                  </div>
                </div>

                {/* Animated border line */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 w-0 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>

          </div>

          {/* Bottom decorative element - Enhanced */}
          <div className="flex justify-center mt-24">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
                <div className="w-3 h-3 rotate-45 border border-amber-400/60 bg-amber-400/10"></div>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/20">Quality • Elegance • Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Mood */}
      <section className="testimonial-section py-32 md:py-48 bg-black text-white text-center relative overflow-hidden">
        {/* Texture BG */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>

        <div className="max-w-5xl mx-auto px-6 testimonial-content relative z-10">
          <Star className="mx-auto mb-10 text-white opacity-40" size={32} />
          <p className="font-serif text-3xl md:text-5xl leading-tight italic opacity-90 mb-12">
            "JHL has completely transformed how our agency approaches lunch. It's not just food; it's a daily reset that brings us back to focus."
          </p>
          <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">Sarah Jenkins, CEO of Aura Creative</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="about-image relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1000&fit=crop"
                  alt="Gourmet Food Preparation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-black text-white p-8 hidden md:block">
                <div className="text-4xl font-serif">2018</div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mt-2">Established</div>
              </div>
            </div>
            <div className="about-text">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 block">Our Story</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">Crafting Excellence Since Day One</h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                JHL was born from a simple belief: that exceptional food can transform not just a meal,
                but an entire day. We partner with local artisans, organic farms, and world-class chefs
                to deliver an experience that nourishes body and soul.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our commitment extends beyond the plate. With every subscription, we contribute to
                sustainable farming initiatives and local food banks, ensuring our success lifts the
                entire community.
              </p>
              <div className="flex items-center text-xs uppercase tracking-[0.2em] border-b border-gray-300 hover:border-black w-max pb-2 transition-all cursor-pointer group">
                <span>Learn More</span>
                <ArrowRight size={14} className="ml-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-item">
              <div className="text-4xl md:text-5xl font-serif mb-2">15K+</div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Meals Delivered</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl md:text-5xl font-serif mb-2">200+</div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Corporate Clients</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl md:text-5xl font-serif mb-2">98%</div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Satisfaction Rate</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl md:text-5xl font-serif mb-2">50+</div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Partner Chefs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section py-24 md:py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="contact-content">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 block">Get In Touch</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-8">Let's Start a Conversation</h2>
              <p className="text-gray-600 mb-12 leading-relaxed text-lg">
                Whether you're an individual seeking a better lunch routine, a company looking to elevate
                your team's wellness, or planning a special event – we'd love to hear from you.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Address</div>
                    <div className="font-medium">123 Culinary Lane, New York, NY 10001</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email</div>
                    <div className="font-medium">hello@justhumanlife.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Phone</div>
                    <div className="font-medium">+1 (555) 123-4567</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <div className="bg-white p-8 md:p-12 shadow-lg">
                <h3 className="font-serif text-2xl mb-8">Send a Message</h3>
                <form className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full border-b border-gray-200 py-4 outline-none focus:border-black transition-colors bg-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full border-b border-gray-200 py-4 outline-none focus:border-black transition-colors bg-transparent"
                    />
                  </div>
                  <div>
                    <select className="w-full border-b border-gray-200 py-4 outline-none focus:border-black transition-colors bg-transparent text-gray-500">
                      <option value="">Inquiry Type</option>
                      <option value="individual">Individual Subscription</option>
                      <option value="corporate">Corporate Membership</option>
                      <option value="event">Event Catering</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full border-b border-gray-200 py-4 outline-none focus:border-black transition-colors bg-transparent resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-5 text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Modal */}
      {isPlansOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setIsPlansOpen(false)}>
          <div
            className="bg-white w-full max-w-5xl overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-500"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '90vh' }}
          >
            <button
              onClick={() => setIsPlansOpen(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-all z-10"
            >
              <X size={24} />
            </button>

            <div className="p-8 md:p-16">
              <div className="text-center mb-12">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 block">Subscription Services</span>
                <h2 className="font-serif text-3xl md:text-5xl mb-6">Choose Your Ritual</h2>
                <p className="text-gray-500 max-w-2xl mx-auto mb-10 font-light">
                  Designed for professionals and businesses. Select the tier that aligns with your lifestyle requirements.
                </p>

                {/* Billing Cycle Toggle */}
                <div className="flex justify-center">
                  <div className="inline-flex bg-gray-100 p-1.5 rounded-full">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'
                        }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('annual')}
                      className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${billingCycle === 'annual' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'
                        }`}
                    >
                      Annual <span className={`ml-1 text-[10px] normal-case tracking-normal ${billingCycle === 'annual' ? 'text-gray-300' : 'text-green-600'}`}>-10%</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`border p-8 flex flex-col transition-all duration-300 relative ${plan.highlight ? 'border-black bg-black text-white shadow-2xl scale-105 md:-mt-6 md:mb-6' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                  >
                    {plan.savings && (
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded text-[10px] uppercase tracking-wider text-white">
                        {plan.savings}
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className={`font-serif text-3xl mb-2 ${plan.highlight ? 'text-white' : 'text-black'}`}>{plan.name}</h3>
                      <p className={`text-sm ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                    </div>
                    <div className="mb-10">
                      <div className="flex items-baseline">
                        <span className="text-4xl md:text-5xl font-serif">{plan.price}</span>
                        <span className={`ml-2 text-xs uppercase tracking-wider ${plan.highlight ? 'text-gray-500' : 'text-gray-400'}`}>{plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-5 mb-10 flex-grow">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Check size={16} className={`mr-3 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-black'}`} />
                          <span className={plan.highlight ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => navigate('/auth')}
                      className={`w-full py-5 text-xs uppercase tracking-[0.2em] transition-colors ${plan.highlight ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                    >
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};