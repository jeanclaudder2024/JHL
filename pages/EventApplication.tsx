import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Calendar, MapPin, Users, Mail, Wine, ArrowLeft, Clock } from 'lucide-react';
import { eventsApi } from '../services/api';

export const EventApplication: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: '',
    startTime: '',
    location: '',
    guestCount: '',
    contactName: '',
    contactEmail: '',
    phone: '',
    serviceStyle: [] as string[],
    dietaryFocus: [] as string[],
    budget: '',
    vision: ''
  });

  const serviceStyles = ["Seated Multi-Course", "Buffet / Family Style", "Cocktail & Canapés", "Interactive Stations", "Corporate Boxed"];
  const dietaryOptions = ["Standard", "Vegetarian", "Vegan", "Gluten-Free", "Halal/Kosher"];
  const eventTypes = ["Corporate Gala", "Private Dinner", "Wedding", "Product Launch", "Networking", "Other"];

  const toggleSelection = (list: string[], item: string, field: 'serviceStyle' | 'dietaryFocus') => {
    const updatedList = list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await eventsApi.create(formData);
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting event inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-zinc-50">
        <div className="max-w-xl w-full bg-white p-12 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} />
          </div>
          <h2 className="font-serif text-3xl mb-4">Inquiry Sent</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for considering JHL for your upcoming event. We have received your details for the <span className="font-semibold text-black">{formData.eventType || 'event'}</span> on {formData.eventDate}.
          </p>
          <div className="bg-zinc-50 p-6 mb-8 text-left border-l-2 border-black">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Next Steps</h3>
            <p className="text-sm text-gray-700">
              Our Event Specialists will review your vision and availability. You will receive a preliminary consultation request at <span className="font-medium">{formData.contactEmail}</span> within 24 hours.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-400 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

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
            <h1 className="font-serif text-3xl md:text-4xl mb-4">Event Services</h1>
            <p className="text-gray-300 max-w-2xl mx-auto font-light">
              From intimate gatherings to grand statements. We curate culinary experiences that linger in memory long after the last course.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12">

            {/* Event Details */}
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <Calendar size={16} /> Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Event Type</label>
                  <select
                    required
                    value={formData.eventType}
                    onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent text-gray-700"
                  >
                    <option value="" disabled>Select Type</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Guest Count (Approx)</label>
                  <input
                    required
                    type="number"
                    value={formData.guestCount}
                    onChange={e => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300"
                    placeholder="e.g. 50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Date</label>
                  <input
                    required
                    type="date"
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300 text-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent text-gray-700"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Location / Venue</label>
                  <div className="flex items-center border-b border-gray-300 focus-within:border-black transition-colors">
                    <MapPin size={16} className="text-gray-400 mr-2" />
                    <input
                      required
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full py-2 outline-none bg-transparent placeholder-gray-300"
                      placeholder="Address or Venue Name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Culinary Vision */}
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <Wine size={16} /> Culinary Vision
              </h3>

              <div className="mb-8">
                <label className="block text-sm font-serif mb-4">Service Style</label>
                <div className="flex flex-wrap gap-3">
                  {serviceStyles.map(option => (
                    <div
                      key={option}
                      onClick={() => toggleSelection(formData.serviceStyle, option, 'serviceStyle')}
                      className={`cursor-pointer border px-4 py-3 text-sm transition-all duration-300 ${formData.serviceStyle.includes(option)
                          ? 'bg-black text-white border-black shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-serif mb-4">Dietary Requirements</label>
                <div className="flex flex-wrap gap-3">
                  {dietaryOptions.map(option => (
                    <div
                      key={option}
                      onClick={() => toggleSelection(formData.dietaryFocus, option, 'dietaryFocus')}
                      className={`cursor-pointer border px-4 py-2 text-xs uppercase tracking-wider rounded-full transition-all duration-300 ${formData.dietaryFocus.includes(option)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-600">Additional Notes / Theme</label>
                <textarea
                  value={formData.vision}
                  onChange={e => setFormData({ ...formData, vision: e.target.value })}
                  className="w-full border border-gray-300 p-3 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300 h-24 resize-none"
                  placeholder="Describe the atmosphere, specific dishes desired, or any other details..."
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <Mail size={16} /> Point of Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.contactName}
                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300"
                    placeholder="Host Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.contactEmail}
                    onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300"
                    placeholder="host@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-300"
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-600">Estimated Budget</label>
                  <select
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent text-gray-700"
                  >
                    <option value="" disabled>Select Range</option>
                    <option value="under_5k">&lt; $5,000</option>
                    <option value="5k_15k">$5,000 - $15,000</option>
                    <option value="15k_50k">$15,000 - $50,000</option>
                    <option value="50k_plus">$50,000+</option>
                  </select>
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
                {loading ? 'Processing...' : 'Submit Inquiry'}
              </button>
              <p className="mt-4 text-[10px] text-gray-400 max-w-md text-center">
                Submitting this form does not guarantee availability. A 50% deposit will be required upon contract signing to secure your date.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};