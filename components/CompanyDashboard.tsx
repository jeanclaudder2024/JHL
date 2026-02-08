import React, { useState } from 'react';
import { Users, FileText, Settings, CreditCard, Plus, Mail, Trash2, PieChart, Download } from 'lucide-react';
import { User, Employee, Invoice } from '../types';

interface CompanyDashboardProps {
  user: User;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'billing' | 'settings'>('employees');

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'Alice Cooper', email: 'alice@acme.com', status: 'Active', dietary: 'Vegetarian' },
    { id: '2', name: 'Bob Smith', email: 'bob@acme.com', status: 'Active', dietary: 'Standard' },
    { id: '3', name: 'Charlie Day', email: 'charlie@acme.com', status: 'Invited', dietary: 'None' },
  ]);

  const [invoices] = useState<Invoice[]>([
    { id: 'INV-2024-001', date: 'May 01, 2024', amount: '$4,200.00', status: 'Paid', items: 'April Catering (120 meals)' },
    { id: 'INV-2024-002', date: 'Jun 01, 2024', amount: '$4,200.00', status: 'Pending', items: 'May Catering (120 meals)' },
  ]);

  const [paymentMethods] = useState([
    { id: 'pm_1', type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
  ]);

  const renderContent = () => {
    switch(activeTab) {
      case 'employees':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center">
               <h2 className="font-serif text-2xl md:text-3xl">Team Management</h2>
               <button className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors">
                 <Plus size={14} /> Invite Employee
               </button>
             </div>
             
             <div className="bg-white border border-gray-200 shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-500 font-medium">
                  <div className="col-span-4">Name / Email</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-3">Dietary Pref</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {employees.map(emp => (
                    <div key={emp.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-50">
                      <div className="col-span-4">
                        <div className="font-medium text-sm">{emp.name}</div>
                        <div className="text-xs text-gray-400">{emp.email}</div>
                      </div>
                      <div className="col-span-3">
                         <span className={`px-2 py-1 text-[10px] uppercase tracking-wide rounded-full ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                           {emp.status}
                         </span>
                      </div>
                      <div className="col-span-3 text-sm text-gray-600">
                        {emp.dietary}
                      </div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <button className="text-gray-400 hover:text-black"><Mail size={16} /></button>
                        <button className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-serif text-2xl md:text-3xl">Company Billing</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-black text-white p-6">
                 <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Next Invoice</div>
                 <div className="text-2xl font-serif mb-1">$4,200.00</div>
                 <div className="text-xs text-gray-400">Due July 01</div>
               </div>
               <div className="bg-zinc-100 p-6 border border-zinc-200">
                 <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Total Meals YTD</div>
                 <div className="text-2xl font-serif">1,450</div>
               </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-lg">Payment Methods</h3>
                    <button className="text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add New
                    </button>
                </div>
                <div className="space-y-4">
                    {paymentMethods.map(pm => (
                        <div key={pm.id} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-7 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">
                                   {pm.type}
                                </div>
                                <div>
                                    <div className="font-medium text-sm">Ending in {pm.last4}</div>
                                    <div className="text-xs text-gray-500">Expires {pm.expiry} {pm.isDefault && <span className="ml-2 text-green-600 bg-green-50 px-1 rounded font-medium">Default</span>}</div>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-black">
                                <Settings size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoice History */}
            <div className="bg-white border border-gray-200">
              <div className="p-4 border-b border-gray-100 font-serif text-lg flex justify-between items-center">
                  <span>Invoice History</span>
                  <button className="text-xs uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2">
                    <Download size={14} /> Download All
                  </button>
              </div>
              <div className="divide-y divide-gray-100">
                {invoices.map(inv => (
                  <div key={inv.id} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="p-2 bg-gray-50 rounded"><FileText size={20} className="text-gray-400" /></div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{inv.items}</div>
                        <div className="text-xs text-gray-400">{inv.id} • {inv.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-8">
                       <span className="font-serif">{inv.amount}</span>
                       <span className={`px-3 py-1 text-[10px] uppercase rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                         {inv.status}
                       </span>
                       <button className="text-xs underline text-gray-500 hover:text-black">PDF</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'settings':
         return (
           <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="font-serif text-2xl md:text-3xl mb-8">Company Settings</h2>
             <form className="space-y-6 bg-white p-8 border border-gray-100 shadow-sm">
               <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider text-gray-500">Company Name</label>
                 <input type="text" defaultValue={user.companyName || "Acme Corp"} className="w-full border-b border-gray-300 py-2 focus:border-black outline-none" />
               </div>
               <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider text-gray-500">Billing Email</label>
                 <input type="email" defaultValue={user.email} className="w-full border-b border-gray-300 py-2 focus:border-black outline-none" />
               </div>
               <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider text-gray-500">Default Meal Program</label>
                 <select className="w-full border-b border-gray-300 py-2 focus:border-black outline-none bg-transparent">
                   <option>Standard Balanced</option>
                   <option>Vegetarian Heavy</option>
                 </select>
               </div>
               <button className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                 Save Changes
               </button>
             </form>
           </div>
         );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 flex-shrink-0 z-10">
        <div className="bg-white shadow-sm border border-gray-100 p-2">
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 no-scrollbar pb-1 md:pb-0">
            <button 
              onClick={() => setActiveTab('employees')}
              className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'employees' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={18} />
              <span>Employees</span>
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'billing' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CreditCard size={18} />
              <span>Billing</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow pt-4 md:pt-0">
        {renderContent()}
      </div>
    </div>
  );
};
