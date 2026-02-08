import React, { useState } from 'react';
import { Calendar as CalendarIcon, Package, Settings, CreditCard, X, Info, Utensils, Clock, MessageSquare, CheckCircle, ZoomIn, Star } from 'lucide-react';
import { User, Meal } from '../types';

interface IndividualDashboardProps {
  user: User;
}

// Extends Meal to include user feedback for local state
interface RatedMeal extends Meal {
    rating?: number;
    feedback?: string;
}

export const IndividualDashboard: React.FC<IndividualDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'history' | 'subscription' | 'support'>('subscription');
  const [selectedMeal, setSelectedMeal] = useState<RatedMeal | null>(null);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Feedback State
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [mealToRate, setMealToRate] = useState<RatedMeal | null>(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState("");

  // -- SUBSCRIPTION STATE --
  const [subscription, setSubscription] = useState({
    name: 'The Executive Daily',
    price: '$750',
    period: 'per month',
    description: 'Consistent nourishment for peak performance. Includes daily lunch delivery and priority service.',
    features: ['5 Meals/Week', 'Monthly'],
    nextBilling: 'June 20, 2024',
    cycle: 'Monthly'
  });

  const availablePlans = [
    { 
      name: 'Plat du Jour', 
      price: '$35', 
      period: 'per day', 
      desc: 'Flexibility for the dynamic schedule.',
      features: ['Single Meal', 'Daily'],
      fullDesc: 'Flexibility for the dynamic schedule. Order when you need it.',
      cycle: 'Daily'
    },
    { 
      name: 'The Executive Daily', 
      price: '$750', 
      period: 'per month', 
      desc: 'Consistent nourishment for peak performance.',
      features: ['5 Meals/Week', 'Monthly'],
      fullDesc: 'Consistent nourishment for peak performance. Includes daily lunch delivery and priority service.',
      cycle: 'Monthly'
    },
    { 
      name: 'The Visionary', 
      price: '$1,200', 
      period: 'per month', 
      desc: 'A long-term investment in your well-being.',
      features: ['Daily Lunch & Snack', 'Monthly'],
      fullDesc: 'A long-term investment in your well-being. Full nutritional coverage.',
      cycle: 'Monthly'
    },
  ];

  const [selectedPlanInModal, setSelectedPlanInModal] = useState<string>(subscription.name);

  const handleUpdatePlan = () => {
    const newPlan = availablePlans.find(p => p.name === selectedPlanInModal);
    if (newPlan) {
      setSubscription({
        ...subscription,
        name: newPlan.name,
        price: newPlan.price,
        period: newPlan.period,
        description: newPlan.fullDesc,
        features: newPlan.features,
        cycle: newPlan.cycle
      });
    }
    setIsChangePlanModalOpen(false);
  };

  const mockMeals: RatedMeal[] = [
    { 
      id: '1', 
      name: 'Miso Glazed Salmon', 
      description: 'Wild caught salmon with organic brown rice and steamed bok choy.', 
      calories: 650, 
      date: '2024-05-20', 
      type: 'Standard', 
      image: 'https://picsum.photos/id/1080/800/600',
      ingredients: ['Wild Salmon', 'Brown Rice', 'Bok Choy', 'Miso Paste', 'Mirin', 'Sesame Seeds', 'Green Onion'],
      nutrition: { protein: 45, carbs: 48, fats: 22 }
    },
    { 
      id: '2', 
      name: 'Truffle Mushroom Risotto', 
      description: 'Creamy arborio rice with black truffle oil, aged parmesan, and wild mushrooms.', 
      calories: 580, 
      date: '2024-05-21', 
      type: 'Vegetarian', 
      image: 'https://picsum.photos/id/292/800/600',
      ingredients: ['Arborio Rice', 'Portobello Mushrooms', 'Vegetable Broth', 'Parmesan Cheese', 'Truffle Oil', 'White Wine', 'Thyme'],
      nutrition: { protein: 18, carbs: 75, fats: 20 }
    },
    { 
      id: '3', 
      name: 'Quinoa Power Bowl', 
      description: 'Nutrient-packed bowl with avocado, chickpeas, kale, and lemon tahini dressing.', 
      calories: 450, 
      date: '2024-05-22', 
      type: 'Vegan', 
      image: 'https://picsum.photos/id/493/800/600',
      ingredients: ['Quinoa', 'Chickpeas', 'Curly Kale', 'Avocado', 'Lemon Juice', 'Tahini', 'Cherry Tomatoes', 'Cucumber'],
      nutrition: { protein: 20, carbs: 55, fats: 18 }
    },
  ];

  const [historyMeals, setHistoryMeals] = useState<RatedMeal[]>([
    {
      id: 'h1',
      name: 'Teriyaki Chicken Bowl',
      description: 'Grilled chicken with homemade teriyaki sauce, jasmine rice, and steamed broccoli.',
      calories: 520, 
      date: '2024-05-18',
      type: 'Standard',
      image: 'https://picsum.photos/id/40/800/600',
      ingredients: ['Chicken Thigh', 'Soy Sauce', 'Ginger', 'Jasmine Rice', 'Broccoli'],
      nutrition: { protein: 35, carbs: 60, fats: 12 },
      rating: 5,
      feedback: "Absolutely delicious! The sauce was perfect."
    },
    {
      id: 'h2',
      name: 'Eggplant Parmesan',
      description: 'Breaded eggplant slices layered with marinara sauce and mozzarella.',
      calories: 610,
      date: '2024-05-17',
      type: 'Vegetarian',
      image: 'https://picsum.photos/id/60/800/600',
      ingredients: ['Eggplant', 'Marinara Sauce', 'Mozzarella', 'Breadcrumbs', 'Basil'],
      nutrition: { protein: 22, carbs: 55, fats: 28 }
    },
  ]);

  const openRatingModal = (meal: RatedMeal, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setMealToRate(meal);
      setCurrentRating(meal.rating || 0);
      setCurrentFeedback(meal.feedback || "");
      setRatingModalOpen(true);
  };

  const submitRating = () => {
      if(mealToRate) {
          const updatedHistory = historyMeals.map(m => 
            m.id === mealToRate.id 
            ? { ...m, rating: currentRating, feedback: currentFeedback } 
            : m
          );
          setHistoryMeals(updatedHistory);
          
          // Also update selectedMeal if it's the one being rated
          if (selectedMeal && selectedMeal.id === mealToRate.id) {
              setSelectedMeal({ ...selectedMeal, rating: currentRating, feedback: currentFeedback });
          }

          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
      }
      setRatingModalOpen(false);
      setMealToRate(null);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'calendar':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-serif text-2xl md:text-3xl">Upcoming Meals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMeals.map(meal => (
                <div 
                  key={meal.id} 
                  onClick={() => setSelectedMeal(meal)}
                  className="bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={meal.image} 
                      alt={meal.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white/90 backdrop-blur px-4 py-2 text-xs uppercase tracking-widest font-medium flex items-center gap-2">
                           <Info size={14} /> View Details
                        </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{meal.date}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1">{meal.type}</span>
                    </div>
                    <h3 className="font-serif text-xl mb-2 group-hover:text-gray-600 transition-colors">{meal.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{meal.description}</p>
                    <div className="text-xs text-gray-400">{meal.calories} kcal</div>
                  </div>
                </div>
              ))}
              <div className="border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 min-h-[300px] text-gray-400 hover:border-black hover:text-black transition-colors cursor-pointer group">
                <CalendarIcon size={32} className="mb-4 opacity-50 group-hover:opacity-100" />
                <span className="uppercase text-xs tracking-widest">Schedule Meal</span>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-serif text-2xl md:text-3xl mb-6">Meal History</h2>
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
               <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-500 font-medium">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-5">Meal</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-3 text-right">Feedback</div>
               </div>
               <div className="divide-y divide-gray-100">
                 {historyMeals.map((meal) => (
                   <div 
                      key={meal.id} 
                      onClick={() => setSelectedMeal(meal)}
                      className="group grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors cursor-pointer"
                   >
                      <div className="col-span-12 md:col-span-2 text-sm text-gray-500 font-medium flex justify-between md:block">
                        <span className="md:hidden text-xs uppercase tracking-widest">Date</span>
                        {meal.date}
                      </div>
                      <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                         <img src={meal.image} alt={meal.name} className="w-12 h-12 object-cover rounded hidden sm:block" />
                         <div className="flex-grow">
                           <h3 className="font-serif text-lg group-hover:text-black transition-colors">{meal.name}</h3>
                           <p className="text-xs text-gray-400 line-clamp-1">{meal.description}</p>
                           {meal.feedback && (
                             <div className="flex items-center gap-1 mt-1 text-gray-500">
                               <MessageSquare size={10} />
                               <span className="text-[10px] italic truncate max-w-[200px]">"{meal.feedback}"</span>
                             </div>
                           )}
                         </div>
                      </div>
                      <div className="col-span-6 md:col-span-2 mt-2 md:mt-0">
                         <span className="px-2 py-1 bg-zinc-100 text-xs rounded-full">{meal.type}</span>
                      </div>
                      <div className="col-span-6 md:col-span-3 text-right mt-2 md:mt-0 flex justify-end">
                        {meal.rating ? (
                             <div className="flex flex-col items-end" onClick={(e) => openRatingModal(meal, e)}>
                                 <div className="flex text-yellow-500 gap-0.5">
                                     {[...Array(meal.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                 </div>
                                 <span className="text-[10px] text-gray-400 uppercase tracking-wide hover:underline">Edit Review</span>
                             </div>
                        ) : (
                            <button 
                                onClick={(e) => openRatingModal(meal, e)}
                                className="text-xs border border-gray-200 px-3 py-1.5 uppercase tracking-wider text-gray-500 hover:border-black hover:text-black transition-colors"
                            >
                                Rate Meal
                            </button>
                        )}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        );
      case 'subscription':
        return (
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="font-serif text-2xl md:text-3xl mb-8">Subscription Details</h2>
             
             {/* Main Plan Card */}
             <div className="bg-black text-white p-8 mb-6 relative overflow-hidden shadow-xl">
               <div className="relative z-10 grid md:grid-cols-2 gap-8">
                 <div>
                   <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Current Plan</div>
                   <div className="font-serif text-3xl mb-4">{subscription.name}</div>
                   <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                     {subscription.description}
                   </p>
                   <div className="flex items-center gap-3 text-sm">
                     {subscription.features.map((f, i) => (
                         <span key={i} className="bg-white/20 px-3 py-1 rounded text-xs uppercase tracking-wider">{f}</span>
                     ))}
                   </div>
                 </div>
                 <div className="flex flex-col justify-between items-start md:items-end">
                   <div className="text-left md:text-right mb-6 md:mb-0">
                     <div className="font-serif text-4xl">{subscription.price}</div>
                     <div className="text-xs text-gray-400 uppercase tracking-wider">{subscription.period}</div>
                   </div>
                   <button 
                     onClick={() => {
                         setSelectedPlanInModal(subscription.name);
                         setIsChangePlanModalOpen(true);
                     }}
                     className="bg-white text-black px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors w-full md:w-auto"
                   >
                     Change Plan
                   </button>
                 </div>
               </div>
               
               {/* BG Decoration */}
               <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12 pointer-events-none">
                 <Package size={300} />
               </div>
             </div>

             {/* Details Grid */}
             <div className="bg-white border border-gray-200 shadow-sm">
               <div className="p-6 border-b border-gray-100">
                 <h3 className="font-serif text-lg">Billing & Renewal</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                 <div className="p-6 space-y-6">
                   <div>
                     <div className="flex items-center gap-2 text-gray-500 mb-1">
                       <Clock size={16} />
                       <span className="text-xs uppercase tracking-wider">Next Billing Date</span>
                     </div>
                     <div className="font-medium text-lg">{subscription.nextBilling}</div>
                     <div className="text-xs text-gray-400 mt-1">Auto-renews automatically</div>
                   </div>
                   <div>
                     <div className="flex items-center gap-2 text-gray-500 mb-1">
                       <Package size={16} />
                       <span className="text-xs uppercase tracking-wider">Billing Cycle</span>
                     </div>
                     <div className="font-medium text-lg">{subscription.cycle}</div>
                   </div>
                 </div>
                 <div className="p-6 space-y-6">
                   <div>
                     <div className="flex items-center gap-2 text-gray-500 mb-1">
                       <CreditCard size={16} />
                       <span className="text-xs uppercase tracking-wider">Payment Method</span>
                     </div>
                     <div className="font-medium text-lg flex items-center gap-2">
                       Visa ending in 4242
                     </div>
                     <button className="text-xs underline text-gray-500 hover:text-black mt-1">Update Method</button>
                   </div>
                   <div>
                     <div className="flex items-center gap-2 text-gray-500 mb-1">
                       <Settings size={16} />
                       <span className="text-xs uppercase tracking-wider">Plan Status</span>
                     </div>
                     <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div> Active
                     </span>
                   </div>
                 </div>
               </div>
               <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                 <button className="text-xs text-red-600 hover:text-red-800 uppercase tracking-widest">Cancel Subscription</button>
               </div>
             </div>
          </div>
        );
      case 'support':
        return (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-serif text-2xl md:text-3xl mb-8">Member Support</h2>
            <div className="bg-white border border-gray-100 p-8">
              <p className="text-gray-500 mb-6 text-sm">Need assistance with your plan or delivery? Send us a message.</p>
              <form className="space-y-4">
                <div>
                   <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Subject</label>
                   <select className="w-full border-b border-gray-300 py-2 focus:border-black outline-none bg-transparent">
                     <option>Delivery Issue</option>
                     <option>Dietary Preference Change</option>
                     <option>Billing Question</option>
                     <option>Other</option>
                   </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Message</label>
                  <textarea className="w-full border border-gray-200 p-4 h-32 focus:border-black outline-none resize-none" placeholder="How can we help?"></textarea>
                </div>
                <button className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 flex-shrink-0 z-10">
        <div className="bg-white shadow-sm border border-gray-100 p-2">
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 no-scrollbar pb-1 md:pb-0">
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'calendar' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CalendarIcon size={18} />
              <span>Meal Calendar</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'history' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Clock size={18} />
              <span>Meal History</span>
            </button>
            <button 
              onClick={() => setActiveTab('subscription')}
              className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'subscription' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CreditCard size={18} />
              <span>Subscription</span>
            </button>
            <button 
              onClick={() => setActiveTab('support')}
              className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'support' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <MessageSquare size={18} />
              <span>Support</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow pt-4 md:pt-0">
        {renderContent()}
      </div>

      {/* Toast Notification */}
      {showToast && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-[60] animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-xs uppercase tracking-widest">Feedback Submitted Successfully</span>
          </div>
      )}

      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMeal(null)}>
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedMeal(null)} className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md hover:bg-white text-black rounded-full transition-all z-10"><X size={24} /></button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div 
                className="h-64 md:h-full min-h-[300px] relative group cursor-zoom-in overflow-hidden"
                onClick={() => setIsImageZoomed(true)}
              >
                 <img src={selectedMeal.image} alt={selectedMeal.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-widest text-black">{selectedMeal.type}</span></div>
                 
                 {/* Zoom Hint */}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-black/50 text-white px-3 py-2 rounded-full backdrop-blur-sm flex items-center gap-2 text-xs uppercase tracking-widest pointer-events-none">
                        <ZoomIn size={14} /> Zoom
                    </span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col h-full">
                <div className="mb-6">
                  <span className="text-gray-400 text-xs uppercase tracking-widest mb-2 block">{selectedMeal.date}</span>
                  <h2 className="font-serif text-3xl mb-4 leading-tight">{selectedMeal.name}</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">{selectedMeal.description}</p>
                </div>
                {selectedMeal.nutrition && (
                  <div className="mb-8 p-4 bg-zinc-50 border border-zinc-100">
                    <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-200 pb-2">Nutritional Facts</h3>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div><div className="font-serif text-xl">{selectedMeal.calories}</div><div className="text-[10px] uppercase text-gray-400">Calories</div></div>
                      <div><div className="font-serif text-xl">{selectedMeal.nutrition.protein}g</div><div className="text-[10px] uppercase text-gray-400">Protein</div></div>
                      <div><div className="font-serif text-xl">{selectedMeal.nutrition.carbs}g</div><div className="text-[10px] uppercase text-gray-400">Carbs</div></div>
                      <div><div className="font-serif text-xl">{selectedMeal.nutrition.fats}g</div><div className="text-[10px] uppercase text-gray-400">Fats</div></div>
                    </div>
                  </div>
                )}
                
                {/* Ingredients Section */}
                {selectedMeal.ingredients && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                       <Utensils size={14} className="text-gray-400"/>
                       <h3 className="text-xs uppercase tracking-widest text-gray-500">Ingredients Composition</h3>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedMeal.ingredients.map((ing, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2 group/item">
                              <CheckCircle size={14} className="text-gray-300 mt-1 flex-shrink-0 group-hover/item:text-black transition-colors" />
                              <span className="leading-snug group-hover/item:text-black transition-colors">{ing}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Review Section in Details */}
                {selectedMeal.rating && (
                   <div className="mb-6 bg-yellow-50 p-4 border border-yellow-100 rounded">
                      <div className="flex justify-between items-center mb-2">
                         <h3 className="text-xs uppercase tracking-widest text-yellow-800">Your Review</h3>
                         <div className="flex text-yellow-500 gap-0.5">
                             {[...Array(selectedMeal.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                         </div>
                      </div>
                      {selectedMeal.feedback && <p className="text-sm text-yellow-900 italic">"{selectedMeal.feedback}"</p>}
                      <button onClick={() => { setSelectedMeal(null); openRatingModal(selectedMeal); }} className="text-[10px] uppercase tracking-wide text-yellow-700 underline mt-2">Edit Review</button>
                   </div>
                )}

                {/* Modal footer action */}
                <div className="mt-auto pt-6 border-t border-gray-100 flex justify-end">
                    <button onClick={() => setSelectedMeal(null)} className="text-xs uppercase tracking-widest text-gray-500 hover:text-black">Close Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Overlay */}
      {isImageZoomed && selectedMeal && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200" onClick={() => setIsImageZoomed(false)}>
            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                 <img 
                    src={selectedMeal.image} 
                    alt={selectedMeal.name} 
                    className="max-w-full max-h-full object-contain shadow-2xl" 
                    onClick={() => setIsImageZoomed(false)}
                 />
                 <button onClick={() => setIsImageZoomed(false)} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/20 p-2 rounded-full">
                    <X size={32} />
                 </button>
            </div>
        </div>
      )}

      {/* Change Plan Modal */}
      {isChangePlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsChangePlanModalOpen(false)}>
            <div className="bg-white w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-serif text-2xl">Upgrade or Change Plan</h2>
                    <button onClick={() => setIsChangePlanModalOpen(false)} className="text-gray-400 hover:text-black"><X size={20} /></button>
                </div>
                <div className="p-8 bg-zinc-50 space-y-4">
                    {availablePlans.map((plan, i) => {
                        const isSelected = selectedPlanInModal === plan.name;
                        return (
                          <div 
                            key={i} 
                            onClick={() => setSelectedPlanInModal(plan.name)}
                            className={`p-6 border flex justify-between items-center transition-all cursor-pointer ${isSelected ? 'border-black bg-white ring-1 ring-black shadow-lg' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                          >
                              <div>
                                  <div className="flex items-center gap-3 mb-1">
                                      <h3 className="font-serif text-lg">{plan.name}</h3>
                                      {isSelected && <CheckCircle size={16} className="text-black fill-white" />}
                                  </div>
                                  <p className="text-xs text-gray-500">{plan.desc}</p>
                              </div>
                              <div className="text-right">
                                  <div className="font-serif text-xl">{plan.price}</div>
                                  <div className="text-[10px] uppercase text-gray-400">{plan.period}</div>
                              </div>
                          </div>
                        );
                    })}
                </div>
                <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={() => setIsChangePlanModalOpen(false)} className="px-6 py-3 text-xs uppercase tracking-widest text-gray-500 hover:text-black">Cancel</button>
                    <button onClick={handleUpdatePlan} className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800">Update Subscription</button>
                </div>
            </div>
        </div>
      )}

      {/* Rate Meal Modal */}
      {ratingModalOpen && mealToRate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setRatingModalOpen(false)}>
              <div className="bg-white w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                   <button onClick={() => setRatingModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
                   <div className="p-8 text-center">
                       <span className="text-xs uppercase tracking-widest text-gray-400 block mb-2">{mealToRate.date}</span>
                       <h2 className="font-serif text-2xl mb-2">{mealToRate.name}</h2>
                       <p className="text-gray-500 text-sm mb-8">How was your culinary experience?</p>
                       
                       <div className="flex justify-center gap-2 mb-8">
                           {[1, 2, 3, 4, 5].map((star) => (
                               <button 
                                key={star}
                                onClick={() => setCurrentRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                               >
                                   <Star 
                                    size={32} 
                                    className={`${star <= currentRating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
                                    strokeWidth={1}
                                   />
                               </button>
                           ))}
                       </div>

                       <div className="relative mb-8">
                           <textarea 
                            value={currentFeedback}
                            onChange={(e) => setCurrentFeedback(e.target.value)}
                            className="w-full border border-gray-200 bg-zinc-50 p-4 text-sm focus:border-black outline-none min-h-[100px] resize-none"
                            placeholder="Share your thoughts on flavor, texture, and presentation..."
                           />
                       </div>

                       <button 
                        onClick={submitRating}
                        disabled={currentRating === 0}
                        className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                       >
                           Submit Feedback
                       </button>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};