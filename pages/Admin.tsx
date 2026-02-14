import React, { useState, useEffect } from 'react';
import { CompanyApplication, ApplicationStatus, User, SupportTicket, EventInquiry, Meal, UserRole } from '../types';
import {
    Check, X, Clock, FileText, Users, Utensils, CreditCard, MessageSquare,
    BarChart3, Search, ChevronRight, DollarSign, Send, Calendar, Upload,
    MoreHorizontal, Plus, Filter, Download, Bell, QrCode, Package, UserPlus, CalendarDays
} from 'lucide-react';
import { applicationsApi, eventsApi, usersApi, mealsApi, supportApi, subscriptionsApi, mealAssignmentsApi } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

// Subscriptions Section Component with Meal Assignment
interface SubscriptionsSectionProps {
    users: User[];
    subscriptions: any[];
    setSubscriptions: React.Dispatch<React.SetStateAction<any[]>>;
    meals: Meal[];
}

const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({ users, subscriptions, setSubscriptions, meals }) => {
    const [activeTab, setActiveTab] = useState<'assignments' | 'plans'>('assignments');
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<any[]>([]);

    // Modal states
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedMealId, setSelectedMealId] = useState(''); // For single day
    const [selectedMealIds, setSelectedMealIds] = useState<string[]>([]); // For week/month - multiple meals
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('Lunch');
    const [assignType, setAssignType] = useState<'single' | 'week' | 'month'>('single');
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [assignmentsData, subsData] = await Promise.all([
                    mealAssignmentsApi.adminGetAll().catch(() => []),
                    subscriptionsApi.adminGetAll().catch(() => [])
                ]);
                setAssignments(assignmentsData);
                setSubscriptions(subsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [setSubscriptions]);

    const toggleMealSelection = (mealId: string) => {
        setSelectedMealIds(prev =>
            prev.includes(mealId)
                ? prev.filter(id => id !== mealId)
                : [...prev, mealId]
        );
    };

    const handleAssignMeal = async () => {
        // Validation based on assignment type
        if (!selectedUserId) return;
        if (assignType === 'single' && !selectedMealId) return;
        if (assignType !== 'single' && selectedMealIds.length === 0) return;

        try {
            setSaving(true);

            if (assignType === 'single') {
                const newAssignment = await mealAssignmentsApi.adminAssign({
                    userId: selectedUserId,
                    mealId: selectedMealId,
                    assignedDate: selectedDate,
                    deliveryTime: selectedDeliveryTime
                });
                setAssignments(prev => [newAssignment, ...prev]);
            } else {
                // Bulk assign for week (7 days) or month (30 days) with ROTATING meals
                const days = assignType === 'week' ? 7 : 30;
                const bulkAssignments = [];
                for (let i = 0; i < days; i++) {
                    const date = new Date(selectedDate);
                    date.setDate(date.getDate() + i);
                    // Rotate through selected meals
                    const mealIndex = i % selectedMealIds.length;
                    bulkAssignments.push({
                        mealId: selectedMealIds[mealIndex],
                        assignedDate: date.toISOString().split('T')[0],
                        deliveryTime: selectedDeliveryTime
                    });
                }
                await mealAssignmentsApi.adminAssignBulk(selectedUserId, bulkAssignments);
                // Refresh assignments
                const freshData = await mealAssignmentsApi.adminGetAll();
                setAssignments(freshData);
            }

            setAssignModalOpen(false);
            setSelectedUserId('');
            setSelectedMealId('');
            setSelectedMealIds([]);
        } catch (error) {
            console.error('Error assigning meal:', error);
            alert('Failed to assign meal. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelAssignment = async (id: string) => {
        if (!confirm('Cancel this meal assignment?')) return;
        try {
            await mealAssignmentsApi.adminUpdate(id, { status: 'CANCELLED' });
            setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
        } catch (error) {
            console.error('Error cancelling assignment:', error);
        }
    };

    const handleMarkDelivered = async (id: string) => {
        try {
            await mealAssignmentsApi.adminUpdate(id, { status: 'DELIVERED' });
            setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'DELIVERED' } : a));
        } catch (error) {
            console.error('Error marking delivered:', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.role !== UserRole.ADMIN &&
        (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-[10px] uppercase font-bold">Scheduled</span>;
            case 'DELIVERED':
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-[10px] uppercase font-bold">Delivered</span>;
            case 'CANCELLED':
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-[10px] uppercase font-bold">Cancelled</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-[10px] uppercase font-bold">{status}</span>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-serif text-2xl">Meal Assignments</h2>
                    <p className="text-gray-500 text-sm mt-1">Assign meals to users for daily, weekly, or monthly delivery.</p>
                </div>
                <button
                    onClick={() => setAssignModalOpen(true)}
                    className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2"
                >
                    <CalendarDays size={14} /> Assign Meals
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('assignments')}
                    className={`pb-3 text-xs uppercase tracking-widest font-medium ${activeTab === 'assignments' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                >
                    Meal Assignments
                </button>
                <button
                    onClick={() => setActiveTab('plans')}
                    className={`pb-3 text-xs uppercase tracking-widest font-medium ${activeTab === 'plans' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                >
                    Subscription Plans
                </button>
            </div>

            {/* Meal Assignments Tab */}
            {activeTab === 'assignments' && (
                <div className="bg-white border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-xs uppercase tracking-widest text-gray-500">Scheduled Meals</h3>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">
                            <Clock className="animate-spin mx-auto mb-2" size={24} />
                            <p className="text-sm">Loading assignments...</p>
                        </div>
                    ) : assignments.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <Utensils size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No meal assignments yet. Click "Assign Meals" to get started.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">User</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Meal</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Time</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="text-right px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {assignments.slice(0, 20).map(a => (
                                        <tr key={a.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-sm">{a.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-400">{a.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {a.meal?.image && (
                                                        <img src={a.meal.image} alt="" className="w-10 h-10 object-cover rounded" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-sm">{a.meal?.name}</div>
                                                        <div className="text-xs text-gray-400">{a.meal?.calories} kcal</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{new Date(a.assignedDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-xs text-gray-500 uppercase">{a.deliveryTime}</td>
                                            <td className="px-6 py-4">{getStatusBadge(a.status)}</td>
                                            <td className="px-6 py-4 text-right">
                                                {a.status === 'SCHEDULED' && (
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => handleMarkDelivered(a.id)}
                                                            className="text-xs text-green-600 hover:text-green-800"
                                                        >
                                                            Delivered
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelAssignment(a.id)}
                                                            className="text-xs text-red-500 hover:text-red-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Subscription Plans Tab */}
            {activeTab === 'plans' && (
                <div className="bg-white border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-xs uppercase tracking-widest text-gray-500">Active Subscriptions</h3>
                    </div>
                    {subscriptions.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <Package size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No active subscriptions.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">User</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Plan</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {subscriptions.map(sub => (
                                        <tr key={sub.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-sm">{sub.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-400">{sub.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-sm">{sub.planName}</td>
                                            <td className="px-6 py-4 text-sm">${parseFloat(sub.price).toLocaleString()}/{sub.cycle}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Assign Meal Modal */}
            {assignModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setAssignModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
                        <div className="mb-6">
                            <h2 className="font-serif text-2xl mb-1">Assign Meals to User</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Select user, meal, and delivery schedule</p>
                        </div>

                        <div className="space-y-5">
                            {/* User Search */}
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Select User *</label>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black mb-2"
                                />
                                <div className="max-h-32 overflow-y-auto border border-gray-200">
                                    {filteredUsers.length === 0 ? (
                                        <div className="p-4 text-center text-gray-400 text-sm">No users found</div>
                                    ) : (
                                        filteredUsers.slice(0, 10).map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => setSelectedUserId(user.id)}
                                                className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0 ${selectedUserId === user.id ? 'bg-black text-white hover:bg-gray-800' : ''}`}
                                            >
                                                <div className="font-medium text-sm">{user.name}</div>
                                                <div className={`text-xs ${selectedUserId === user.id ? 'text-gray-300' : 'text-gray-400'}`}>{user.email}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Meal Selection */}
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">
                                    {assignType === 'single' ? 'Select Meal *' : `Select Meals * (${selectedMealIds.length} selected - will rotate daily)`}
                                </label>
                                <div className="max-h-48 overflow-y-auto border border-gray-200">
                                    {meals.length === 0 ? (
                                        <div className="p-4 text-center text-gray-400 text-sm">No meals available. Add meals in Menu section first.</div>
                                    ) : (
                                        meals.filter(m => m.isActive !== false).map(meal => (
                                            <div
                                                key={meal.id}
                                                onClick={() => {
                                                    if (assignType === 'single') {
                                                        setSelectedMealId(meal.id);
                                                    } else {
                                                        toggleMealSelection(meal.id);
                                                    }
                                                }}
                                                className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-3 ${assignType === 'single'
                                                    ? selectedMealId === meal.id ? 'bg-black text-white hover:bg-gray-800' : ''
                                                    : selectedMealIds.includes(meal.id) ? 'bg-black text-white hover:bg-gray-800' : ''
                                                    }`}
                                            >
                                                {assignType !== 'single' && (
                                                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${selectedMealIds.includes(meal.id) ? 'bg-white border-white' : 'border-gray-300'}`}>
                                                        {selectedMealIds.includes(meal.id) && <Check size={14} className="text-black" />}
                                                    </div>
                                                )}
                                                {meal.image && <img src={meal.image} alt="" className="w-12 h-12 object-cover rounded flex-shrink-0" />}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm truncate">{meal.name}</div>
                                                    <div className={`text-xs ${(assignType === 'single' ? selectedMealId === meal.id : selectedMealIds.includes(meal.id))
                                                        ? 'text-gray-300' : 'text-gray-400'
                                                        }`}>{meal.type} • {meal.calories} kcal</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Assignment Type */}
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Assignment Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[{ type: 'single', label: 'Single Day' }, { type: 'week', label: 'Full Week' }, { type: 'month', label: 'Full Month' }].map(opt => (
                                        <button
                                            key={opt.type}
                                            onClick={() => {
                                                setAssignType(opt.type as any);
                                                // Clear selections when switching modes
                                                if (opt.type === 'single') {
                                                    setSelectedMealIds([]);
                                                } else {
                                                    setSelectedMealId('');
                                                }
                                            }}
                                            className={`p-3 border text-xs uppercase tracking-widest ${assignType === opt.type ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">
                                        {assignType === 'single' ? 'Delivery Date' : 'Start Date'}
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                        className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Delivery Time</label>
                                    <select
                                        value={selectedDeliveryTime}
                                        onChange={e => setSelectedDeliveryTime(e.target.value)}
                                        className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    >
                                        <option value="Breakfast">Breakfast</option>
                                        <option value="Lunch">Lunch</option>
                                        <option value="Dinner">Dinner</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleAssignMeal}
                                disabled={!selectedUserId || (assignType === 'single' ? !selectedMealId : selectedMealIds.length === 0) || saving}
                                className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800 mt-2 disabled:bg-gray-400"
                            >
                                {saving ? 'Assigning...' : assignType === 'single' ? 'Assign Meal' : `Assign ${selectedMealIds.length} Meal${selectedMealIds.length !== 1 ? 's' : ''} for ${assignType === 'week' ? '7 Days' : '30 Days'}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export const Admin: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'overview' | 'inbox' | 'clients' | 'menu' | 'subscriptions' | 'finance' | 'support'>('inbox');
    const [inboxTab, setInboxTab] = useState<'applications' | 'events'>('applications');
    const [loading, setLoading] = useState(true);

    // -- STATE MANAGEMENT --
    const [notifications] = useState([
        { id: 1, text: "New Corporate Application: Apex Tech", time: "2m ago" },
        { id: 2, text: "Event Inquiry: Summer Gala", time: "15m ago" }
    ]);

    const [applications, setApplications] = useState<CompanyApplication[]>([]);
    const [events, setEvents] = useState<EventInquiry[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [menuItems, setMenuItems] = useState<Meal[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [appsData, eventsData, usersData, mealsData, ticketsData] = await Promise.all([
                    applicationsApi.getAll().catch(() => []),
                    eventsApi.getAll().catch(() => []),
                    usersApi.getAll().catch(() => []),
                    mealsApi.getAll().catch(() => []),
                    supportApi.getAll().catch(() => []),
                ]);

                // Transform applications data
                setApplications(appsData.map((app: any) => ({
                    id: app.id,
                    companyName: app.company?.name || 'Unknown',
                    employeeCount: app.company?.employeeCount || 0,
                    contactEmail: app.contactEmail,
                    status: app.status as ApplicationStatus,
                    date: new Date(app.createdAt).toISOString().split('T')[0],
                    invoiceAmount: app.invoiceAmount ? `$${parseFloat(app.invoiceAmount).toLocaleString()}` : undefined,
                })));

                // Transform events data
                setEvents(eventsData.map((event: any) => ({
                    id: event.id,
                    eventType: event.eventType,
                    eventDate: new Date(event.eventDate).toISOString().split('T')[0],
                    guestCount: String(event.guestCount),
                    contactName: event.contactName,
                    contactEmail: event.contactEmail,
                    location: event.location,
                    status: event.status === 'NEW' ? 'New' : event.status === 'IN_DISCUSSION' ? 'In Discussion' : event.status === 'CONFIRMED' ? 'Confirmed' : 'Declined',
                    budget: event.budget,
                })));

                // Transform users data
                setUsers(usersData.map((user: any) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role as UserRole,
                    companyName: user.company?.name,
                })));

                // Transform meals data
                setMenuItems(mealsData.map((meal: any) => ({
                    id: meal.id,
                    name: meal.name,
                    description: meal.description,
                    calories: meal.calories,
                    date: new Date(meal.date).toISOString().split('T')[0],
                    type: meal.type,
                    image: meal.image,
                })));

                // Transform tickets data
                setTickets(ticketsData.map((ticket: any) => ({
                    id: ticket.id,
                    user: ticket.user?.name || 'Unknown',
                    subject: ticket.subject,
                    status: ticket.status === 'OPEN' ? 'Open' : 'Resolved',
                    lastMessage: ticket.lastMessage,
                    date: new Date(ticket.createdAt).toISOString().split('T')[0],
                })));

            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // -- MODAL STATES --
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [invoiceAmount, setInvoiceAmount] = useState('');
    const [menuUploadOpen, setMenuUploadOpen] = useState(false);
    const [addMealModalOpen, setAddMealModalOpen] = useState(false);
    const [viewMealModalOpen, setViewMealModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [editMealData, setEditMealData] = useState({
        name: '',
        description: '',
        calories: '',
        type: 'Standard',
        image: '',
        ingredients: '',
        protein: '',
        carbs: '',
        fats: '',
        isActive: true
    });
    const [newMealData, setNewMealData] = useState({
        name: '',
        description: '',
        calories: '',
        type: 'Standard',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
        ingredients: '',
        protein: '',
        carbs: '',
        fats: '',
        isActive: true
    });
    const [savingMeal, setSavingMeal] = useState(false);
    const [viewEventModalOpen, setViewEventModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventInquiry | null>(null);
    const [eventStatus, setEventStatus] = useState('');
    const [viewApplicationModalOpen, setViewApplicationModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [applicationDetails, setApplicationDetails] = useState<any>(null);

    // -- ACTIONS --
    const handleApprove = async () => {
        if (!selectedAppId || !invoiceAmount) return;
        try {
            const amount = parseFloat(invoiceAmount.replace(/[$,]/g, ''));
            await applicationsApi.approve(selectedAppId, amount);
            setApplications(apps => apps.map(app =>
                app.id === selectedAppId
                    ? { ...app, status: ApplicationStatus.APPROVED_UNPAID, invoiceAmount: invoiceAmount }
                    : app
            ));
            setBillingModalOpen(false);
            setSelectedAppId(null);
        } catch (error) {
            console.error('Error approving application:', error);
        }
    };

    const handleReject = async (id: string) => {
        if (window.confirm('Are you sure you want to reject this application? This action cannot be undone.')) {
            try {
                await applicationsApi.reject(id);
                setApplications(apps => apps.map(app =>
                    app.id === id
                        ? { ...app, status: ApplicationStatus.REJECTED }
                        : app
                ));
            } catch (error) {
                console.error('Error rejecting application:', error);
            }
        }
    };

    const handleAddMeal = async () => {
        if (!newMealData.name || !newMealData.description) {
            alert('Please fill in required fields (name and description)');
            return;
        }
        try {
            setSavingMeal(true);
            const result = await mealsApi.create({
                name: newMealData.name,
                description: newMealData.description,
                calories: parseInt(newMealData.calories) || 0,
                type: newMealData.type,
                image: newMealData.image,
                date: new Date().toISOString(),
                ingredients: newMealData.ingredients,
                protein: parseInt(newMealData.protein) || 0,
                carbs: parseInt(newMealData.carbs) || 0,
                fats: parseInt(newMealData.fats) || 0,
                isActive: newMealData.isActive
            });
            setMenuItems(prev => [...prev, {
                id: result.id,
                name: result.name,
                description: result.description,
                calories: result.calories,
                date: new Date(result.date).toISOString().split('T')[0],
                type: result.type,
                image: result.image,
            }]);
            setAddMealModalOpen(false);
            setNewMealData({ name: '', description: '', calories: '', type: 'Standard', image: 'https://picsum.photos/800/600' });
        } catch (error) {
            console.error('Error creating meal:', error);
            alert('Failed to add meal. Please try again.');
        } finally {
            setSavingMeal(false);
        }
    };

    const openMealDetails = (meal: Meal) => {
        setSelectedMeal(meal);
        setEditMealData({
            name: meal.name,
            description: meal.description || '',
            calories: String(meal.calories || ''),
            type: meal.type || 'Standard',
            image: meal.image || '',
            ingredients: (meal as any).ingredients || '',
            protein: String((meal as any).protein || ''),
            carbs: String((meal as any).carbs || ''),
            fats: String((meal as any).fats || ''),
            isActive: (meal as any).isActive !== false
        });
        setViewMealModalOpen(true);
    };

    const handleUpdateMeal = async () => {
        if (!selectedMeal || !editMealData.name) return;
        try {
            setSavingMeal(true);
            await mealsApi.update(selectedMeal.id, {
                name: editMealData.name,
                description: editMealData.description,
                calories: parseInt(editMealData.calories) || 0,
                type: editMealData.type,
                image: editMealData.image,
                ingredients: editMealData.ingredients,
                protein: parseInt(editMealData.protein) || 0,
                carbs: parseInt(editMealData.carbs) || 0,
                fats: parseInt(editMealData.fats) || 0,
                isActive: editMealData.isActive
            });
            setMenuItems(prev => prev.map(m =>
                m.id === selectedMeal.id
                    ? { ...m, ...editMealData, calories: parseInt(editMealData.calories) || 0 }
                    : m
            ));
            setViewMealModalOpen(false);
            setSelectedMeal(null);
        } catch (error) {
            console.error('Error updating meal:', error);
            alert('Failed to update meal. Please try again.');
        } finally {
            setSavingMeal(false);
        }
    };

    const handleDeleteMeal = async () => {
        if (!selectedMeal) return;
        if (!window.confirm('Are you sure you want to delete this meal?')) return;
        try {
            await mealsApi.delete(selectedMeal.id);
            setMenuItems(prev => prev.filter(m => m.id !== selectedMeal.id));
            setViewMealModalOpen(false);
            setSelectedMeal(null);
        } catch (error) {
            console.error('Error deleting meal:', error);
            alert('Failed to delete meal. Please try again.');
        }
    };

    const openEventDetails = (event: EventInquiry) => {
        setSelectedEvent(event);
        setEventStatus(event.status);
        setViewEventModalOpen(true);
    };

    const handleUpdateEventStatus = async (newStatus: string) => {
        if (!selectedEvent) return;
        try {
            await eventsApi.updateStatus(selectedEvent.id, newStatus);
            setEvents(prev => prev.map(e =>
                e.id === selectedEvent.id
                    ? { ...e, status: newStatus }
                    : e
            ));
            setSelectedEvent({ ...selectedEvent, status: newStatus });
            setEventStatus(newStatus);
        } catch (error) {
            console.error('Error updating event status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const openApproveModal = (id: string) => {
        setSelectedAppId(id);

        // Smart Invoice Generation
        // Calculate suggested amount: Base Fee ($500) + Per Employee Fee ($25)
        const app = applications.find(a => a.id === id);
        if (app) {
            const estimatedAmount = 500 + (app.employeeCount * 25);
            setInvoiceAmount(`$${estimatedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
        } else {
            setInvoiceAmount('');
        }

        setBillingModalOpen(true);
    };

    const openApplicationDetails = async (app: CompanyApplication) => {
        setSelectedApplication(app);
        setViewApplicationModalOpen(true);

        // Try to fetch full details from API
        try {
            const fullDetails = await applicationsApi.getById(app.id);
            setApplicationDetails(fullDetails);
        } catch (error) {
            console.error('Error fetching application details:', error);
            setApplicationDetails(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active': case 'Paid': case 'Confirmed': case 'APPROVED_PAID':
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Active</span>;
            case 'Pending': case 'New': case 'PENDING':
                return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Pending</span>;
            case 'Rejected': case 'Declined': case 'REJECTED':
                return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Rejected</span>;
            case 'In Discussion': case 'Open': case 'APPROVED_UNPAID':
                return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Action Req</span>;
            default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">{status}</span>;
        }
    };

    const SidebarItem = ({ id, icon: Icon, label, alert }: { id: typeof activeSection, icon: any, label: string, alert?: boolean }) => (
        <button
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center justify-between px-6 py-4 text-sm transition-all border-l-4 ${activeSection === id ? 'bg-zinc-100 border-black text-black font-medium' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-black'}`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="uppercase tracking-widest text-xs">{label}</span>
            </div>
            {alert && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
        </button>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row relative font-sans">

            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col h-screen sticky top-0">
                <div className="p-8 border-b border-gray-100">
                    <div className="font-serif text-2xl tracking-wide font-bold">JHL Team</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Operations Portal</div>
                </div>

                <nav className="flex-grow py-6 space-y-1">
                    <SidebarItem id="overview" icon={BarChart3} label="Dashboard" />
                    <SidebarItem id="inbox" icon={FileText} label="Inbox & Requests" alert={true} />
                    <SidebarItem id="clients" icon={Users} label="Client Base" />
                    <SidebarItem id="menu" icon={Utensils} label="Menu Management" />
                    <SidebarItem id="subscriptions" icon={Package} label="Subscriptions" />
                    <SidebarItem id="finance" icon={CreditCard} label="Finance" />
                    <SidebarItem id="support" icon={MessageSquare} label="Support Center" alert={true} />
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">AD</div>
                        <div>
                            <div className="text-sm font-medium">Admin User</div>
                            <div className="text-xs text-gray-400">Head of Operations</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow bg-zinc-50/50 overflow-y-auto h-screen">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
                    <h1 className="font-serif text-xl capitalize">{activeSection.replace('-', ' ')}</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input type="text" placeholder="Search..." className="bg-gray-100 rounded-full px-4 py-2 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-black transition-all" />
                            <Search size={14} className="absolute right-3 top-2.5 text-gray-400" />
                        </div>
                        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">

                    {/* OVERVIEW SECTION */}
                    {activeSection === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-black text-white p-6 shadow-xl">
                                    <div className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">Monthly Revenue</div>
                                    <div className="text-3xl font-serif mb-2">$124,500</div>
                                    <div className="text-xs text-green-400 flex items-center gap-1">+12% vs last month</div>
                                </div>
                                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                                    <div className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">Active Companies</div>
                                    <div className="text-3xl font-serif mb-2">24</div>
                                    <div className="text-xs text-gray-500">2 pending approval</div>
                                </div>
                                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                                    <div className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">Daily Meals Served</div>
                                    <div className="text-3xl font-serif mb-2">1,842</div>
                                    <div className="text-xs text-gray-500">98% satisfaction rate</div>
                                </div>
                                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                                    <div className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">Event Inquiries</div>
                                    <div className="text-3xl font-serif mb-2">{events.filter(e => e.status === 'New').length}</div>
                                    <div className="text-xs text-blue-600">New leads this week</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Notifications / Activity */}
                                <div className="bg-white border border-gray-100 p-6">
                                    <h3 className="font-serif text-lg mb-4">Recent Activity</h3>
                                    <div className="space-y-4">
                                        {notifications.map(n => (
                                            <div key={n.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="text-sm flex-grow">{n.text}</span>
                                                <span className="text-xs text-gray-400">{n.time}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded transition-colors cursor-pointer border-b border-gray-50">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-sm flex-grow">Payment received from Aura Creative</span>
                                            <span className="text-xs text-gray-400">1h ago</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white border border-gray-100 p-6">
                                    <h3 className="font-serif text-lg mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setActiveSection('menu')} className="p-4 border border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all text-center">
                                            <Upload className="mx-auto mb-2 opacity-50" />
                                            <span className="text-xs uppercase tracking-widest font-medium">Upload Menu</span>
                                        </button>
                                        <button onClick={() => { setActiveSection('inbox'); setInboxTab('events'); }} className="p-4 border border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all text-center">
                                            <Calendar className="mx-auto mb-2 opacity-50" />
                                            <span className="text-xs uppercase tracking-widest font-medium">Review Events</span>
                                        </button>
                                        <button onClick={() => { setActiveSection('inbox'); setInboxTab('applications'); }} className="p-4 border border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all text-center">
                                            <Users className="mx-auto mb-2 opacity-50" />
                                            <span className="text-xs uppercase tracking-widest font-medium">Approve Companies</span>
                                        </button>
                                        <button onClick={() => setActiveSection('support')} className="p-4 border border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all text-center">
                                            <MessageSquare className="mx-auto mb-2 opacity-50" />
                                            <span className="text-xs uppercase tracking-widest font-medium">Support Chat</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INBOX (Unified Apps + Events) */}
                    {activeSection === 'inbox' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex space-x-6 border-b border-gray-200">
                                <button
                                    onClick={() => setInboxTab('applications')}
                                    className={`pb-4 text-sm uppercase tracking-widest transition-colors ${inboxTab === 'applications' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
                                >
                                    Corporate Applications
                                </button>
                                <button
                                    onClick={() => setInboxTab('events')}
                                    className={`pb-4 text-sm uppercase tracking-widest transition-colors ${inboxTab === 'events' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
                                >
                                    Event Inquiries
                                </button>
                            </div>

                            {inboxTab === 'applications' && (
                                <div className="bg-white border border-gray-200 shadow-sm">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Company Name</th>
                                                <th className="px-6 py-4 font-medium">Contact Email</th>
                                                <th className="px-6 py-4 font-medium">Date</th>
                                                <th className="px-6 py-4 font-medium">Status</th>
                                                <th className="px-6 py-4 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {applications.map(app => (
                                                <tr key={app.id} className="hover:bg-zinc-50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{app.companyName}</div>
                                                        <div className="text-xs text-gray-500">{app.employeeCount} Employees</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{app.contactEmail}</td>
                                                    <td className="px-6 py-4 text-gray-500 text-xs">{app.date}</td>
                                                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => openApplicationDetails(app)} className="text-xs border border-gray-300 px-3 py-1.5 uppercase tracking-wider hover:border-black hover:text-black transition-colors">View</button>
                                                            {app.status === ApplicationStatus.PENDING && (
                                                                <>
                                                                    <button onClick={() => openApproveModal(app.id)} className="text-xs bg-black text-white px-3 py-1.5 uppercase tracking-wider hover:bg-gray-800">Approve</button>
                                                                    <button onClick={() => handleReject(app.id)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 uppercase tracking-wider hover:border-red-500 hover:text-red-500 transition-colors">Reject</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {inboxTab === 'events' && (
                                <div className="bg-white border border-gray-200 shadow-sm">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Event Type</th>
                                                <th className="px-6 py-4 font-medium">Client</th>
                                                <th className="px-6 py-4 font-medium">Date/Loc</th>
                                                <th className="px-6 py-4 font-medium">Budget</th>
                                                <th className="px-6 py-4 font-medium">Status</th>
                                                <th className="px-6 py-4 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {events.map(evt => (
                                                <tr key={evt.id} className="hover:bg-zinc-50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{evt.eventType}</div>
                                                        <div className="text-xs text-gray-500">{evt.guestCount} Guests</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        <div>{evt.contactName}</div>
                                                        <div className="text-xs text-gray-400">{evt.contactEmail}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                                        <div>{evt.eventDate}</div>
                                                        <div>{evt.location}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-xs">{evt.budget}</td>
                                                    <td className="px-6 py-4">{getStatusBadge(evt.status)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => openEventDetails(evt)}
                                                            className="text-xs border border-gray-300 px-3 py-1.5 uppercase tracking-wider hover:border-black hover:text-black transition-colors"
                                                        >Details</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CLIENT BASE */}
                    {activeSection === 'clients' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex justify-between items-center">
                                <h2 className="font-serif text-2xl">Client Database</h2>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-xs uppercase tracking-widest hover:border-black transition-colors"><Filter size={14} /> Filter</button>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-xs uppercase tracking-widest hover:border-black transition-colors"><Download size={14} /> Export</button>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">User / Company</th>
                                            <th className="px-6 py-4 font-medium">Role</th>
                                            <th className="px-6 py-4 font-medium">Plan Type</th>
                                            <th className="px-6 py-4 font-medium">Join Date</th>
                                            <th className="px-6 py-4 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-zinc-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] uppercase font-bold">{u.role}</span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">
                                                    {u.companyName ? <span className="text-black font-medium">{u.companyName} Member</span> : 'Individual Premium'}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">Jan 20, 2024</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-gray-400 hover:text-black">Edit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* MENU MANAGEMENT */}
                    {activeSection === 'menu' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="font-serif text-2xl">Culinary Programs</h2>
                                    <p className="text-gray-500 text-sm mt-1">Manage weekly offerings for all tiers.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setMenuUploadOpen(true)}
                                        className="bg-white border border-gray-200 text-black px-6 py-3 text-xs uppercase tracking-widest hover:border-black flex items-center gap-2 transition-colors"
                                    >
                                        <Upload size={14} /> Upload Weekly Plan
                                    </button>
                                    <button
                                        onClick={() => setAddMealModalOpen(true)}
                                        className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 transition-colors"
                                    >
                                        <Plus size={14} /> Add Meal Item
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {menuItems.map(item => (
                                    <div key={item.id} className="bg-white border border-gray-200 group hover:shadow-lg transition-all duration-300">
                                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute top-2 right-2">
                                                <span className="bg-white/90 backdrop-blur px-2 py-1 text-[10px] uppercase font-bold tracking-widest">{item.type}</span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-serif text-lg">{item.name}</h3>
                                                <span className="text-xs text-gray-400">{item.calories} kcal</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">{item.date}</span>
                                                <button
                                                    onClick={() => openMealDetails(item)}
                                                    className="text-xs font-medium hover:underline"
                                                >Edit Details</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Placeholder for visual balance */}
                                <div className="border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6 min-h-[300px] hover:border-black hover:text-black transition-colors cursor-pointer group">
                                    <Plus size={48} className="mb-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-xs uppercase tracking-widest">Create New Meal</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FINANCE (Simplified for visual) */}
                    {activeSection === 'finance' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <h2 className="font-serif text-2xl">Financial Overview</h2>
                            <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 py-24">
                                <CreditCard size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Secure financial data integration active.</p>
                                <p className="text-xs uppercase tracking-widest mt-2">View Stripe Dashboard for detailed reporting.</p>
                            </div>
                        </div>
                    )}

                    {/* SUBSCRIPTIONS MANAGEMENT */}
                    {activeSection === 'subscriptions' && (
                        <SubscriptionsSection
                            users={users}
                            subscriptions={subscriptions}
                            setSubscriptions={setSubscriptions}
                            meals={menuItems}
                        />
                    )}

                    {/* SUPPORT CENTER */}
                    {activeSection === 'support' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex justify-between items-center">
                                <h2 className="font-serif text-2xl">Concierge Desk</h2>
                                <div className="text-sm text-gray-500">2 Active Tickets</div>
                            </div>
                            <div className="bg-white border border-gray-200 divide-y divide-gray-100">
                                {tickets.map(t => (
                                    <div key={t.id} className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${t.status === 'Open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                <MessageSquare size={18} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{t.subject} <span className="text-gray-400 font-normal ml-2">#{t.id}</span></div>
                                                <div className="text-sm text-gray-500">Last message: "{t.lastMessage}"</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400 mb-1">{t.date}</div>
                                            <div className="text-xs font-medium">{t.user}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* -- MODALS -- */}

            {/* Billing Modal */}
            {billingModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-lg w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative">
                        <button onClick={() => setBillingModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
                        <div className="mb-6">
                            <h2 className="font-serif text-2xl mb-1">Generate Contract</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Approving Company ID: {selectedAppId}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Monthly Fee</label>
                                <div className="flex items-center border-b border-gray-300 py-2">
                                    <span className="font-serif text-lg mr-2">$</span>
                                    <input autoFocus value={invoiceAmount} onChange={e => setInvoiceAmount(e.target.value)} type="text" className="w-full text-xl font-serif outline-none" placeholder="0.00" />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">Suggested amount calculated based on employee count ($25/head + $500 base).</p>
                            </div>
                            <button onClick={handleApprove} className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800 mt-4">Send Invoice & Approve</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Upload Modal Simulation */}
            {menuUploadOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-lg w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative text-center">
                        <button onClick={() => setMenuUploadOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
                        <Upload size={48} className="mx-auto mb-4 text-gray-300" />
                        <h2 className="font-serif text-2xl mb-2">Upload Weekly Plan</h2>
                        <p className="text-sm text-gray-500 mb-6">Drag and drop your CSV or JSON menu file here.</p>
                        <div className="border-2 border-dashed border-gray-200 p-8 mb-6 hover:bg-gray-50 transition-colors">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Select File</span>
                        </div>
                        <button onClick={() => setMenuUploadOpen(false)} className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800">Processing Simulation...</button>
                    </div>
                </div>
            )}

            {/* Add Meal Modal */}
            {addMealModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-lg w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative">
                        <button onClick={() => setAddMealModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
                        <div className="mb-6">
                            <h2 className="font-serif text-2xl mb-1">Add New Meal</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Create a new menu item</p>
                        </div>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Meal Name *</label>
                                <input
                                    value={newMealData.name}
                                    onChange={e => setNewMealData({ ...newMealData, name: e.target.value })}
                                    type="text"
                                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    placeholder="e.g., Grilled Salmon Bowl"
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Description *</label>
                                <textarea
                                    value={newMealData.description}
                                    onChange={e => setNewMealData({ ...newMealData, description: e.target.value })}
                                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black resize-none h-24"
                                    placeholder="Describe the meal ingredients and preparation..."
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Ingredients</label>
                                <textarea
                                    value={newMealData.ingredients}
                                    onChange={e => setNewMealData({ ...newMealData, ingredients: e.target.value })}
                                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black resize-none h-20"
                                    placeholder="e.g., Chicken breast, brown rice, steamed broccoli, olive oil..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Calories</label>
                                    <input
                                        value={newMealData.calories}
                                        onChange={e => setNewMealData({ ...newMealData, calories: e.target.value })}
                                        type="number"
                                        className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                        placeholder="500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Type</label>
                                    <select
                                        value={newMealData.type}
                                        onChange={e => setNewMealData({ ...newMealData, type: e.target.value })}
                                        className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black bg-white"
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Vegetarian">Vegetarian</option>
                                        <option value="Vegan">Vegan</option>
                                        <option value="Gluten-Free">Gluten-Free</option>
                                        <option value="Keto">Keto</option>
                                    </select>
                                </div>
                            </div>

                            {/* Macronutrients */}
                            <div className="border-t border-gray-100 pt-4">
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-3">Macronutrients (grams)</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Protein</label>
                                        <input
                                            value={newMealData.protein}
                                            onChange={e => setNewMealData({ ...newMealData, protein: e.target.value })}
                                            type="number"
                                            placeholder="0g"
                                            className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Carbs</label>
                                        <input
                                            value={newMealData.carbs}
                                            onChange={e => setNewMealData({ ...newMealData, carbs: e.target.value })}
                                            type="number"
                                            placeholder="0g"
                                            className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Fats</label>
                                        <input
                                            value={newMealData.fats}
                                            onChange={e => setNewMealData({ ...newMealData, fats: e.target.value })}
                                            type="number"
                                            placeholder="0g"
                                            className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Image URL</label>
                                <input
                                    value={newMealData.image}
                                    onChange={e => setNewMealData({ ...newMealData, image: e.target.value })}
                                    type="text"
                                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    placeholder="https://..."
                                />
                            </div>
                            <button
                                onClick={handleAddMeal}
                                disabled={savingMeal}
                                className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800 mt-4 disabled:bg-gray-400"
                            >
                                {savingMeal ? 'Saving...' : 'Add Meal to Menu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View/Edit Meal Modal */}
            {viewMealModalOpen && selectedMeal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-lg w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => { setViewMealModalOpen(false); setSelectedMeal(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
                        <div className="mb-6">
                            <h2 className="font-serif text-2xl mb-1">Edit Meal</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Modify or delete this menu item</p>
                        </div>
                        {selectedMeal.image && (
                            <div className="h-40 bg-gray-100 mb-6 overflow-hidden">
                                <img src={editMealData.image || selectedMeal.image} alt={selectedMeal.name} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* QR Code Section */}
                        <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-white p-2 border border-gray-200">
                                    <QRCodeSVG
                                        value={`${window.location.origin}/#/meal/${selectedMeal.id}`}
                                        size={80}
                                        level="H"
                                        includeMargin={false}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <QrCode size={16} className="text-gray-500" />
                                        <span className="text-xs uppercase tracking-widest text-gray-500">Meal QR Code</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3">Scan to view meal details on any device</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const svg = document.querySelector('.meal-qr-code-svg svg');
                                            if (svg) {
                                                const serializer = new XMLSerializer();
                                                const source = serializer.serializeToString(svg);
                                                const blob = new Blob([source], { type: 'image/svg+xml' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `meal-${selectedMeal.id}-qr.svg`;
                                                a.click();
                                                URL.revokeObjectURL(url);
                                            }
                                        }}
                                        className="text-xs border border-gray-300 px-3 py-1 hover:border-black transition-colors flex items-center gap-1"
                                    >
                                        <Download size={12} /> Download QR
                                    </button>
                                </div>
                            </div>
                            <div className="meal-qr-code-svg hidden">
                                <QRCodeSVG
                                    value={`${window.location.origin}/#/meal/${selectedMeal.id}`}
                                    size={300}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Meal Name *</label>
                                <input
                                    value={editMealData.name}
                                    onChange={e => setEditMealData({ ...editMealData, name: e.target.value })}
                                    type="text"
                                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Description</label>
                                <textarea
                                    value={editMealData.description}
                                    onChange={e => setEditMealData({ ...editMealData, description: e.target.value })}
                                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black resize-none h-24"
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Ingredients</label>
                                <textarea
                                    value={editMealData.ingredients}
                                    onChange={e => setEditMealData({ ...editMealData, ingredients: e.target.value })}
                                    placeholder="e.g., Chicken breast, brown rice, steamed broccoli, olive oil..."
                                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black resize-none h-20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Calories</label>
                                    <input
                                        value={editMealData.calories}
                                        onChange={e => setEditMealData({ ...editMealData, calories: e.target.value })}
                                        type="number"
                                        className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Type</label>
                                    <select
                                        value={editMealData.type}
                                        onChange={e => setEditMealData({ ...editMealData, type: e.target.value })}
                                        className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black bg-white"
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Vegetarian">Vegetarian</option>
                                        <option value="Vegan">Vegan</option>
                                        <option value="Gluten-Free">Gluten-Free</option>
                                        <option value="Keto">Keto</option>
                                    </select>
                                </div>
                            </div>

                            {/* Macronutrients */}
                            <div className="border-t border-gray-100 pt-4">
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-3">Macronutrients (grams)</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Protein</label>
                                        <input
                                            value={editMealData.protein}
                                            onChange={e => setEditMealData({ ...editMealData, protein: e.target.value })}
                                            type="number"
                                            placeholder="0g"
                                            className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Carbs</label>
                                        <input
                                            value={editMealData.carbs}
                                            onChange={e => setEditMealData({ ...editMealData, carbs: e.target.value })}
                                            type="number"
                                            placeholder="0g"
                                            className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Fats</label>
                                        <input
                                            value={editMealData.fats}
                                            onChange={e => setEditMealData({ ...editMealData, fats: e.target.value })}
                                            type="number"
                                            placeholder="0g"
                                            className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Image URL</label>
                                <input
                                    value={editMealData.image}
                                    onChange={e => setEditMealData({ ...editMealData, image: e.target.value })}
                                    type="text"
                                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block">Active Status</label>
                                    <p className="text-xs text-gray-400">Inactive meals won't appear in menus</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditMealData({ ...editMealData, isActive: !editMealData.isActive })}
                                    className={`relative w-14 h-7 rounded-full transition-colors ${editMealData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${editMealData.isActive ? 'left-8' : 'left-1'}`}></span>
                                </button>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleDeleteMeal}
                                    className="flex-1 border border-red-200 text-red-600 py-4 text-xs uppercase tracking-widest hover:bg-red-50"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={handleUpdateMeal}
                                    disabled={savingMeal}
                                    className="flex-1 bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400"
                                >
                                    {savingMeal ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Details Modal */}
            {viewEventModalOpen && selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => { setViewEventModalOpen(false); setSelectedEvent(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
                        <div className="mb-6">
                            <h2 className="font-serif text-2xl mb-1">{selectedEvent.eventType}</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Event Inquiry Details</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Contact Name</label>
                                    <div className="font-medium">{selectedEvent.contactName}</div>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Email</label>
                                    <div className="font-medium text-sm">{selectedEvent.contactEmail}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Event Date</label>
                                    <div className="font-medium">{selectedEvent.eventDate}</div>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Guest Count</label>
                                    <div className="font-medium">{selectedEvent.guestCount} guests</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Location</label>
                                    <div className="font-medium">{selectedEvent.location}</div>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Budget</label>
                                    <div className="font-medium font-mono">{selectedEvent.budget}</div>
                                </div>
                            </div>

                            {selectedEvent.vision && (
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Vision / Notes</label>
                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 border border-gray-100">{selectedEvent.vision}</div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100">
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Update Status</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleUpdateEventStatus('New')}
                                        className={`px-3 py-2 text-xs uppercase tracking-wider border ${eventStatus === 'New' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'border-gray-200 hover:border-yellow-300'}`}
                                    >New</button>
                                    <button
                                        onClick={() => handleUpdateEventStatus('In Discussion')}
                                        className={`px-3 py-2 text-xs uppercase tracking-wider border ${eventStatus === 'In Discussion' ? 'bg-blue-100 border-blue-300 text-blue-800' : 'border-gray-200 hover:border-blue-300'}`}
                                    >In Discussion</button>
                                    <button
                                        onClick={() => handleUpdateEventStatus('Confirmed')}
                                        className={`px-3 py-2 text-xs uppercase tracking-wider border ${eventStatus === 'Confirmed' ? 'bg-green-100 border-green-300 text-green-800' : 'border-gray-200 hover:border-green-300'}`}
                                    >Confirmed</button>
                                    <button
                                        onClick={() => handleUpdateEventStatus('Declined')}
                                        className={`px-3 py-2 text-xs uppercase tracking-wider border ${eventStatus === 'Declined' ? 'bg-red-100 border-red-300 text-red-800' : 'border-gray-200 hover:border-red-300'}`}
                                    >Declined</button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => { setViewEventModalOpen(false); setSelectedEvent(null); }}
                                    className="flex-1 bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Application Details Modal */}
            {viewApplicationModalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-2xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => { setViewApplicationModalOpen(false); setSelectedApplication(null); setApplicationDetails(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
                        <div className="mb-6">
                            <h2 className="font-serif text-2xl mb-1">{selectedApplication.companyName}</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Corporate Application Details</p>
                        </div>

                        <div className="space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Company Name</label>
                                    <div className="font-medium">{selectedApplication.companyName}</div>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Employee Count</label>
                                    <div className="font-medium">{selectedApplication.employeeCount} employees</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Contact Email</label>
                                    <div className="font-medium text-sm">{selectedApplication.contactEmail}</div>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Application Date</label>
                                    <div className="font-medium">{selectedApplication.date}</div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Status</label>
                                <div>{getStatusBadge(selectedApplication.status)}</div>
                            </div>

                            {/* Full Details from API */}
                            {applicationDetails && (
                                <>
                                    {applicationDetails.contactName && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Contact Name</label>
                                                <div className="font-medium">{applicationDetails.contactName}</div>
                                            </div>
                                            {applicationDetails.phone && (
                                                <div>
                                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Phone</label>
                                                    <div className="font-medium">{applicationDetails.phone}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {applicationDetails.company?.industry && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Industry</label>
                                                <div className="font-medium">{applicationDetails.company.industry}</div>
                                            </div>
                                            {applicationDetails.company?.location && (
                                                <div>
                                                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Location</label>
                                                    <div className="font-medium">{applicationDetails.company.location}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {applicationDetails.mealTypes && (
                                        <div>
                                            <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Meal Types Requested</label>
                                            <div className="text-sm text-gray-600 bg-gray-50 p-3 border border-gray-100">{applicationDetails.mealTypes}</div>
                                        </div>
                                    )}

                                    {applicationDetails.dietaryFocus && (
                                        <div>
                                            <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Dietary Focus / Requirements</label>
                                            <div className="text-sm text-gray-600 bg-gray-50 p-3 border border-gray-100">{applicationDetails.dietaryFocus}</div>
                                        </div>
                                    )}

                                    {applicationDetails.notes && (
                                        <div>
                                            <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Additional Notes</label>
                                            <div className="text-sm text-gray-600 bg-gray-50 p-3 border border-gray-100">{applicationDetails.notes}</div>
                                        </div>
                                    )}

                                    {applicationDetails.invoiceAmount && (
                                        <div>
                                            <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Invoice Amount</label>
                                            <div className="font-mono font-bold text-lg">${parseFloat(applicationDetails.invoiceAmount).toLocaleString()}</div>
                                        </div>
                                    )}
                                </>
                            )}

                            {!applicationDetails && (
                                <div className="text-center text-gray-400 py-4">
                                    <Clock className="animate-spin mx-auto mb-2" size={20} />
                                    <p className="text-xs">Loading full details...</p>
                                </div>
                            )}

                            {/* Actions */}
                            {selectedApplication.status === ApplicationStatus.PENDING && (
                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setViewApplicationModalOpen(false);
                                            openApproveModal(selectedApplication.id);
                                        }}
                                        className="flex-1 bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800"
                                    >
                                        Approve & Set Invoice
                                    </button>
                                    <button
                                        onClick={() => {
                                            setViewApplicationModalOpen(false);
                                            handleReject(selectedApplication.id);
                                        }}
                                        className="flex-1 border border-red-200 text-red-600 py-4 text-xs uppercase tracking-widest hover:bg-red-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            {selectedApplication.status !== ApplicationStatus.PENDING && (
                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => { setViewApplicationModalOpen(false); setSelectedApplication(null); setApplicationDetails(null); }}
                                        className="flex-1 bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};