import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Utensils, Check } from 'lucide-react';

interface WelcomePageProps {
    userName?: string;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ userName = 'there' }) => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const services = [
        {
            id: 'individual',
            number: '01',
            title: 'The Daily Ritual',
            subtitle: 'Individual',
            description: 'The essential subscription for the discerning professional. Seamless, high-performance nutrition delivered with precision.',
            icon: Utensils,
            features: [
                'Chef-crafted meals daily',
                'Flexible delivery schedules',
                'Dietary customization',
                'Nutritional tracking'
            ],
            cta: 'View Plans',
            action: () => navigate('/#services'),
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'
        },
        {
            id: 'corporate',
            number: '02',
            title: 'Corporate Membership',
            subtitle: 'Business',
            description: 'Transform your company culture with bespoke meal programs. Elevate wellness, ignite creativity, foster excellence.',
            icon: Users,
            features: [
                'Bulk team ordering',
                'Admin dashboard access',
                'Custom billing cycles',
                'Dedicated account manager'
            ],
            cta: 'For Business',
            action: () => navigate('/corporate-application'),
            image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
            popular: true
        },
        {
            id: 'events',
            number: '03',
            title: 'Event Services',
            subtitle: 'Events',
            description: 'Impeccable catering for moments that matter. From intimate soirées to grand corporate galas.',
            icon: Calendar,
            features: [
                'Custom menu creation',
                'Professional service staff',
                'Setup & breakdown',
                'Dietary accommodations'
            ],
            cta: 'Inquire Now',
            action: () => navigate('/event-application'),
            image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop'
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section - Matching Home page style */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950"></div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-amber-400/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
                </div>

                {/* Decorative lines */}
                <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-transparent via-amber-400/30 to-transparent"></div>

                <div className="relative z-10 max-w-5xl mx-auto text-center px-4 py-20">
                    <div className="inline-flex items-center gap-3 mb-8">
                        <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-400/60"></div>
                        <span className="text-xs uppercase tracking-[0.5em] text-amber-400/80">Welcome to JHL</span>
                        <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-400/60"></div>
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl text-white mb-8 leading-tight">
                        Hello, <span className="italic font-light bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">{userName}</span>
                    </h1>

                    <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-light mb-8">
                        Thank you for joining Just Human Life. Choose how you'd like to experience our premium culinary services.
                    </p>

                    <div className="flex items-center justify-center gap-2">
                        <div className="w-1 h-1 bg-amber-400/60 rounded-full"></div>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        <div className="w-2 h-2 rotate-45 border border-amber-400/40"></div>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        <div className="w-1 h-1 bg-amber-400/60 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Services Selection - Same style as Home Services section */}
            <section className="py-20 md:py-32 relative overflow-hidden">
                {/* Section Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-400/60"></div>
                            <span className="text-xs uppercase tracking-[0.5em] text-amber-400/80">Choose Your Path</span>
                            <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-400/60"></div>
                        </div>
                        <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">
                            How Would You Like to <span className="italic font-light bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">Begin?</span>
                        </h2>
                        <p className="text-white/40 text-lg max-w-xl mx-auto font-light">
                            Select the service that best fits your needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`service-card group cursor-pointer relative ${service.popular ? 'lg:-mt-10 lg:mb-10' : ''}`}
                                onMouseEnter={() => setHoveredCard(service.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={service.action}
                            >
                                {/* Card glow effect */}
                                <div className={`absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl ${service.popular ? 'opacity-50' : ''}`}></div>

                                {/* Popular badge */}
                                {service.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                        <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] uppercase tracking-[0.2em] px-6 py-2 shadow-lg shadow-amber-500/30 font-medium">✦ Most Popular ✦</span>
                                    </div>
                                )}

                                {/* Card container */}
                                <div className={`relative bg-gradient-to-b ${service.popular ? 'from-white/15 to-white/5 border-amber-400/20' : 'from-white/10 to-white/5 border-white/10'} backdrop-blur-md border p-10 h-full transition-all duration-700 group-hover:border-amber-400/30 group-hover:shadow-2xl group-hover:shadow-amber-500/10`}>
                                    {/* Number indicator */}
                                    <div className={`absolute -top-5 -left-5 w-14 h-14 ${service.popular ? 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-500/30' : 'bg-gradient-to-br from-white to-gray-200'} text-black flex items-center justify-center font-serif text-xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                        {service.number}
                                    </div>

                                    {/* Image container */}
                                    <div className={`aspect-[4/3] overflow-hidden mb-10 relative border ${service.popular ? 'border-amber-400/10' : 'border-white/5'}`}>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="object-cover w-full h-full transition-all duration-1000 ease-out group-hover:scale-115 filter saturate-50 group-hover:saturate-100"
                                        />
                                        {/* Corner accents */}
                                        <div className={`absolute top-3 left-3 w-6 h-6 border-l border-t ${service.popular ? 'border-amber-400/40' : 'border-white/20'} z-20`}></div>
                                        <div className={`absolute bottom-3 right-3 w-6 h-6 border-r border-b ${service.popular ? 'border-amber-400/40' : 'border-white/20'} z-20`}></div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className={`w-4 h-px ${service.popular ? 'bg-amber-400' : 'bg-amber-400/60'}`}></div>
                                            <span className={`text-[10px] uppercase tracking-[0.4em] ${service.popular ? 'text-amber-400' : 'text-amber-400/80'}`}>{service.subtitle}</span>
                                        </div>
                                        <h3 className="font-serif text-3xl text-white mb-5 transition-all duration-300 group-hover:text-amber-50">
                                            {service.title}
                                        </h3>
                                        <p className="text-white/40 text-sm mb-6 leading-relaxed font-light">
                                            {service.description}
                                        </p>

                                        {/* Features */}
                                        <ul className="space-y-2 mb-10">
                                            {service.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-3 text-xs text-white/50">
                                                    <div className={`w-4 h-4 rounded-full ${service.popular ? 'bg-amber-400/20 border-amber-400/40' : 'bg-white/10 border-white/20'} border flex items-center justify-center flex-shrink-0`}>
                                                        <Check size={10} className={service.popular ? 'text-amber-400' : 'text-white/60'} />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <div className={`flex items-center justify-between pt-8 border-t ${service.popular ? 'border-amber-400/20' : 'border-white/5'}`}>
                                            <span className={`text-xs uppercase tracking-[0.2em] ${service.popular ? 'text-amber-400/80 group-hover:text-amber-300' : 'text-white/40 group-hover:text-amber-400'} transition-colors duration-500`}>{service.cta}</span>
                                            <div className={`w-12 h-12 rounded-full ${service.popular ? 'bg-amber-400/10 border-amber-400/30' : 'bg-white/5 border-white/10'} border flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-amber-500 group-hover:border-amber-400 transition-all duration-500 group-hover:scale-110`}>
                                                <ArrowRight size={18} className={`${service.popular ? 'text-amber-400' : 'text-white/40'} group-hover:text-black transition-colors duration-500`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Animated border line */}
                                    <div className={`absolute bottom-0 left-0 ${service.popular ? 'h-1' : 'h-0.5'} bg-gradient-to-r from-amber-400 ${service.popular ? 'via-amber-300' : ''} to-amber-600 w-0 group-hover:w-full transition-all duration-1000`}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom note */}
                    <div className="text-center mt-16">
                        <p className="text-white/30 text-sm">
                            Need help deciding? <button className="text-amber-400/80 underline underline-offset-4 hover:text-amber-300 transition-colors">Contact our team</button>
                        </p>
                    </div>

                    {/* Bottom decorative element */}
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
        </div>
    );
};
