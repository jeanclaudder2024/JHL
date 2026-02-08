import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Building2, Users, Mail, Utensils, ArrowLeft, Send, Clock, MessageSquare, CreditCard, Lock, FileText, ChevronRight } from 'lucide-react';
import { ChatMessage } from '../types';

type ApplicationStep = 'FORM' | 'PENDING' | 'PAYMENT' | 'SUCCESS';

export const CorporateApplication: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('FORM');
  const [loading, setLoading] = useState(false);
  
  // Chat State for Pending Page
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello, I am the JHL Onboarding Specialist. I see you have just submitted your application. While you wait for the approval committee, do you have any specific questions about our contract terms?', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Form Data
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    employeeCount: '',
    contactName: '',
    contactEmail: '',
    phone: '',
    mealTypes: [] as string[],
    dietaryFocus: [] as string[],
    notes: ''
  });

  const [approvedAmount, setApprovedAmount] = useState("$0.00");

  const mealOptions = ["Daily Lunch", "Breakfast Meetings", "Office Snacks", "Event Catering"];
  const dietaryOptions = ["Balanced Standard", "Vegetarian/Vegan", "Paleo/Keto", "Gluten-Free", "Allergy Sensitive"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleSelection = (list: string[], item: string, field: 'mealTypes' | 'dietaryFocus') => {
    const updatedList = list.includes(item) 
      ? list.filter(i => i !== item)
      : [...list, item];
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentStep('PENDING');
      window.scrollTo(0, 0);
    }, 1500);
  };

  const handleSendMessage = () => {
    if(!chatInput.trim()) return;
    const newMsg: ChatMessage = { role: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    
    // Simulate Support Response
    setTimeout(() => {
        setChatMessages(prev => [...prev, {
            role: 'model', 
            text: 'Thank you. I have added that note to your file. An administrator is currently reviewing your dietary requirements.',
            timestamp: new Date()
        }]);
    }, 2000);
  };

  // Demo Helper to simulate Admin Action
  const simulateAdminApproval = () => {
    setLoading(true);
    setTimeout(() => {
        setApprovedAmount("$4,500.00");
        setCurrentStep('PAYMENT');
        setLoading(false);
        window.scrollTo(0, 0);
    }, 1500);
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        // Navigate to dashboard or login
        // In a real app, this would update user role. 
        // For demo, we send them to login/dashboard
        navigate('/auth'); 
    }, 2000);
  };

  // --- RENDERERS ---

  const renderPending = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-zinc-50 py-12">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            
            {/* Status Side */}
            <div className="p-12 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center">
                <div className="mb-8">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 text-xs uppercase tracking-widest rounded-full flex items-center w-max gap-2">
                        <Clock size={12} /> Pending Review
                    </span>
                </div>
                <h2 className="font-serif text-3xl mb-4">Application Submitted</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                    Thank you, <span className="font-semibold text-black">{formData.contactName}</span>. 
                    We have received the application for <span className="font-semibold text-black">{formData.companyName}</span>.
                </p>
                
                <div className="bg-zinc-50 p-6 border-l-2 border-black space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-gray-500">What happens next?</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex gap-3"><Check size={16} className="text-black" /> Initial screening of company details</li>
                        <li className="flex gap-3"><Clock size={16} className="text-gray-400" /> B2B Specialist review (In Progress)</li>
                        <li className="flex gap-3"><FileText size={16} className="text-gray-400" /> Proposal & Invoice Generation</li>
                        <li className="flex gap-3"><CreditCard size={16} className="text-gray-400" /> Payment & Onboarding</li>
                    </ul>
                </div>

                {/* DEMO BUTTON */}
                <button 
                    onClick={simulateAdminApproval}
                    className="mt-8 text-xs text-blue-600 underline hover:text-blue-800 text-left"
                >
                    (Demo: Simulate Admin Approval)
                </button>
            </div>

            {/* Chat Side */}
            <div className="bg-zinc-50 flex flex-col h-[500px] md:h-auto">
                <div className="p-4 bg-black text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs uppercase tracking-widest">Live Support</span>
                    </div>
                    <MessageSquare size={16} />
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 text-sm ${msg.role === 'user' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <input 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            type="text" 
                            placeholder="Message JHL Team..."
                            className="flex-grow bg-transparent text-sm outline-none placeholder-gray-400"
                        />
                        <button onClick={handleSendMessage} className="text-black hover:opacity-70">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderPayment = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-zinc-50 py-12">
        <div className="max-w-xl w-full bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-green-600 text-white p-4 text-center text-xs uppercase tracking-widest font-medium">
                Application Approved
            </div>
            
            <div className="p-12">
                <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl mb-2">Invoice Details</h2>
                    <p className="text-gray-500 text-sm">Please complete payment to activate your dashboard.</p>
                </div>

                <div className="border border-gray-200 p-6 mb-8 bg-zinc-50">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                        <span className="text-xs uppercase tracking-widest text-gray-500">Billed To</span>
                        <span className="font-semibold text-sm">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">Initial Membership Deposit</span>
                        <span className="font-medium text-sm">$1,500.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">First Month Catering Provision</span>
                        <span className="font-medium text-sm">{parseFloat(approvedAmount.replace(/[^0-9.-]+/g,"")) - 1500}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-black">
                        <span className="font-serif text-lg">Total Due</span>
                        <span className="font-serif text-2xl">{approvedAmount}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="border border-gray-200 p-4 flex items-center gap-4 cursor-pointer hover:border-black transition-colors">
                        <div className="w-4 h-4 rounded-full border border-gray-400 bg-black"></div>
                        <CreditCard size={20} />
                        <span className="text-sm font-medium">Credit Card</span>
                        <div className="flex gap-1 ml-auto">
                           <div className="w-8 h-5 bg-gray-200 rounded"></div>
                           <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <button 
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing Secure Payment...' : (
                            <>
                                <Lock size={14} /> Pay {approvedAmount} & Access Dashboard
                            </>
                        )}
                    </button>
                </div>
            </div>
            <div className="bg-gray-50 p-4 text-center text-[10px] text-gray-400 border-t border-gray-100">
                Encrypted via SSL. Powered by Stripe.
            </div>
        </div>
    </div>
  );

  // --- MAIN RENDER ---

  if (currentStep === 'PENDING') return renderPending();
  if (currentStep === 'PAYMENT') return renderPayment();

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-xs uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <div className="bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-black text-white p-8 md:p-12 text-center">
            <h1 className="font-serif text-3xl md:text-4xl mb-4">Corporate Membership</h1>
            <p className="text-gray-300 max-w-2xl mx-auto font-light">
              Cultivate a culture of wellness and excellence. Tell us about your organization, and we will design a culinary program that fuels performance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            
            {/* Company Details */}
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <Building2 size={16} /> Company Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Company Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Industry</label>
                  <input 
                    type="text" 
                    value={formData.industry}
                    onChange={e => setFormData({...formData, industry: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300"
                    placeholder="e.g. Technology, Finance"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Employee Count</label>
                  <select 
                    required
                    value={formData.employeeCount}
                    onChange={e => setFormData({...formData, employeeCount: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent text-gray-700"
                  >
                    <option value="" disabled>Select range</option>
                    <option value="1-10">1 - 10</option>
                    <option value="11-50">11 - 50</option>
                    <option value="51-200">51 - 200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Office Location</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <Users size={16} /> Representative Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.contactName}
                    onChange={e => setFormData({...formData, contactName: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Work Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.contactEmail}
                    onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Meal Preferences (Sort) */}
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <Utensils size={16} /> Program Preferences
              </h3>
              
              <div className="mb-8">
                <label className="block text-sm font-serif mb-4">Meal Types Required</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mealOptions.map(option => (
                    <div 
                      key={option}
                      onClick={() => toggleSelection(formData.mealTypes, option, 'mealTypes')}
                      className={`cursor-pointer border p-4 text-center text-sm transition-all duration-300 ${
                        formData.mealTypes.includes(option) 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-serif mb-4">Dietary Focus</label>
                <div className="flex flex-wrap gap-3">
                  {dietaryOptions.map(option => (
                    <div 
                      key={option}
                      onClick={() => toggleSelection(formData.dietaryFocus, option, 'dietaryFocus')}
                      className={`cursor-pointer border px-4 py-2 text-xs uppercase tracking-wider rounded-full transition-all duration-300 ${
                        formData.dietaryFocus.includes(option) 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-black text-white px-12 py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-all disabled:bg-gray-400 w-full md:w-auto"
              >
                {loading ? 'Processing...' : 'Submit Application'}
              </button>
              <p className="mt-4 text-[10px] text-gray-400 max-w-md text-center">
                By submitting this form, you agree to JHL's Privacy Policy and Terms of Service.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};