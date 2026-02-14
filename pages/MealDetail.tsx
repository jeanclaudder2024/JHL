import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Drumstick, Wheat, Droplet, Clock, Leaf, Utensils } from 'lucide-react';
import { mealsApi } from '../services/api';

interface MealData {
    id: string;
    name: string;
    description: string;
    calories: number;
    type: string;
    image: string;
    ingredients?: string;
    protein?: number;
    carbs?: number;
    fats?: number;
    date?: string;
}

export const MealDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [meal, setMeal] = useState<MealData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeal = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await mealsApi.getById(id);
                setMeal(data);
            } catch (err) {
                console.error('Error fetching meal:', err);
                setError('Meal not found or unavailable');
            } finally {
                setLoading(false);
            }
        };

        fetchMeal();
    }, [id]);

    const getMealTypeIcon = (type: string) => {
        switch (type) {
            case 'Vegetarian':
            case 'Vegan':
                return <Leaf className="text-green-500" size={20} />;
            default:
                return <Utensils className="text-amber-500" size={20} />;
        }
    };

    const getMealTypeColor = (type: string) => {
        switch (type) {
            case 'Vegetarian':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Vegan':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Keto':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Gluten-Free':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60 text-sm uppercase tracking-widest">Loading meal details...</p>
                </div>
            </div>
        );
    }

    if (error || !meal) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <Utensils className="text-red-400" size={32} />
                    </div>
                    <h1 className="font-serif text-3xl text-white mb-4">Meal Not Found</h1>
                    <p className="text-white/40 mb-8">{error || 'The requested meal could not be found.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
            {/* Hero Image Section */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black z-10"></div>
                <img
                    src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=800&fit=crop'}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                />

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-black/70 transition-colors border border-white/10"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                {/* Meal Type Badge */}
                <div className="absolute bottom-6 left-6 z-20">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border ${getMealTypeColor(meal.type)}`}>
                        {getMealTypeIcon(meal.type)}
                        {meal.type}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-12 -mt-20 relative z-20">
                <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-900/70 backdrop-blur-xl border border-white/10 p-8 md:p-12">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-400/60"></div>
                            <span className="text-xs uppercase tracking-[0.5em] text-amber-400/80">Today's Selection</span>
                            <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-400/60"></div>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">{meal.name}</h1>
                        {meal.date && (
                            <div className="flex items-center gap-2 text-white/40 text-sm">
                                <Clock size={14} />
                                <span>Served on {new Date(meal.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        )}
                    </div>

                    {/* Nutrition Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-400/20 p-6 text-center">
                            <Flame className="text-amber-400 mx-auto mb-3" size={28} />
                            <div className="text-3xl font-light text-white mb-1">{meal.calories}</div>
                            <div className="text-xs uppercase tracking-widest text-white/40">Calories</div>
                        </div>
                        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 border border-red-400/20 p-6 text-center">
                            <Drumstick className="text-red-400 mx-auto mb-3" size={28} />
                            <div className="text-3xl font-light text-white mb-1">{meal.protein || 0}g</div>
                            <div className="text-xs uppercase tracking-widest text-white/40">Protein</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-400/20 p-6 text-center">
                            <Wheat className="text-yellow-400 mx-auto mb-3" size={28} />
                            <div className="text-3xl font-light text-white mb-1">{meal.carbs || 0}g</div>
                            <div className="text-xs uppercase tracking-widest text-white/40">Carbs</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-400/20 p-6 text-center">
                            <Droplet className="text-blue-400 mx-auto mb-3" size={28} />
                            <div className="text-3xl font-light text-white mb-1">{meal.fats || 0}g</div>
                            <div className="text-xs uppercase tracking-widest text-white/40">Fats</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-10">
                        <h2 className="text-xs uppercase tracking-widest text-amber-400/80 mb-4">Description</h2>
                        <p className="text-white/60 leading-relaxed text-lg">{meal.description}</p>
                    </div>

                    {/* Ingredients */}
                    {meal.ingredients && (
                        <div className="mb-10">
                            <h2 className="text-xs uppercase tracking-widest text-amber-400/80 mb-4">Ingredients</h2>
                            <div className="bg-white/5 border border-white/10 p-6">
                                <p className="text-white/60 leading-relaxed">{meal.ingredients}</p>
                            </div>
                        </div>
                    )}

                    {/* JHL Branding */}
                    <div className="text-center pt-8 border-t border-white/10">
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
                            <div className="w-3 h-3 rotate-45 border border-amber-400/60 bg-amber-400/10"></div>
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
                        </div>
                        <p className="text-white/20 text-xs uppercase tracking-[0.3em]">Just Human Life • Premium Culinary Experience</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
