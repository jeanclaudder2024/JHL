import React from 'react';
import { User, UserRole } from '../types';
import { IndividualDashboard } from '../components/IndividualDashboard';
import { CompanyDashboard } from '../components/CompanyDashboard';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="bg-white border-b border-gray-100 pt-8 md:pt-10 pb-16 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">
            {user.role === UserRole.COMPANY_ADMIN ? user.companyName : `Hello, ${user.name}`}
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            {user.role === UserRole.COMPANY_ADMIN 
              ? 'Manage your corporate membership and team.' 
              : 'Welcome back to your daily ritual.'}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 -mt-8 md:-mt-10">
        {user.role === UserRole.COMPANY_ADMIN ? (
          <CompanyDashboard user={user} />
        ) : (
          <IndividualDashboard user={user} />
        )}
      </div>
    </div>
  );
};
