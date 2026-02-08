import React, { useState, useRef, useLayoutEffect } from 'react';
import { ArrowRight, Star, X, Check } from 'lucide-react';
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

  // Animation Setup
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Hero Animation sequence
      const tl = gsap.timeline();
      
      // Hero Background Parallax
      gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Hero Content Reveal
      tl.from(".hero-title-line", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
      })
      .from(".hero-sub", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .from(".hero-btn", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.6");

      // 2. Philosophy Section Reveal
      gsap.from(".philosophy-content", {
        scrollTrigger: {
          trigger: ".philosophy-section",
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(".philosophy-line", {
        scrollTrigger: {
          trigger: ".philosophy-section",
          start: "top 75%",
        },
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "expo.out",
        delay: 0.2
      });

      // 3. Services Stagger
      gsap.from(".service-card", {
        scrollTrigger: {
          trigger: ".services-section",
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });
      
      // 4. Testimonial Parallax
      gsap.from(".testimonial-content", {
        scrollTrigger: {
          trigger: ".testimonial-section",
          start: "top 80%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      });

    }, mainRef);

    return () => ctx.revert(); // Cleanup
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
          style={{ backgroundImage: 'url("https://picsum.photos/id/431/1920/1080")' }} 
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

      {/* Services Grid */}
      <section className="services-section bg-zinc-50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Service 1 */}
            <div className="service-card group cursor-pointer" onClick={() => setIsPlansOpen(true)}>
              <div className="aspect-[3/4] overflow-hidden mb-8 relative">
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                 <img 
                  src="https://picsum.photos/id/225/800/1000" 
                  alt="Subscription" 
                  className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
              </div>
              <h3 className="font-serif text-3xl mb-4 group-hover:translate-x-2 transition-transform duration-300">The Daily Ritual</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-xs">
                The essential subscription for the driven professional. Seamless, high-performance nutrition delivered to your office or home.
              </p>
              <div className="flex items-center text-xs uppercase tracking-[0.2em] border-b border-gray-300 group-hover:border-black w-max pb-2 transition-all">
                <span>View Plans</span>
                <ArrowRight size={14} className="ml-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Service 2 */}
            <div className="service-card group cursor-pointer" onClick={() => navigate('/corporate-application')}>
               <div className="aspect-[3/4] overflow-hidden mb-8 relative">
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                 <img 
                  src="https://picsum.photos/id/319/800/1000" 
                  alt="Company" 
                  className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
              </div>
              <h3 className="font-serif text-3xl mb-4 group-hover:translate-x-2 transition-transform duration-300">Corporate Membership</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-xs">
                Elevate your company culture with subsidized meal programs. Fuel your team's creativity and health.
              </p>
               <div className="flex items-center text-xs uppercase tracking-[0.2em] border-b border-gray-300 group-hover:border-black w-max pb-2 transition-all">
                <span>For Business</span>
                <ArrowRight size={14} className="ml-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Service 3 */}
            <div className="service-card group cursor-pointer" onClick={() => navigate('/event-application')}>
               <div className="aspect-[3/4] overflow-hidden mb-8 relative">
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                 <img 
                  src="https://picsum.photos/id/251/800/1000" 
                  alt="Events" 
                  className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
              </div>
              <h3 className="font-serif text-3xl mb-4 group-hover:translate-x-2 transition-transform duration-300">Event Services</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-xs">
                Impeccable catering for moments that matter. From intimate gatherings to grand corporate functions.
              </p>
               <div className="flex items-center text-xs uppercase tracking-[0.2em] border-b border-gray-300 group-hover:border-black w-max pb-2 transition-all">
                <span>Inquire Now</span>
                <ArrowRight size={14} className="ml-3 transition-transform group-hover:translate-x-1" />
              </div>
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
                       className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${
                         billingCycle === 'monthly' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'
                       }`}
                     >
                       Monthly
                     </button>
                     <button
                       onClick={() => setBillingCycle('annual')}
                       className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${
                         billingCycle === 'annual' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'
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