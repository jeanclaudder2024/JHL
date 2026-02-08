import React, { useState } from 'react';
import { CompanyApplication, ApplicationStatus, User, SupportTicket, EventInquiry, Meal, UserRole } from '../types';
import { 
  Check, X, Clock, FileText, Users, Utensils, CreditCard, MessageSquare, 
  BarChart3, Search, ChevronRight, DollarSign, Send, Calendar, Upload, 
  MoreHorizontal, Plus, Filter, Download, Bell
} from 'lucide-react';

export const Admin: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'inbox' | 'clients' | 'menu' | 'finance' | 'support'>('inbox');
  const [inboxTab, setInboxTab] = useState<'applications' | 'events'>('applications');
  
  // -- STATE MANAGEMENT --
  const [notifications] = useState([
    { id: 1, text: "New Corporate Application: Apex Tech", time: "2m ago" },
    { id: 2, text: "Event Inquiry: Summer Gala", time: "15m ago" }
  ]);

  const [applications, setApplications] = useState<CompanyApplication[]>([
    { id: '1', companyName: 'TechFlow Systems', employeeCount: 120, contactEmail: 'hr@techflow.io', status: ApplicationStatus.PENDING, date: '2024-05-18' },
    { id: '2', companyName: 'Aura Creative', employeeCount: 45, contactEmail: 'sarah@aura.com', status: ApplicationStatus.APPROVED_PAID, date: '2024-05-15', invoiceAmount: '$3,200.00' },
    { id: '3', companyName: 'Nexus Finance', employeeCount: 300, contactEmail: 'ops@nexus.com', status: ApplicationStatus.REJECTED, date: '2024-05-10' },
    { id: '4', companyName: 'Global Corp', employeeCount: 50, contactEmail: 'admin@global.com', status: ApplicationStatus.APPROVED_UNPAID, date: '2024-05-20', invoiceAmount: '$5,000.00' },
  ]);

  const [events, setEvents] = useState<EventInquiry[]>([
    { id: 'e1', eventType: 'Product Launch', eventDate: '2024-08-12', guestCount: '150', contactName: 'Elena Fisher', contactEmail: 'elena@brand.com', location: 'SoHo Loft', status: 'New', budget: '$15k - $50k' },
    { id: 'e2', eventType: 'Private Dinner', eventDate: '2024-06-20', guestCount: '20', contactName: 'Marcus Low', contactEmail: 'm.low@gmail.com', location: 'Private Residence', status: 'In Discussion', budget: '$5k - $15k' },
    { id: 'e3', eventType: 'Wedding', eventDate: '2024-09-01', guestCount: '200', contactName: 'Sophie Turner', contactEmail: 'sophie@wed.com', location: 'Botanical Gardens', status: 'Confirmed', budget: '$50k+' },
  ]);

  const [users] = useState<User[]>([
    { id: 'u1', name: 'John Doe', email: 'john@example.com', role: UserRole.INDIVIDUAL },
    { id: 'u2', name: 'Sarah Jenkins', email: 'sarah@aura.com', role: UserRole.COMPANY_ADMIN, companyName: 'Aura Creative' },
    { id: 'u3', name: 'Mike Ross', email: 'mike@pearson.com', role: UserRole.INDIVIDUAL },
    { id: 'u4', name: 'Alice Cooper', email: 'alice@acme.com', role: UserRole.INDIVIDUAL, companyName: 'Acme Corp' },
  ]);

   const [tickets] = useState<SupportTicket[]>([
    { id: 'T-101', user: 'John Doe', subject: 'Late Delivery', status: 'Open', lastMessage: 'My lunch arrived 30 mins late.', date: '2024-05-20' },
    { id: 'T-102', user: 'Sarah Jenkins', subject: 'Invoice Question', status: 'Resolved', lastMessage: 'Thank you for clarifying.', date: '2024-05-18' },
  ]);

  const [menuItems, setMenuItems] = useState<Meal[]>([
    { id: 'm1', name: 'Miso Glazed Salmon', description: 'Wild caught salmon...', calories: 650, date: '2024-05-20', type: 'Standard', image: 'https://picsum.photos/id/1080/200/200' },
    { id: 'm2', name: 'Truffle Risotto', description: 'Creamy arborio...', calories: 580, date: '2024-05-20', type: 'Vegetarian', image: 'https://picsum.photos/id/292/200/200' },
  ]);

  // -- MODAL STATES --
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [menuUploadOpen, setMenuUploadOpen] = useState(false);

  // -- ACTIONS --
  const handleApprove = () => {
    if (!selectedAppId || !invoiceAmount) return;
    setApplications(apps => apps.map(app => 
        app.id === selectedAppId 
        ? { ...app, status: ApplicationStatus.APPROVED_UNPAID, invoiceAmount: invoiceAmount } 
        : app
    ));
    setBillingModalOpen(false);
    setSelectedAppId(null);
  };

  const handleReject = (id: string) => {
    if (window.confirm('Are you sure you want to reject this application? This action cannot be undone.')) {
      setApplications(apps => apps.map(app => 
          app.id === id 
          ? { ...app, status: ApplicationStatus.REJECTED } 
          : app
      ));
    }
  };

  const openApproveModal = (id: string) => {
    setSelectedAppId(id);
    
    // Smart Invoice Generation
    // Calculate suggested amount: Base Fee ($500) + Per Employee Fee ($25)
    const app = applications.find(a => a.id === id);
    if (app) {
        const estimatedAmount = 500 + (app.employeeCount * 25);
        setInvoiceAmount(`$${estimatedAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
    } else {
        setInvoiceAmount('');
    }
    
    setBillingModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
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
                                                {app.status === ApplicationStatus.PENDING && (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => openApproveModal(app.id)} className="text-xs bg-black text-white px-3 py-1.5 uppercase tracking-wider hover:bg-gray-800">Approve</button>
                                                        <button onClick={() => handleReject(app.id)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 uppercase tracking-wider hover:border-red-500 hover:text-red-500 transition-colors">Reject</button>
                                                    </div>
                                                )}
                                                {app.status !== ApplicationStatus.PENDING && (
                                                     <button className="text-gray-400 hover:text-black"><MoreHorizontal size={18} /></button>
                                                )}
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
                                                <button className="text-xs border border-gray-300 px-3 py-1.5 uppercase tracking-wider hover:border-black hover:text-black transition-colors">Details</button>
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
                             <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-xs uppercase tracking-widest hover:border-black transition-colors"><Filter size={14}/> Filter</button>
                             <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-xs uppercase tracking-widest hover:border-black transition-colors"><Download size={14}/> Export</button>
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
                             <button className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 transition-colors">
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
                                         <button className="text-xs font-medium hover:underline">Edit Details</button>
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

    </div>
  );
};